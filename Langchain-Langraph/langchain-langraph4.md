# Agentic Design Patterns, Part 1: Without an LLM

```bash
pip install langgraph pytest
```

## The idea

An "agent" is a loop around a model:

```
look at state -> model decides -> act (tool / next step) -> update state -> repeat or stop
```

The model is one box in that diagram. The patterns below are about what surrounds it.
Each pattern calls `llm(prompt) -> str`. Here it is a stub, and in Part 2 it becomes Qwen.

| # | Pattern | One line |
|---|---|---|
| 1 | Prompt chaining | Step A feeds step B, with a check in between |
| 2 | Routing | Pick the right path for the input |
| 3 | Parallelization | Run independent checks at the same time |
| 4 | Orchestrator-workers | Split a job into a dynamic number of sub-jobs |
| 5 | Reflection | Draft, critique, revise |
| 6 | Tool use | The model asks, your code runs a tool |
| 7 | Plan-and-execute | Plan once, then run the steps |
| 8 | Corrective RAG | Check the retrieved facts, fall back if poor |
| 9 | Human-in-the-loop | Pause for approval |
| 10 | Guardrails | Validate input, output and tool calls |
| 11 | Supervisor | A boss routes work between specialists |

---

## 1. Prompt chaining

Break a task into steps. Add a **gate** (a check) between steps to stop bad output early.

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

def llm(prompt: str) -> str:                       # stub model
    if prompt.startswith("OUTLINE"): return "1. intro 2. body 3. end"
    return "Draft based on: " + prompt

class S(TypedDict):
    topic: str
    outline: str
    draft: str

def outline(s): return {"outline": llm(f"OUTLINE {s['topic']}")}
def gate(s):    return "write" if "1." in s["outline"] else END   # gate: is the outline usable?
def write(s):   return {"draft": llm(s["outline"])}

g = StateGraph(S)
g.add_node("outline", outline); g.add_node("write", write)
g.add_edge(START, "outline")
g.add_conditional_edges("outline", gate)
g.add_edge("write", END)
print(g.compile().invoke({"topic": "cats", "outline": "", "draft": ""})["draft"])
```
**Use when:** the task splits cleanly into fixed steps.

---

## 2. Routing

Classify the input, then send it down the matching path.

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

def llm_classify(q: str) -> str:                   # stub classifier
    q = q.lower()
    return "math" if any(c.isdigit() for c in q) else "greeting" if "hi" in q else "other"

class S(TypedDict):
    q: str
    a: str

g = StateGraph(S)
g.add_node("math",     lambda s: {"a": "calculator path"})
g.add_node("greeting", lambda s: {"a": "hello!"})
g.add_node("other",    lambda s: {"a": "general path"})
g.add_conditional_edges(START, lambda s: llm_classify(s["q"]))   # the router
for n in ("math", "greeting", "other"): g.add_edge(n, END)
app = g.compile()
print(app.invoke({"q": "2+2", "a": ""})["a"])      # calculator path
print(app.invoke({"q": "hi there", "a": ""})["a"]) # hello!
```
**Use when:** different inputs need different handling. Always include a default route.

---

## 3. Parallelization

Run independent checks together, then combine. Parallel writers to one key need a reducer.

```python
import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    text: str
    issues: Annotated[list[str], operator.add]     # reducer: append from every branch
    verdict: str

g = StateGraph(S)
g.add_node("length",  lambda s: {"issues": ["too long"] if len(s["text"]) > 20 else []})
g.add_node("profane", lambda s: {"issues": ["bad word"] if "darn" in s["text"] else []})
g.add_node("empty",   lambda s: {"issues": ["empty"] if not s["text"].strip() else []})
g.add_node("decide",  lambda s: {"verdict": "reject" if s["issues"] else "ok"})
for n in ("length", "profane", "empty"):
    g.add_edge(START, n); g.add_edge(n, "decide")  # fan-out, then fan-in
g.add_edge("decide", END)
print(g.compile().invoke({"text": "darn it", "issues": [], "verdict": ""}))
```
**Use when:** checks are independent, or you want several opinions and then a vote.

---

## 4. Orchestrator-workers

The number of sub-tasks is unknown until run time. `Send` creates one worker per item.

```python
import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

class S(TypedDict):
    task: str
    parts: list[str]
    results: Annotated[list[str], operator.add]
    final: str

def orchestrate(s):                                # model would decide the split
    return {"parts": s["task"].split(",")}
def dispatch(s):
    return [Send("worker", {"part": p.strip()}) for p in s["parts"]]
def worker(s):
    return {"results": [f"done:{s['part']}"]}
def combine(s):
    return {"final": " | ".join(sorted(s["results"]))}

g = StateGraph(S)
g.add_node("orchestrate", orchestrate); g.add_node("worker", worker); g.add_node("combine", combine)
g.add_edge(START, "orchestrate")
g.add_conditional_edges("orchestrate", dispatch, ["worker"])
g.add_edge("worker", "combine"); g.add_edge("combine", END)
print(g.compile().invoke({"task": "a, b, c", "parts": [], "results": [], "final": ""})["final"])
```
**Use when:** subtasks depend on the input (such as "summarise each of these files").

