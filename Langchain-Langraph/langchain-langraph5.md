# Agentic Design Patterns, Part 2: With a Real LLM (OpenAI, then local Qwen)

```bash
pip install langgraph langchain langchain-openai pydantic pytest
export OPENAI_API_KEY="<your key>"      # env var only; never put it in code or git
```
Cost note: use a small model (e.g. `gpt-4o-mini`) while learning, and set a spending limit in your OpenAI dashboard.

## 0. The one file everything shares

```python name=models.py
import os
from langchain.chat_models import init_chat_model

def get_model(temperature: float = 0):
    """Single place to choose the model. Part 2's last section swaps this."""
    name = os.environ.get("LLM_MODEL", "openai:gpt-4o-mini")
    return init_chat_model(name, temperature=temperature, timeout=30, max_retries=2)
```
`temperature=0` makes outputs steadier, which suits routers and graders. Timeouts and retries stop a stuck call from hanging your graph.

Three building blocks used throughout:

| Need | Tool | Why |
|---|---|---|
| Free text | `model.invoke(prompt).content` | Simple |
| A decision or data | `model.with_structured_output(PydanticClass)` | Validated object, no JSON parsing by hand |
| Calling functions | `model.bind_tools([fn])` | Model returns `tool_calls`; your code runs them |

---

## 1. Prompt chaining
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from models import get_model
llm = get_model()

class S(TypedDict):
    topic: str; outline: str; draft: str

def outline(s): return {"outline": llm.invoke(f"Give a 3-point outline about: {s['topic']}").content}
def gate(s):    return "write" if len(s["outline"].strip()) > 10 else END     # cheap check, no LLM needed
def write(s):   return {"draft": llm.invoke(f"Write a short paragraph from this outline:\n{s['outline']}").content}

g = StateGraph(S)
g.add_node("outline", outline); g.add_node("write", write)
g.add_edge(START, "outline"); g.add_conditional_edges("outline", gate); g.add_edge("write", END)
print(g.compile().invoke({"topic": "cats", "outline": "", "draft": ""})["draft"])
```
Tip: a gate can be plain Python (length, regex) and doesn't always need a second model call.

## 2. Routing
```python
from typing import Literal, TypedDict
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from models import get_model

class Route(BaseModel):
    kind: Literal["math", "greeting", "other"]       # model must pick one of these

router = get_model().with_structured_output(Route)

class S(TypedDict):
    q: str; a: str

def pick(s): return router.invoke(f"Classify this message: {s['q']}").kind

g = StateGraph(S)
g.add_node("math",     lambda s: {"a": "calculator path"})
g.add_node("greeting", lambda s: {"a": "hello!"})
g.add_node("other",    lambda s: {"a": "general path"})
g.add_conditional_edges(START, pick)
for n in ("math", "greeting", "other"): g.add_edge(n, END)
print(g.compile().invoke({"q": "what is 12*7?", "a": ""})["a"])
```
Using `Literal` means the model cannot invent a route name.

## 3. Parallelization
```python
import operator
from typing import Annotated, TypedDict
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from models import get_model

class Check(BaseModel):
    problem: bool
    reason: str

def checker(rule: str):
    m = get_model().with_structured_output(Check)
    def node(s):
        r = m.invoke(f"Rule: {rule}\nText: {s['text']}\nDoes the text break the rule?")
        return {"issues": [f"{rule}: {r.reason}"] if r.problem else []}
    return node

class S(TypedDict):
    text: str
    issues: Annotated[list[str], operator.add]       # reducer for parallel writes
    verdict: str

g = StateGraph(S)
for name, rule in [("tone", "must be polite"), ("pii", "must not contain personal data"),
                   ("spam", "must not be advertising")]:
    g.add_node(name, checker(rule)); g.add_edge(START, name); g.add_edge(name, "decide")
g.add_node("decide", lambda s: {"verdict": "reject" if s["issues"] else "ok"})
g.add_edge("decide", END)
print(g.compile().invoke({"text": "Call me on 555-1234, you idiot", "issues": [], "verdict": ""}))
```
Three calls run at the same time, so the total time is about that of one call.

## 4. Orchestrator-workers
```python
import operator
from typing import Annotated, TypedDict
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from models import get_model

