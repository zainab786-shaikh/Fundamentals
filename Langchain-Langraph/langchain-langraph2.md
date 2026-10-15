# LangChain & LangGraph, Part 2: Advanced Topics (beginner-friendly)

```bash
pip install langgraph langchain langchain-core langchain-text-splitters pytest
```
Legend: 🔑 = needs a real model or server. Everything else runs offline.

---

# PART A: LangChain (the "LLM half")

## A1. Real chat models 🔑
```python
from langchain.chat_models import init_chat_model

# One function for any provider: "provider:model-name"
model = init_chat_model("openai:gpt-4o-mini")   # key is read from the OPENAI_API_KEY env var
print(model.invoke("Say hi").content)
```
No key? Use a local model with Ollama: `init_chat_model("ollama:llama3.1")`.
Never put keys in code.

**Offline stand-in for learning:**
```python
from langchain_core.language_models.fake_chat_models import FakeListChatModel
model = FakeListChatModel(responses=["hi!"])     # returns scripted replies in order
print(model.invoke("Say hi").content)            # hi!
```

## A2. Tool calling 🔑
A tool is a Python function the model may *ask* you to run. The model never runs it itself.
```python
from langchain_core.tools import tool

@tool
def add(a: int, b: int) -> int:
    """Add two integers."""     # the model reads this docstring to decide when to use it
    return a + b

model_with_tools = model.bind_tools([add])       # tell the model the tool exists
reply = model_with_tools.invoke("What is 2+3?")
print(reply.tool_calls)   # [{'name': 'add', 'args': {'a': 2, 'b': 3}, 'id': '...'}]
# Your code (or LangGraph's ToolNode) runs add(2, 3) and sends the result back.
```
The offline version is in Part 1, section 12.

## A3. Document loaders and text splitters
```python
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Loaders return Document objects (text + metadata).
# Real ones: TextLoader, PyPDFLoader, WebBaseLoader (from langchain-community).
docs = [Document(page_content="LangGraph builds workflows. " * 20, metadata={"source": "demo"})]

# Long text must be cut into chunks so retrieval stays precise
splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=20)  # overlap keeps context
chunks = splitter.split_documents(docs)
print(len(chunks), chunks[0].metadata)    # metadata is carried to every chunk
```

## A4. Embeddings and vector stores (offline)
An **embedding** turns text into numbers; similar texts get similar numbers. A **vector store** finds the nearest ones.
```python
from langchain_core.embeddings import DeterministicFakeEmbedding   # fake: random-but-repeatable
from langchain_core.vectorstores import InMemoryVectorStore

emb = DeterministicFakeEmbedding(size=64)
store = InMemoryVectorStore(emb)
store.add_texts(["cats purr", "dogs bark", "birds sing"])
print(store.similarity_search("cats purr", k=1)[0].page_content)   # exact text always matches
```
> Fake embeddings have **no meaning**: only identical text matches. Real ones (`init_embeddings("openai:text-embedding-3-small")` 🔑, or local Ollama and HuggingFace models) match by meaning.

## A5. Retrievers
A **retriever** is a runnable: question in, documents out.
```python
retriever = store.as_retriever(search_kwargs={"k": 2})
print(retriever.invoke("dogs bark"))
```

**Multi-query** (ask several phrasings, merge, dedupe). Normally an LLM writes the phrasings; here a simple function does.
```python
from langchain_core.runnables import RunnableLambda

def variants(q: str) -> list[str]:
    return [q, q.lower(), q.upper()]            # LLM would paraphrase here

def multi_query(q: str):
    seen, out = set(), []
    for v in variants(q):
        for d in retriever.invoke(v):
            if d.page_content not in seen:      # dedupe
                seen.add(d.page_content); out.append(d)
    return out

print(len(RunnableLambda(multi_query).invoke("cats purr")))
```