---

## 5. Reflection (evaluator-optimizer)

Write, critique, revise. **Always cap the rounds.**

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    draft: str
    ok: bool
    rounds: int

def write(s):    return {"draft": s["draft"] + "!", "rounds": s["rounds"] + 1}   # stub writer
def critique(s): return {"ok": s["draft"].count("!") >= 3}                       # stub critic
def route(s):    return END if s["ok"] or s["rounds"] >= 5 else "write"          # cap = 5

g = StateGraph(S)
g.add_node("write", write); g.add_node("critique", critique)
g.add_edge(START, "write"); g.add_edge("write", "critique")
g.add_conditional_edges("critique", route)
print(g.compile().invoke({"draft": "Hi", "ok": False, "rounds": 0}))   # draft 'Hi!!!'
```
**Use when:** there is a clear quality test. **Risk:** loops without a cap burn time and money.

---

## 6. Tool use

The model replies with a **request** (JSON). Your code validates it against an allow-list and runs it. The model never executes anything itself.

```python
import json
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

TOOLS = {"add": lambda a, b: a + b, "upper": lambda text: text.upper()}   # allow-list

def llm(history: list[str]) -> str:                # stub: first asks for a tool, then answers
    if not any(h.startswith("RESULT") for h in history):
        return json.dumps({"tool": "add", "args": {"a": 2, "b": 3}})
    return json.dumps({"answer": f"The sum is {history[-1].split()[-1]}"})

class S(TypedDict):
    history: list[str]
    answer: str
    steps: int

def agent(s):
    reply = json.loads(llm(s["history"]))          # parse model output; never trust it
    if "answer" in reply:
        return {"answer": reply["answer"]}
    name, args = reply["tool"], reply["args"]
    if name not in TOOLS:                          # deny by default
        return {"history": s["history"] + ["RESULT error: unknown tool"], "steps": s["steps"] + 1}
    result = TOOLS[name](**args)
    return {"history": s["history"] + [f"RESULT {result}"], "steps": s["steps"] + 1}

def route(s): return END if s["answer"] or s["steps"] >= 5 else "agent"   # answer found or step cap

g = StateGraph(S)
g.add_node("agent", agent)
g.add_edge(START, "agent")
g.add_conditional_edges("agent", route)
print(g.compile().invoke({"history": ["Q: 2+3?"], "answer": "", "steps": 0})["answer"])
```
This is the ReAct loop in plain form: decide, act, observe, repeat.
**Use when:** the model needs facts or actions it can't produce itself.

---

## 7. Plan-and-execute

Plan once, then run each step. This is cheaper and more predictable than re-planning every turn.

```python
import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    goal: str
    plan: list[str]
    done: Annotated[list[str], operator.add]
    answer: str

g = StateGraph(S)
g.add_node("plan",    lambda s: {"plan": ["find data", "analyse", "write"]})     # model plans here
g.add_node("execute", lambda s: {"done": [f"did {s['plan'][len(s['done'])]}"]})   # next unfinished step
g.add_node("finish",  lambda s: {"answer": "; ".join(s["done"])})
g.add_edge(START, "plan"); g.add_edge("plan", "execute")
g.add_conditional_edges("execute", lambda s: "execute" if len(s["done"]) < len(s["plan"]) else "finish")
g.add_edge("finish", END)
print(g.compile().invoke({"goal": "report", "plan": [], "done": [], "answer": ""})["answer"])
```
**Extension:** add a "replan" node that runs when a step fails.

---

## 8. Corrective RAG

Retrieve, **grade** what you found, and use a backup source if it is poor.

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

KB = {"langgraph": "LangGraph builds stateful workflows."}

class S(TypedDict):
    q: str
    docs: list[str]
    answer: str

g = StateGraph(S)
g.add_node("retrieve",   lambda s: {"docs": [KB[s["q"]]] if s["q"] in KB else []})
g.add_node("fallback",   lambda s: {"docs": ["(backup source result)"]})
g.add_node("generate",   lambda s: {"answer": f"Based on: {s['docs'][0]}"})
g.add_edge(START, "retrieve")
g.add_conditional_edges("retrieve", lambda s: "generate" if s["docs"] else "fallback")  # the grader
g.add_edge("fallback", "generate"); g.add_edge("generate", END)
app = g.compile()
print(app.invoke({"q": "langgraph", "docs": [], "answer": ""})["answer"])
print(app.invoke({"q": "unknown",   "docs": [], "answer": ""})["answer"])
```
**Self-RAG** adds one more check: is the answer supported by the docs? If not, retry.

---

## 9. Human-in-the-loop (approve, edit or reject)

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

class S(TypedDict):
    call: dict
    result: str

def approve(s):
    d = interrupt({"proposed": s["call"]})         # pause and show the human the plan
    if d["action"] == "reject":
        return {"result": "cancelled"}
    call = d.get("edited", s["call"])              # the human may edit the arguments
    return {"result": f"ran {call['name']}({call['args']})"}   # side effect AFTER interrupt