class Plan(BaseModel):
    sections: list[str]

planner = get_model().with_structured_output(Plan)
writer = get_model()

class S(TypedDict):
    topic: str; sections: list[str]
    parts: Annotated[list[str], operator.add]; report: str

def orchestrate(s):
    return {"sections": planner.invoke(f"List 3 to 5 section titles for a report on {s['topic']}").sections[:5]}  # cap
def dispatch(s):  return [Send("worker", {"title": t, "topic": s["topic"]}) for t in s["sections"]]
def worker(s):    return {"parts": [f"## {s['title']}\n" + writer.invoke(
                      f"Write 2 sentences for the section '{s['title']}' of a report on {s['topic']}.").content]}
def combine(s):   return {"report": "\n\n".join(s["parts"])}

g = StateGraph(S)
g.add_node("orchestrate", orchestrate); g.add_node("worker", worker); g.add_node("combine", combine)
g.add_edge(START, "orchestrate"); g.add_conditional_edges("orchestrate", dispatch, ["worker"])
g.add_edge("worker", "combine"); g.add_edge("combine", END)
print(g.compile().invoke({"topic": "solar power", "sections": [], "parts": [], "report": ""})["report"])
```
Section order in `parts` may vary, because the workers finish in any order. Cap the number of workers, since each one costs money.

## 5. Reflection
```python
from typing import TypedDict
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from models import get_model

class Review(BaseModel):
    good_enough: bool
    feedback: str

writer, critic = get_model(0.7), get_model().with_structured_output(Review)

class S(TypedDict):
    task: str; draft: str; feedback: str; ok: bool; rounds: int

def write(s):
    p = f"Task: {s['task']}"
    if s["feedback"]: p += f"\nPrevious draft: {s['draft']}\nFix this feedback: {s['feedback']}"
    return {"draft": writer.invoke(p).content, "rounds": s["rounds"] + 1}
def critique(s):
    r = critic.invoke(f"Task: {s['task']}\nDraft: {s['draft']}\nIs it good enough? Be strict and give feedback.")
    return {"ok": r.good_enough, "feedback": r.feedback}
def route(s): return END if s["ok"] or s["rounds"] >= 3 else "write"       # hard cap

g = StateGraph(S)
g.add_node("write", write); g.add_node("critique", critique)
g.add_edge(START, "write"); g.add_edge("write", "critique"); g.add_conditional_edges("critique", route)
out = g.compile().invoke({"task": "Write a one-line slogan for a coffee shop", "draft": "", "feedback": "", "ok": False, "rounds": 0})
print(out["draft"], "| rounds:", out["rounds"])
```
Models are often too kind as critics, so give the critic specific criteria.

## 6. Tool use (ReAct), prebuilt
```python
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent        # in v1: langchain.agents.create_agent
from models import get_model

@tool
def add(a: int, b: int) -> int:
    """Add two integers."""             # the model reads this to decide when to call it
    return a + b

@tool
def word_count(text: str) -> int:
    """Count words in text."""
    return len(text.split())

agent = create_react_agent(get_model(), tools=[add, word_count])
out = agent.invoke({"messages": [("user", "What is 17+25, and how many words in 'to be or not'?")]},
                   config={"recursion_limit": 10})            # step cap
for m in out["messages"]:
    print(m.type, getattr(m, "tool_calls", "") or m.content)
```
Hand-built version (shows what the prebuilt one does):
```python
from langchain_core.messages import ToolMessage
from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode, tools_condition

model = get_model().bind_tools([add, word_count])
g = StateGraph(MessagesState)
g.add_node("agent", lambda s: {"messages": [model.invoke(s["messages"])]})
g.add_node("tools", ToolNode([add, word_count], handle_tool_errors=True))   # errors go back to the model
g.add_edge(START, "agent"); g.add_conditional_edges("agent", tools_condition); g.add_edge("tools", "agent")
```
Security: give tools only the minimum power (read-only where possible). Validate arguments inside each tool. Never let the model pick file paths, URLs or shell commands without checks.

## 7. Plan-and-execute
```python
import operator
from typing import Annotated, TypedDict
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from models import get_model