**Rerank** (fetch many, re-score, keep the best). Real rerankers are cross-encoders like Cohere Rerank. Here is a toy score:
```python
def rerank(q: str, docs, top=1):
    score = lambda d: sum(w in d.page_content for w in q.split())   # count matching words
    return sorted(docs, key=score, reverse=True)[:top]
```

**Parent-document idea:** search over small chunks (precise), but return the larger parent (more context). Use `ParentDocumentRetriever` (`langchain-classic` in v1), or keep a `{chunk_id: parent_text}` dict yourself.

## A6. Prompts: few-shot and `MessagesPlaceholder`
```python
from langchain_core.prompts import (ChatPromptTemplate, MessagesPlaceholder,
                                    FewShotChatMessagePromptTemplate)
from langchain_core.messages import HumanMessage, AIMessage

# Few-shot: show the model worked examples
examples = [{"q": "2+2", "a": "4"}, {"q": "3+3", "a": "6"}]
shots = FewShotChatMessagePromptTemplate(
    examples=examples,
    example_prompt=ChatPromptTemplate.from_messages([("human", "{q}"), ("ai", "{a}")]),
)

# MessagesPlaceholder: slot in a whole chat history at run time
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a calculator."),
    shots,
    MessagesPlaceholder("history"),
    ("human", "{q}"),
])
msgs = prompt.invoke({"history": [HumanMessage("hi"), AIMessage("hello")], "q": "5+5"})
print(len(msgs.to_messages()))    # system + 4 shot msgs + 2 history + 1 question = 8
```

## A7. Output parsers beyond text
```python
from pydantic import BaseModel
from langchain_core.output_parsers import JsonOutputParser, PydanticOutputParser

# JSON string -> dict
print(JsonOutputParser().parse('{"a": 1}'))          # {'a': 1}

# JSON string -> validated object (bad data raises an error)
class Person(BaseModel):
    name: str
    age: int
print(PydanticOutputParser(pydantic_object=Person).parse('{"name":"Ada","age":36}'))
```
- **Best option with real models:** `model.with_structured_output(Person)` 🔑. The provider enforces the shape.
- **Fix/retry parsers:** on a parse error, send the bad output and the error back to the model and ask it to repair it. Do it yourself:
```python
def parse_with_repair(text, parser, repair_fn, tries=2):
    for _ in range(tries):
        try:
            return parser.parse(text)
        except Exception as e:
            text = repair_fn(text, str(e))   # repair_fn would call the model
    raise ValueError("could not parse")
```

## A8. Caching and rate limiting model calls
```python
from langchain_core.caches import InMemoryCache
from langchain_core.globals import set_llm_cache
from langchain_core.rate_limiters import InMemoryRateLimiter

set_llm_cache(InMemoryCache())      # identical prompts are answered from cache (saves money)

limiter = InMemoryRateLimiter(requests_per_second=0.5)    # at most 1 call per 2 seconds
# model = init_chat_model("openai:gpt-4o-mini", rate_limiter=limiter)   🔑
```
Production: use a persistent cache (SQLite or Redis).

---

# PART B: LangGraph additions

## B1. Parallel interrupts and resume mapping
When several parallel nodes call `interrupt()`, each pause has an **id**. Resume them together with a `{id: value}` map.
```python
# result = app.invoke(inputs, cfg)
# pending = result["__interrupt__"]                       # list of Interrupt objects, each with .id
# app.invoke(Command(resume={i.id: "yes" for i in pending}), cfg)
```
The exact shape differs between versions, so check the "interrupts" page of the docs.