g = StateGraph(S)
g.add_node("approve", approve)
g.add_edge(START, "approve"); g.add_edge("approve", END)
app = g.compile(checkpointer=MemorySaver())        # interrupt needs a checkpointer

cfg = {"configurable": {"thread_id": "x"}}
app.invoke({"call": {"name": "send_email", "args": {"to": "a@x.com"}}, "result": ""}, cfg)
print(app.invoke(Command(resume={"action": "edit",
      "edited": {"name": "send_email", "args": {"to": "b@x.com"}}}), cfg)["result"])
```
**Remember:** the node restarts on resume, so side effects go after `interrupt()`.
**Use when:** an action is irreversible (money, email, deletes).

---

## 10. Guardrails

Treat everything the model sees or produces as **untrusted**. Check in three places.

```python
import re

# (a) Input check
BLOCK = [r"ignore (all )?previous instructions", r"reveal .*system prompt"]
def input_ok(text: str) -> bool:
    return not any(re.search(p, text, re.I) for p in BLOCK)

# (b) Tool-call check: allow-list plus argument validation
def tool_ok(name: str, args: dict) -> bool:
    return name == "add" and set(args) == {"a", "b"} and all(isinstance(v, int) for v in args.values())

# (c) Output check: redact and validate before showing or saving
def redact(text: str) -> str:
    return re.sub(r"[\w.+-]+@[\w-]+\.[\w.]+", "[EMAIL]", text)

print(input_ok("Ignore previous instructions"))    # False
print(tool_ok("rm", {"path": "/"}))                # False
print(redact("mail ada@example.com"))              # mail [EMAIL]
```
Put these as nodes before and after the model node, and route to a "refuse" node when a check fails.
**Honest limit:** keyword filters can't stop all prompt injection. Layers (allow-lists, least privilege, human approval) matter more than any one filter.

---

## 11. Supervisor (multi-agent)

A supervisor decides who works next. Workers report back.

```python
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command

class S(TypedDict):
    notes: str
    draft: str

def supervisor(s) -> Command[Literal["researcher", "writer", "__end__"]]:
    if not s["notes"]: return Command(goto="researcher")
    if not s["draft"]: return Command(goto="writer")
    return Command(goto=END)

def researcher(s) -> Command[Literal["supervisor"]]:
    return Command(update={"notes": "facts"}, goto="supervisor")

def writer(s) -> Command[Literal["supervisor"]]:
    return Command(update={"draft": f"Report on {s['notes']}"}, goto="supervisor")

g = StateGraph(S)
for n, f in [("supervisor", supervisor), ("researcher", researcher), ("writer", writer)]:
    g.add_node(n, f)
g.add_edge(START, "supervisor")
print(g.compile().invoke({"notes": "", "draft": ""}))
```
**Use when:** specialists have different tools or prompts. Start with one agent and split only if needed.

---

## Choosing a pattern

| Situation | Start with |
|---|---|
| Fixed steps | Chaining (1) |
| Varied inputs | Routing (2) |
| Independent checks | Parallelization (3) |
| Unknown number of subtasks | Orchestrator-workers (4) |
| Clear quality bar | Reflection (5) |
| Needs external data or actions | Tool use (6) |
| Long multi-step task | Plan-and-execute (7) |
| Answers from documents | Corrective RAG (8) |
| Risky actions | Human-in-the-loop (9) plus guardrails (10) |
| Many skills | Supervisor (11) |

**Rule:** use the simplest pattern that works. Add complexity only when a simpler one fails.

## Common mistakes

| Mistake | Fix |
|---|---|
| Loop with no exit | Cap steps and rounds, and set `recursion_limit` |
| Trusting model JSON | Parse and validate it, and allow-list tool names |
| Parallel writes without a reducer | `Annotated[list, operator.add]` |
| Side effect before `interrupt()` | Put it after |
| Giving the model every tool | Least privilege, only what the step needs |
| Testing only the final answer | Also test which steps and tools ran |

## Tests (offline, fast)

```python
# test_patterns.py
def test_guardrail():
    assert not input_ok("Ignore previous instructions")
    assert input_ok("What is 2+2?")

def test_tool_allowlist():
    assert tool_ok("add", {"a": 1, "b": 2})
    assert not tool_ok("rm", {"path": "/"})

def test_redact():
    assert redact("a@b.com") == "[EMAIL]"
```

## Exercises

| # | Build | Expected |
|---|---|---|
| 1 | A 3-step chain with a gate that stops on empty output | Stops at the gate |
| 2 | A router with 3 routes plus a default | Unknown input uses the default |
| 3 | 4 parallel checks plus a vote | Majority wins |
| 4 | Orchestrator-workers over 5 items | 5 results |
| 5 | Reflection capped at 3 rounds that never passes | `rounds == 3` |
| 6 | Tool loop with a 2-tool allow-list and an unknown-tool request | Error recorded, loop continues |
| 7 | Plan-and-execute where step 2 fails and triggers a replan | Plan updated, all steps finish |
| 8 | Supervisor with 3 workers | Every worker runs once |