class Plan(BaseModel):
    steps: list[str]

planner, worker = get_model().with_structured_output(Plan), get_model()

class S(TypedDict):
    goal: str; plan: list[str]; done: Annotated[list[str], operator.add]; answer: str

def make_plan(s): return {"plan": planner.invoke(f"Break this goal into at most 4 short steps: {s['goal']}").steps[:4]}
def execute(s):
    step = s["plan"][len(s["done"])]
    return {"done": [worker.invoke(f"Goal: {s['goal']}\nDone so far: {s['done']}\nDo this step briefly: {step}").content]}
def more(s): return "execute" if len(s["done"]) < len(s["plan"]) else "finish"
def finish(s): return {"answer": worker.invoke(f"Combine into a final answer:\n{s['done']}").content}

g = StateGraph(S)
g.add_node("plan", make_plan); g.add_node("execute", execute); g.add_node("finish", finish)
g.add_edge(START, "plan"); g.add_edge("plan", "execute")
g.add_conditional_edges("execute", more); g.add_edge("finish", END)
print(g.compile().invoke({"goal": "Plan a 2-day trip to Rome", "plan": [], "done": [], "answer": ""})["answer"])
```

## 8. Corrective RAG
```python
from typing import TypedDict
from pydantic import BaseModel
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings
from langgraph.graph import StateGraph, START, END
from models import get_model

store = InMemoryVectorStore(OpenAIEmbeddings(model="text-embedding-3-small"))
store.add_documents([Document(page_content="LangGraph builds stateful agent workflows."),
                     Document(page_content="Chroma is a vector database.")])

class Grade(BaseModel):
    relevant: bool

grader, llm = get_model().with_structured_output(Grade), get_model()

class S(TypedDict):
    q: str; docs: list[str]; answer: str

def retrieve(s): return {"docs": [d.page_content for d in store.similarity_search(s["q"], k=2)]}
def grade(s):
    r = grader.invoke(f"Question: {s['q']}\nDocs: {s['docs']}\nAre the docs relevant to the question?")
    return "generate" if r.relevant else "fallback"
def fallback(s): return {"docs": ["(web search would go here)"]}        # plug a real search tool in later
def generate(s):
    return {"answer": llm.invoke(f"Answer ONLY from this context. If missing, say you don't know.\n"
                                 f"Context: {s['docs']}\nQuestion: {s['q']}").content}

g = StateGraph(S)
g.add_node("retrieve", retrieve); g.add_node("fallback", fallback); g.add_node("generate", generate)
g.add_edge(START, "retrieve"); g.add_conditional_edges("retrieve", grade)
g.add_edge("fallback", "generate"); g.add_edge("generate", END)
print(g.compile().invoke({"q": "What is LangGraph?", "docs": [], "answer": ""})["answer"])
```
Retrieved text is untrusted. It can contain instructions aimed at your model, so keep the "answer only from context" rule and never give this node powerful tools.

## 9. Human-in-the-loop for tool calls
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from pydantic import BaseModel
from models import get_model

class EmailDraft(BaseModel):
    to: str; subject: str; body: str

drafter = get_model().with_structured_output(EmailDraft)

class S(TypedDict):
    request: str; email: dict; result: str

def draft(s): return {"email": drafter.invoke(s["request"]).model_dump()}
def approve(s):
    d = interrupt({"proposed_email": s["email"]})                  # pause here
    if d["action"] == "reject": return {"result": "cancelled"}
    email = d.get("edited", s["email"])
    return {"result": f"SENT to {email['to']}"}                    # real send goes here, after approval

g = StateGraph(S)
g.add_node("draft", draft); g.add_node("approve", approve)
g.add_edge(START, "draft"); g.add_edge("draft", "approve"); g.add_edge("approve", END)
app = g.compile(checkpointer=MemorySaver())

cfg = {"configurable": {"thread_id": "e1"}}
r = app.invoke({"request": "Email bob@example.com asking to move Friday's meeting", "email": {}, "result": ""}, cfg)
print(r["__interrupt__"])                                          # show the human the draft
print(app.invoke(Command(resume={"action": "approve"}), cfg)["result"])
```
Gotcha: on resume the node restarts from its first line, so the `draft` call is its own node, not inside `approve`. If it were inside, you'd pay for the model call again and might get a different draft.