## B2. `Send` plus a subgraph
Each `Send` can target a *compiled subgraph*, so each item gets its own mini-workflow.
```python
import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

class Item(TypedDict):          # the subgraph's own state
    word: str
    out: Annotated[list[str], operator.add]    # key shared with the parent so results flow back

sub = StateGraph(Item)
sub.add_node("up", lambda s: {"out": [s["word"].upper()]})
sub.add_edge(START, "up"); sub.add_edge("up", END)

class Parent(TypedDict):
    words: list[str]
    out: Annotated[list[str], operator.add]

p = StateGraph(Parent)
p.add_node("sub", sub.compile())
p.add_conditional_edges(START, lambda s: [Send("sub", {"word": w}) for w in s["words"]], ["sub"])
p.add_edge("sub", END)
print(sorted(p.compile().invoke({"words": ["a", "b"], "out": []})["out"]))   # ['A', 'B']
```

## B3. Hooks around the model call
`create_react_agent(model, tools, pre_model_hook=fn, post_model_hook=fn)` lets you run code before and after each model call. Typical uses: trim history before, and check output (guardrails) after.
```python
from langchain_core.messages import trim_messages
def pre_model_hook(state):
    trimmed = trim_messages(state["messages"], max_tokens=20, token_counter=len, strategy="last")
    return {"llm_input_messages": trimmed}     # key name has changed across versions, so check
```
In newer v1 releases this moves to **middleware** in `langchain.agents.create_agent`.

## B4. Prebuilt multi-agent libraries 🔑
```bash
pip install langgraph-supervisor langgraph-swarm
```
```python
# from langgraph_supervisor import create_supervisor
# team = create_supervisor([researcher_agent, writer_agent], model=model).compile()
# Supervisor = a boss agent that delegates.
# Swarm      = peers that hand off to each other (langgraph_swarm.create_swarm).
```
They are the same pattern as Part 1, section 11, with an LLM making the routing decision.

## B5. `with_config`: preset settings on a graph
```python
app2 = app.with_config(recursion_limit=5, tags=["demo"])   # returns a configured copy
```

## B6. Durability modes
Controls when checkpoints are written (a speed vs. safety trade-off):
```python
# app.invoke(inp, cfg, durability="sync")   # saved before the next step (safest, slowest)
# app.invoke(inp, cfg, durability="async")  # saved in the background (default, fast)
# app.invoke(inp, cfg, durability="exit")   # saved only at the end (fastest, can't resume mid-run)
```

## B7. The store inside nodes (long-term memory)
The **checkpointer** remembers one thread. The **store** remembers things across threads (e.g. user preferences).
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.runtime import Runtime
from langgraph.store.memory import InMemoryStore

class State(TypedDict):
    user: str
    theme: str

def load_prefs(s, runtime: Runtime):
    item = runtime.store.get(("prefs",), s["user"])          # (namespace, key)
    return {"theme": item.value["theme"] if item else "light"}

store = InMemoryStore()
store.put(("prefs",), "ada", {"theme": "dark"})
g = StateGraph(State)
g.add_node("load", load_prefs)
g.add_edge(START, "load"); g.add_edge("load", END)
print(g.compile(store=store).invoke({"user": "ada", "theme": ""}))   # theme: dark
```
Older versions inject `store` as a node argument instead of `runtime`.

## B8. `ToolNode` error handling and injected arguments
```python
from typing import Annotated
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, InjectedState

@tool
def divide(a: int, b: int) -> float:
    """Divide a by b."""
    return a / b

# Errors become a message the model can read and recover from, instead of crashing
tools = ToolNode([divide], handle_tool_errors=True)

@tool
def whoami(state: Annotated[dict, InjectedState]) -> str:
    """Return the current user."""
    return state.get("user", "unknown")     # `state` is hidden from the model and filled in by LangGraph
```
`InjectedStore` works the same way: it hands the tool the store without the model seeing it.

## B9. MCP tools 🔑
MCP is a standard way for tools to live in separate servers.
```bash
pip install langchain-mcp-adapters
```
```python
# from langchain_mcp_adapters.client import MultiServerMCPClient
# client = MultiServerMCPClient({"math": {"command": "python", "args": ["math_server.py"], "transport": "stdio"}})
# tools = await client.get_tools()       # these are normal LangChain tools
```
Only connect to MCP servers you trust. Their tool output can contain prompt injection.

---

# PART C: Agent design patterns (all offline here)

Each "model" is a scripted function. Swap in a real model later and the graph stays the same.

## C1. Plan-and-execute
Make a plan once, run each step, then summarize.
```python
import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    goal: str
    plan: list[str]
    done: Annotated[list[str], operator.add]
    answer: str

def planner(s):   return {"plan": ["find data", "analyze", "write"]}      # LLM would plan here
def executor(s):
    step = s["plan"][len(s["done"])]                                       # next unfinished step
    return {"done": [f"did {step}"]}
def more(s):      return "executor" if len(s["done"]) < len(s["plan"]) else "summarize"

g = StateGraph(State)
g.add_node("planner", planner); g.add_node("executor", executor)
g.add_node("summarize", lambda s: {"answer": "; ".join(s["done"])})
g.add_edge(START, "planner"); g.add_edge("planner", "executor")
g.add_conditional_edges("executor", more)
g.add_edge("summarize", END)
print(g.compile().invoke({"goal": "report", "plan": [], "done": [], "answer": ""})["answer"])
```

## C2. Reflection / critique loop
Write, critique, revise; stop when good enough **or** after N tries.
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    draft: str
    feedback: str
    rounds: int

def write(s):    return {"draft": s["draft"] + "!", "rounds": s["rounds"] + 1}   # LLM drafts
def critique(s): return {"feedback": "ok" if s["draft"].count("!") >= 3 else "add more"}  # LLM critic
def route(s):    return END if s["feedback"] == "ok" or s["rounds"] >= 5 else "write"  # always cap rounds!

g = StateGraph(State)
g.add_node("write", write); g.add_node("critique", critique)
g.add_edge(START, "write"); g.add_edge("write", "critique")
g.add_conditional_edges("critique", route)
print(g.compile().invoke({"draft": "Hi", "feedback": "", "rounds": 0}))   # draft: 'Hi!!!'
```

## C3. Corrective RAG (check retrieved docs, fall back if bad)
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    q: str
    docs: list[str]
    answer: str

KB = {"langgraph": "LangGraph builds stateful workflows."}

def retrieve(s):   return {"docs": [KB[s["q"]]] if s["q"] in KB else []}
def grade(s):      return "generate" if s["docs"] else "web_search"    # LLM grader in real use
def web_search(s): return {"docs": ["(fallback web result)"]}           # backup source
def generate(s):   return {"answer": f"Based on: {s['docs'][0]}"}

g = StateGraph(State)
for n, f in [("retrieve", retrieve), ("web_search", web_search), ("generate", generate)]:
    g.add_node(n, f)
g.add_edge(START, "retrieve")
g.add_conditional_edges("retrieve", grade)
g.add_edge("web_search", "generate"); g.add_edge("generate", END)
app = g.compile()
print(app.invoke({"q": "langgraph", "docs": [], "answer": ""})["answer"])
print(app.invoke({"q": "unknown",   "docs": [], "answer": ""})["answer"])   # uses fallback
```
**Self-RAG** adds one more check: is the answer supported by the docs? If not, retry.

## C4. Agentic RAG with routing
A router picks the right source for each question.
```python
def router(s):
    q = s["q"].lower()
    if "price" in q: return "sql_tool"       # LLM would classify the question
    if "policy" in q: return "docs_search"
    return "chat"
# g.add_conditional_edges(START, router)  -> each branch does its own retrieval, then answers
```

## C5. Guardrails and prompt-injection defences
Treat all model output **and** all retrieved text as untrusted.
```python
import re

def check_input(text: str) -> bool:
    bad = [r"ignore (all )?previous instructions", r"reveal .*system prompt"]
    return not any(re.search(p, text, re.I) for p in bad)