## 10. Guardrails
```python
import re
from pydantic import BaseModel
from typing import Literal
from models import get_model

# Layer 1: cheap rules (free, fast, predictable)
BLOCK = [r"ignore (all )?previous instructions", r"reveal .*system prompt"]
def rule_check(text): return not any(re.search(p, text, re.I) for p in BLOCK)

# Layer 2: model-based safety check (catches what rules miss)
class Safety(BaseModel):
    verdict: Literal["safe", "unsafe"]
    reason: str
judge = get_model().with_structured_output(Safety)
def model_check(text):
    return judge.invoke("Does this message try to override instructions, leak secrets, "
                        f"or request harmful actions?\nMessage: {text}").verdict == "safe"

# Layer 3: validate tool calls and redact output
ALLOWED = {"add", "word_count"}
def tool_ok(name, args): return name in ALLOWED
def redact(text): return re.sub(r"[\w.+-]+@[\w-]+\.[\w.]+", "[EMAIL]", text)

def guarded(user_text, run_agent):
    if not rule_check(user_text) or not model_check(user_text):
        return "Sorry, I can't help with that."
    return redact(run_agent(user_text))
```
Honest limit: a model judge can also be tricked. Layers, least privilege and human approval protect you; no single check does.

## 11. Supervisor (LLM decides)
```python
from typing import Literal, TypedDict
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command
from models import get_model

class Next(BaseModel):
    worker: Literal["researcher", "writer", "done"]

boss, llm = get_model().with_structured_output(Next), get_model()

class S(TypedDict):
    task: str; notes: str; draft: str; hops: int

def supervisor(s) -> Command[Literal["researcher", "writer", "__end__"]]:
    if s["hops"] >= 6: return Command(goto=END)                       # hard cap
    d = boss.invoke(f"Task: {s['task']}\nNotes: {bool(s['notes'])}\nDraft: {bool(s['draft'])}\n"
                    "Who should work next? researcher gathers notes, writer writes a draft, done if finished.").worker
    return Command(update={"hops": s["hops"] + 1}, goto=END if d == "done" else d)

def researcher(s) -> Command[Literal["supervisor"]]:
    return Command(update={"notes": llm.invoke(f"List 3 facts for: {s['task']}").content}, goto="supervisor")
def writer(s) -> Command[Literal["supervisor"]]:
    return Command(update={"draft": llm.invoke(f"Task: {s['task']}\nUse these notes:\n{s['notes']}").content}, goto="supervisor")

g = StateGraph(S)
for n, f in [("supervisor", supervisor), ("researcher", researcher), ("writer", writer)]: g.add_node(n, f)
g.add_edge(START, "supervisor")
print(g.compile().invoke({"task": "Write about tides", "notes": "", "draft": "", "hops": 0})["draft"])
```
There are also prebuilt libraries (`langgraph-supervisor`, `langgraph-swarm`), but build it by hand first to see how it works.

---

## Testing with a real LLM

Don't assert exact text. Test structure and behaviour.
```python
# test_patterns.py: run the stub-based tests in CI; run the live tests manually
import os, pytest
live = pytest.mark.skipif("OPENAI_API_KEY" not in os.environ, reason="needs key")

@live
def test_router_picks_math():
    assert pick({"q": "what is 12*7?"}) == "math"

@live
def test_reflection_stops_by_cap():
    out = app.invoke({...})
    assert out["rounds"] <= 3
```
Use a fake model in CI so tests are free and repeatable: `FakeListChatModel` or `GenericFakeChatModel`. For quality checks, keep a small fixed question set and run it before each model change.