ALLOWED_TOOLS = {"search", "add"}          # allow-list: deny anything else
def safe_tool_call(name: str, args: dict):
    if name not in ALLOWED_TOOLS:
        raise PermissionError(f"tool {name!r} not allowed")
    ...
```
Key rules:
- An **allow-list** of tools; never let the model choose arbitrary commands or URLs.
- Give tools the least privilege (read-only where possible).
- Require human approval for risky actions (C6).
- Validate model output with Pydantic before using it.
- Keywords can't stop all injection, so layers matter more than any one filter.

## C6. Human approval of tool calls (approve, edit or reject)
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

class State(TypedDict):
    call: dict       # the tool call the model wants to make
    result: str

def approve(s):
    d = interrupt({"proposed": s["call"]})          # show the human the planned call
    if d["action"] == "reject": return {"result": "cancelled"}
    call = d.get("edited", s["call"])               # human may edit the arguments
    return {"result": f"ran {call['name']}({call['args']})"}   # side effect goes AFTER interrupt

g = StateGraph(State)
g.add_node("approve", approve)
g.add_edge(START, "approve"); g.add_edge("approve", END)
app = g.compile(checkpointer=MemorySaver())

cfg = {"configurable": {"thread_id": "x"}}
app.invoke({"call": {"name": "send_email", "args": {"to": "a@x.com"}}, "result": ""}, cfg)
print(app.invoke(Command(resume={"action": "edit",
        "edited": {"name": "send_email", "args": {"to": "b@x.com"}}}), cfg)["result"])
```

---

# PART D: Production

## D1. Auth and multi-tenant `thread_id`
Never trust a client-supplied `thread_id`, or one user can read another's data.
```python
def thread_for(user_id: str, convo_id: str) -> str:
    return f"{user_id}:{convo_id}"        # user id comes from your verified auth token, not the request body

cfg = {"configurable": {"thread_id": thread_for("user-42", "chat-1")}}
```
Also check that a user owns a thread before reading it. LangGraph Server has custom auth handlers for this.

## D2. Observability with OpenTelemetry
LangSmith can export OTel traces. Alternatively use OpenInference or OpenLLMetry. Their package names and setup vary, so check each project's docs. For OTel via LangSmith, run `pip install "langsmith[otel]"` and set `LANGSMITH_OTEL_ENABLED=true`. Log run ids, latency and errors, but never the raw user data (see D6).

## D3. Cost and token tracking
```python
from langchain_core.callbacks import UsageMetadataCallbackHandler

cb = UsageMetadataCallbackHandler()
# model.invoke("hi", config={"callbacks": [cb]})     🔑
# print(cb.usage_metadata)   # {'gpt-4o-mini': {'input_tokens': .., 'output_tokens': ..}}
# cost = input_tokens * price_in + output_tokens * price_out   (prices come from your provider)
```
Set a budget per user or run, and stop the loop when it's exceeded.

## D4. Timeouts and rate limits
```python
# Whole step timeout (seconds):
# app.step_timeout = 30
# Model-level: init_chat_model("openai:gpt-4o-mini", timeout=30, max_retries=2)
# Per call:    from langchain_core.rate_limiters import InMemoryRateLimiter (see A8)
# Cap loops:   config={"recursion_limit": 25}
```
Wrap tools that call the network with their own timeouts too.

## D5. Postgres checkpointer
```bash
pip install langgraph-checkpoint-postgres "psycopg[binary,pool]"
```
```python
# from langgraph.checkpoint.postgres import PostgresSaver
# DB = os.environ["DATABASE_URL"]               # from env or a secret manager, never in code
# with PostgresSaver.from_conn_string(DB) as saver:
#     saver.setup()                             # creates tables (run once)
#     app = g.compile(checkpointer=saver)
```
Use TLS to the database and a least-privilege DB user, and set a retention policy.