## Cost and safety checklist
- [ ] Every loop has a step cap and `recursion_limit`
- [ ] Every model call has a timeout and `max_retries`
- [ ] Temperature 0 for routers, graders and extraction
- [ ] Fan-out sizes are capped (Send, workers)
- [ ] Log token usage (`UsageMetadataCallbackHandler`), and set a provider-side spend limit
- [ ] Keys are in env vars, `.env` is git-ignored
- [ ] User and retrieved text are treated as untrusted
- [ ] Risky actions need human approval

---

# Part 3: Swapping in local Qwen (Hugging Face, your GPU)

## 3.1 How to serve it

You have three options. The recommended one changes almost no code, because `get_model()` is the only file you edit.

| Option | How | Verdict |
|---|---|---|
| **A. vLLM server** (OpenAI-compatible API) | `vllm serve Qwen/Qwen2.5-7B-Instruct ...` then point `ChatOpenAI` at it | **Recommended**: tools and structured output work |
| B. Ollama | `ollama run qwen2.5:7b`, then `init_chat_model("ollama:qwen2.5:7b")` | Easiest setup, decent tool support |
| C. `transformers` pipeline in-process | `ChatHuggingFace(llm=HuggingFacePipeline...)` | Simplest to understand, **weakest** for agents |

Option A:
```bash
pip install vllm langchain-openai
vllm serve Qwen/Qwen2.5-7B-Instruct --port 8000 \
     --enable-auto-tool-choice --tool-call-parser hermes     # needed for tool calling
```
```python name=models.py
import os
from langchain_openai import ChatOpenAI

def get_model(temperature: float = 0):
    if os.environ.get("LLM_BACKEND") == "local":
        return ChatOpenAI(model="Qwen/Qwen2.5-7B-Instruct",
                          base_url="http://127.0.0.1:8000/v1",   # bind to localhost only
                          api_key="not-needed", temperature=temperature, timeout=120, max_retries=2)
    from langchain.chat_models import init_chat_model
    return init_chat_model("openai:gpt-4o-mini", temperature=temperature, timeout=30, max_retries=2)
```
Security: vLLM has no auth by default. Bind it to `127.0.0.1` and never expose the port to a network. Also only load models from sources you trust. Prefer `safetensors` weights, and avoid `trust_remote_code=True` unless you've read the code.

Option C, for reference:
```python
from langchain_huggingface import ChatHuggingFace, HuggingFacePipeline
pipe = HuggingFacePipeline.from_model_id("Qwen/Qwen2.5-7B-Instruct", task="text-generation",
        pipeline_kwargs={"max_new_tokens": 512, "do_sample": False}, device=0)
model = ChatHuggingFace(llm=pipe)
```

## 3.2 Which model size fits which GPU (rough guide, 16-bit weights)

| Model | VRAM needed (approx.) |
|---|---|
| Qwen2.5-1.5B / 3B Instruct | 4 to 8 GB |
| Qwen2.5-7B Instruct | ~16 GB (less with 4-bit quantization) |
| Qwen2.5-14B Instruct | ~32 GB (or ~10 to 12 GB at 4-bit) |
| Qwen3 family | Similar sizes. Check the model card for its tool-call format |

Add headroom for the context window (KV cache). Use a **7B or larger instruct model** for agent work. Models under 3B often fail at tool calling.

## 3.3 What works and what doesn't

| Pattern / feature | OpenAI | Qwen 7B local (vLLM) | Notes |
|---|---|---|---|
| 1 Chaining | ✅ | ✅ | Plain text, works fine |
| 2 Routing (`Literal` structured output) | ✅ | ✅ with vLLM | Uses guided decoding; the output shape is enforced. Weak on option C |
| 3 Parallelization | ✅ | ⚠️ | Works, but a single GPU serves requests in batches. Speedup is smaller and vLLM batches well |
| 4 Orchestrator-workers | ✅ | ⚠️ | Plan quality is lower; cap and validate section lists |
| 5 Reflection | ✅ | ⚠️ | Small models are lenient critics, so give explicit checklists and keep the round cap |
| 6 Tool use (`bind_tools`) | ✅ | ⚠️ | Works on vLLM with the hermes parser. Argument errors are more common, and parallel tool calls are shaky. Not reliable on option C |
| 7 Plan-and-execute | ✅ | ⚠️ | Plans are shorter and less careful. Validate step count |
| 8 Corrective RAG | ✅ | ✅ | Needs a local embedding model (`bge-m3`, `nomic-embed`), because OpenAI embeddings won't be used. Re-index, because vectors from different models aren't comparable |
| 9 Human-in-the-loop | ✅ | ✅ | Model-independent. Drafting quality is lower |
| 10 Guardrails | ✅ | ✅ rules / ⚠️ model judge | Rules are unchanged. A local 7B judge is easier to fool, so lean on rules and allow-lists |
| 11 Supervisor | ✅ | ⚠️ | Routing works with `Literal` output; long multi-agent chats degrade |

Legend: ✅ works as-is, ⚠️ works with changes or lower quality.

**Things that break or change**
1. **Structured output** is the biggest risk. It is solid with vLLM (guided decoding). With plain `transformers` it is prompt-based, so expect malformed JSON. Add a retry:
```python
def invoke_with_retry(chain, prompt, tries=3):
    for _ in range(tries):
        try:
            return chain.invoke(prompt)
        except Exception as e:                 # parse or validation error
            prompt += f"\nYour last reply was invalid ({e}). Return valid output only."
    raise RuntimeError("model kept returning invalid output")
```
2. **Context length.** Local models typically have a smaller usable context (check the model card). Trim history with `trim_messages` and keep prompts short.
3. **Speed.** A 7B model on one GPU answers in seconds, not milliseconds. Fan-out patterns queue up, and timeouts of 30s are too short, so use 120s or more.
4. **Embeddings differ.** Re-embed every document when you change embedding models.
5. **Prompts need tuning.** Prompts that work on OpenAI models often need more explicit instructions, examples (few-shot) and shorter tasks for a 7B model.
6. **`init_chat_model("openai:...")` string no longer applies.** Use the `ChatOpenAI(base_url=...)` form above.
7. **No built-in moderation endpoint.** Anything that relied on OpenAI's moderation needs a replacement (e.g. a local classifier such as Llama Guard).
8. **Streaming of tool calls** differs between servers, so test `stream_mode="messages"` before relying on it.

## 3.4 Migration steps
1. Start the vLLM server and check it: `curl http://127.0.0.1:8000/v1/models`.
2. `export LLM_BACKEND=local`, and nothing else changes in the pattern files.
3. Run the live tests from the testing section. Expect failures in patterns 5, 6 and 11 first.
4. Fix prompts, add `invoke_with_retry`, and tighten the caps.
5. Re-embed documents for pattern 8 using a local embedding model.
6. Record a small fixed question set and compare pass rates, OpenAI against Qwen, before deciding what to run locally.

## 3.5 Rule of thumb
Run **routing, extraction, grading, summarising and RAG answers** on local Qwen. Keep **long multi-step tool use and complex planning** on a stronger model, or use a 14B or larger Qwen. A mixed setup, with a small local model for cheap steps and a bigger one for hard steps, is common. It only needs two `get_model()` variants.

## Exercises

| # | Build | Expected |
|---|---|---|
| 1 | Chain: outline, gate, draft | Stops at the gate if the outline is empty |
| 2 | Router with 4 routes, run on 10 test questions | At least 8 of 10 correct |
| 3 | Reflection with a 3-point checklist critic | Ends within 3 rounds |
| 4 | Agent with 2 tools; ask a question needing both | Both tools appear in the message trace |
| 5 | Corrective RAG with a deliberately off-topic question | Fallback node runs |
| 6 | Human approval with an edited email address | Edited address is used |
| 7 | Run exercises 2 and 4 on Qwen via vLLM | Compare pass rates and note the failures |
| 8 | Add `invoke_with_retry` and re-run 7 | Pass rate improves |