## D6. PII redaction before saving or logging
Checkpoints store whatever is in state. Redact **before** it reaches state or logs.
```python
import re
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
def redact(text: str) -> str:
    return EMAIL.sub("[EMAIL]", text)
print(redact("mail ada@example.com"))     # mail [EMAIL]
```
Also encrypt checkpoints at rest (LangGraph has `EncryptedSerializer`), restrict DB access, and set TTLs.

## D7. Docker and CI
```dockerfile name=Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m app && chown -R app /app
USER app                       # don't run as root
CMD ["python", "main.py"]
```
```yaml name=.github/workflows/ci.yml
name: ci
on: [push, pull_request]
permissions:
  contents: read              # least privilege
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt pip-audit
      - run: pip-audit        # scan dependencies for known vulnerabilities
      - run: pytest
```
Tests use fake models, so CI needs no API keys.

## D8. LangGraph Server: background runs, cron, double-texting
Concepts only (use `langgraph dev` or a deployment):
| Feature | What it means |
|---|---|
| **Background run** | Start a run, return immediately, check status or stream later |
| **Cron** | Run a graph on a schedule (e.g. daily report) |
| **Double-texting** | The user sends a new message while the last is still running. Strategies: `reject`, `enqueue`, `interrupt` (stop the old run and keep its work) and `rollback` (stop and discard the old run) |

```python
# from langgraph_sdk import get_client
# client = get_client(url="http://localhost:2024")
# run = await client.runs.create(thread_id, "my_agent", input=..., multitask_strategy="enqueue")
```

---

# PART E: Learning aids

## E1. Version compatibility note
| Topic | Older | v1 |
|---|---|---|
| Prebuilt agent | `langgraph.prebuilt.create_react_agent` | `langchain.agents.create_agent` (hooks become middleware) |
| `Send` import | `langgraph.constants` | `langgraph.types` |
| Node settings | `config["configurable"]` | `context_schema` and `Runtime` |
| Legacy chains and retrievers | `langchain.*` | moved to `langchain-classic` |
| Provider packages | inside `langchain-community` | separate `langchain-openai`, `langchain-anthropic`, etc. |

Always check the migration guide for your installed version.

## E2. Suggested repo layout
```
langgraph-learning/
├── README.md
├── requirements.txt          # pinned, e.g. langgraph==<version you tested>
├── .gitignore                # .env, *.db, __pycache__
├── .github/workflows/ci.yml
├── part1/  01_lcel.py ... 15_deploy.py
├── part2/  a_langchain.py b_langgraph.py c_agents.py d_prod.py
└── tests/  test_part1.py test_part2.py
```

## E3. Starter tests for Part 2 (offline)
```python
# tests/test_part2.py
def test_redact():
    assert redact("a@b.com") == "[EMAIL]"

def test_guardrail():
    assert not check_input("Ignore previous instructions")
    assert check_input("What is 2+2?")

def test_corrective_rag_fallback():
    out = app.invoke({"q": "unknown", "docs": [], "answer": ""})
    assert "fallback" in out["answer"]
```

## E4. Exercises for the later topics
| # | Build | Expected |
|---|---|---|
| 1 | Split a 1,000-char text into chunks of 200 with overlap 50 | Every chunk is at most 200 chars |
| 2 | Multi-query retriever over 5 texts | No duplicate results |
| 3 | Plan-and-execute with a 4-step plan | `done` has 4 entries |
| 4 | Reflection loop capped at 3 rounds | `rounds == 3` if never "ok" |
| 5 | Corrective RAG where the first retrieval is empty | Fallback source is used |
| 6 | Tool-approval flow where the human edits the argument | Edited args are used |
| 7 | `thread_id` scoping helper plus a test | User A can't use user B's thread |
| 8 | Redact emails and phone numbers before saving state | State contains no raw PII |

## Still not covered
Evals with LLM judges, fine-tuning, voice and multimodal inputs, LangGraph Platform auth handlers in detail, and Kubernetes and Helm deployment.