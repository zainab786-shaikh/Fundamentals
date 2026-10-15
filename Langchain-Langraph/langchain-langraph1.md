# LangChain & LangGraph for Beginners (no AI model needed)

## The big picture

LangGraph is a tool for building **workflows**. Think of a flowchart that your program follows.

| Concept | Everyday analogy | In code |
|---|---|---|
| **State** | A shared clipboard everyone can read and write | A `TypedDict` (a dict with known keys) |
| **Node** | One step in the flowchart | A Python function: takes state, returns changes |
| **Edge** | An arrow between steps | `add_edge("a", "b")` |
| **Graph** | The whole flowchart | `StateGraph` |

> You do not need an AI model to learn this. These are just workflows. AI models are one kind of step you can plug in later.

Setup:
```bash
pip install langgraph langchain-core pytest
```

---

## 1. Chains (LangChain "LCEL")

A **Runnable** is a step. Join steps with `|` so the output of one feeds the next.

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel, RunnableBranch

# Chain: strip spaces -> make uppercase
chain = RunnableLambda(lambda s: s.strip()) | RunnableLambda(lambda s: s.upper())
print(chain.invoke("  hi  "))            # HI

# Parallel: give the same input to several steps, get a dict back
both = RunnableParallel(upper=RunnableLambda(str.upper), length=RunnableLambda(len))
print(both.invoke("abc"))                # {'upper': 'ABC', 'length': 3}

# Branch: first condition that is true wins; the last item is the default
sign = RunnableBranch(
    (lambda x: x > 0, RunnableLambda(lambda x: "positive")),
    (lambda x: x < 0, RunnableLambda(lambda x: "negative")),
    RunnableLambda(lambda x: "zero"),
)
print(sign.invoke(-5))                   # negative

# Run many inputs at once
print(chain.batch([" a ", " b "]))       # ['A', 'B']
```

**Retry and fallback**
```python
from langchain_core.runnables import RunnableLambda

attempts = {"n": 0}
def flaky(x):
    attempts["n"] += 1
    if attempts["n"] < 3:
        raise ValueError("fails twice")
    return x

# Try up to 3 times before giving up
print(RunnableLambda(flaky).with_retry(stop_after_attempt=3).invoke("ok"))   # ok

def broken(x): raise RuntimeError("down")
# If it fails, use the backup instead
safe = RunnableLambda(broken).with_fallbacks([RunnableLambda(lambda x: "backup")])
print(safe.invoke(1))                    # backup
```

---

## 2. Your first graph

Steps: **clean -> split -> join**. Each node returns **only the keys it changes**.

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):          # the "clipboard"
    text: str
    words: list[str]
    result: str

def clean(s):  return {"text": s["text"].strip()}
def split(s):  return {"words": s["text"].split()}
def join(s):   return {"result": "-".join(w.lower() for w in s["words"])}

g = StateGraph(State)
g.add_node("clean", clean)       # name + function
g.add_node("split", split)
g.add_node("join", join)

g.add_edge(START, "clean")       # START = where the flow begins
g.add_edge("clean", "split")
g.add_edge("split", "join")
g.add_edge("join", END)          # END = where it stops

app = g.compile()                # turn the blueprint into a runnable app
print(app.invoke({"text": "  Hello Big World ", "words": [], "result": ""})["result"])
# hello-big-world
```

---

## 3. Decisions and loops

A **conditional edge** calls a function that returns the *name of the next node*. Pointing back to an earlier node makes a **loop**.

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    n: int

def add_one(s): return {"n": s["n"] + 1}

def decide(s):                   # returns the next node's name
    return "add_one" if s["n"] < 5 else END     # loop until n reaches 5

g = StateGraph(State)
g.add_node("add_one", add_one)
g.add_edge(START, "add_one")
g.add_conditional_edges("add_one", decide)
print(g.compile().invoke({"n": 0}))    # {'n': 5}
```

**Shortcut: `Command`** lets a node update state *and* choose the next step in one return.
```python
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command

class State(TypedDict):
    n: int

def check(s) -> Command[Literal["double", "__end__"]]:   # the type hint lists the possible next steps
    if s["n"] >= 50:
        return Command(goto=END)
    return Command(goto="double")

g = StateGraph(State)
g.add_node("check", check)
g.add_node("double", lambda s: {"n": s["n"] * 2})
g.add_edge(START, "check")
g.add_edge("double", "check")
print(g.compile().invoke({"n": 3}))    # {'n': 96}
```

---

## 4. Running steps in parallel

When two nodes **write to the same key at the same time**, LangGraph needs a rule for combining them. That rule is a **reducer**. `operator.add` on lists means "join the lists".

```python
import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    n: int
    results: Annotated[list[int], operator.add]   # reducer: append, don't overwrite

g = StateGraph(State)
g.add_node("square", lambda s: {"results": [s["n"] ** 2]})
g.add_node("cube",   lambda s: {"results": [s["n"] ** 3]})
g.add_node("total",  lambda s: {"results": [sum(s["results"])]})

g.add_edge(START, "square")      # two arrows out of START = both run in parallel (fan-out)
g.add_edge(START, "cube")
g.add_edge("square", "total")    # both arrows into "total" = it waits for both (fan-in)
g.add_edge("cube", "total")
g.add_edge("total", END)
print(g.compile().invoke({"n": 3, "results": []}))
# results: [9, 27, 36]  (order of the first two may vary)
```

**Dynamic parallel work with `Send` (map-reduce)**: use this when you don't know in advance how many tasks there will be.

```python
import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

class State(TypedDict):
    words: list[str]
    lengths: Annotated[list[int], operator.add]   # collects worker outputs
    total: int

def fan_out(s):                  # make ONE worker task per word
    return [Send("worker", {"word": w}) for w in s["words"]]

def worker(s):                   # each worker gets its own small input
    return {"lengths": [len(s["word"])]}

def reduce_(s):                  # runs after all workers finish
    return {"total": sum(s["lengths"])}

g = StateGraph(State)
g.add_node("worker", worker)
g.add_node("reduce", reduce_)
g.add_conditional_edges(START, fan_out, ["worker"])
g.add_edge("worker", "reduce")
g.add_edge("reduce", END)
print(g.compile().invoke({"words": ["apple", "kiwi"], "lengths": [], "total": 0})["total"])  # 9
```

---

## 5. Reducers cheat sheet

A reducer is a function `f(current_value, new_value) -> combined_value`.
**No reducer = the new value overwrites the old one.**

| Goal | Reducer |
|---|---|
| Join lists | `operator.add` |
| Merge dicts | `lambda cur, new: {**(cur or {}), **new}` |
| Chat messages | `MessagesState` (built in) |

```python
from typing import Annotated, TypedDict

def merge(cur, new):             # custom reducer: combine two dicts
    return {**(cur or {}), **new}

class State(TypedDict):
    info: Annotated[dict, merge]
```

**Chat messages:** `MessagesState` already has a message reducer.
```python
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, START, END, MessagesState

g = StateGraph(MessagesState)
g.add_node("reply", lambda s: {"messages": [AIMessage(content="pong")]})   # appended automatically
g.add_edge(START, "reply"); g.add_edge("reply", END)
out = g.compile().invoke({"messages": [HumanMessage("ping")]})
print(out["messages"][-1].content)     # pong
```

> Tip: in real apps use lists and dicts in state, not `set` or other custom objects. Saved state must be serializable.

---

## 6. Subgraphs (a graph inside a graph)

Build a small graph, then use it as one node in a bigger graph.

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    text: str

small = StateGraph(State)
small.add_node("reverse", lambda s: {"text": s["text"][::-1]})
small.add_edge(START, "reverse"); small.add_edge("reverse", END)

big = StateGraph(State)
big.add_node("trim", lambda s: {"text": s["text"].strip()})
big.add_node("small", small.compile())      # the small graph becomes one step
big.add_edge(START, "trim"); big.add_edge("trim", "small"); big.add_edge("small", END)
print(big.compile().invoke({"text": " abc "}))   # {'text': 'cba'}
```

---

## 7. Reliability

**Retry a step that sometimes fails**
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import RetryPolicy

class State(TypedDict):
    n: int

tries = {"n": 0}
def flaky(s):
    tries["n"] += 1
    if tries["n"] < 3:
        raise ConnectionError("temporary")
    return {"n": s["n"] + 1}

g = StateGraph(State)
g.add_node("flaky", flaky, retry_policy=RetryPolicy(max_attempts=5, retry_on=ConnectionError))
g.add_edge(START, "flaky"); g.add_edge("flaky", END)
print(g.compile().invoke({"n": 0}))   # {'n': 1} after 2 failures
```

**Stop infinite loops**: LangGraph stops after a set number of steps.
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.errors import GraphRecursionError

class State(TypedDict):
    n: int

g = StateGraph(State)
g.add_node("spin", lambda s: {"n": s["n"] + 1})
g.add_edge(START, "spin"); g.add_edge("spin", "spin")     # loops forever
try:
    g.compile().invoke({"n": 0}, config={"recursion_limit": 10})
except GraphRecursionError:
    print("Stopped safely")
```

**Errors as data:** catch the error inside the node, store it in the state (for example in an `error` key), and route on it.

---

## 8. Memory and human approval

A **checkpointer** saves state after every step. This gives you memory, pausing and resuming. Each conversation is identified by a **`thread_id`**.

**Memory across calls**
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

class State(TypedDict):
    n: int

g = StateGraph(State)
g.add_node("inc", lambda s: {"n": s["n"] + 1})
g.add_edge(START, "inc"); g.add_edge("inc", END)
app = g.compile(checkpointer=MemorySaver())       # saves in RAM (lost on exit)

cfg = {"configurable": {"thread_id": "t1"}}       # REQUIRED with a checkpointer
app.invoke({"n": 0}, cfg)
print(app.get_state(cfg).values)                  # {'n': 1}  <- remembered

for snap in app.get_state_history(cfg):           # time travel: every saved step
    print(snap.values)
app.update_state(cfg, {"n": 99})                  # manually edit saved state
```
For a database that survives restarts, use `SqliteSaver` (`pip install langgraph-checkpoint-sqlite`) or `PostgresSaver`.

**Pause for a human: `interrupt()`**
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

class State(TypedDict):
    amount: int
    status: str

def review(s):
    answer = interrupt(f"Approve ${s['amount']}?")   # PAUSES here, asks the human
    return {"status": "approved" if answer == "yes" else "rejected"}

g = StateGraph(State)
g.add_node("review", review)
g.add_edge(START, "review"); g.add_edge("review", END)
app = g.compile(checkpointer=MemorySaver())          # interrupt needs a checkpointer

cfg = {"configurable": {"thread_id": "order-1"}}
app.invoke({"amount": 5000, "status": ""}, cfg)      # runs, then pauses
print(app.invoke(Command(resume="yes"), cfg))        # human answers -> continues
# {'amount': 5000, 'status': 'approved'}
```

**Important rule:** when resumed, the node **restarts from its first line**. Any code *before* `interrupt()` runs again. Put side effects (emails, payments) **after** it, or the action may happen twice.

**Fixed breakpoints:** `g.compile(checkpointer=..., interrupt_before=["node_name"])` pauses before a node. Resume with `app.invoke(None, cfg)`.

**Changing your state schema later:** only add optional keys, never rename or retype existing ones, and use a new `thread_id` for breaking changes.

---

## 9. Streaming (see progress live)

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    n: int

g = StateGraph(State)
g.add_node("inc", lambda s: {"n": s["n"] + 1})
g.add_edge(START, "inc"); g.add_edge("inc", END)
app = g.compile()

for chunk in app.stream({"n": 0}, stream_mode="updates"):
    print(chunk)                 # {'inc': {'n': 1}}
```

| `stream_mode` | You get |
|---|---|
| `values` | The full state after each step |
| `updates` | Only what each node changed |
| `custom` | Your own messages (`get_stream_writer()`) |
| `messages` | AI tokens as they are written (needs a real model) |
| `debug` | Detailed trace |

---

## 10. Functional API (the "just write Python" way)

Instead of drawing a graph, write normal Python. `@task` marks a step whose result is saved, and `@entrypoint` is the main function.

```python
from langgraph.func import entrypoint, task
from langgraph.checkpoint.memory import MemorySaver

@task
def square(x: int) -> int:
    return x * x

@entrypoint(checkpointer=MemorySaver())
def workflow(nums: list[int]) -> int:
    futures = [square(n) for n in nums]       # start all tasks (they run in parallel)
    return sum(f.result() for f in futures)   # wait for the results

print(workflow.invoke([1, 2, 3], {"configurable": {"thread_id": "1"}}))   # 14
```
**Tip:** put side effects (payments, emails) inside a `@task`. After a crash and resume, saved task results are not re-run. Still pass an idempotency key to the external service.

---

## 11. Multiple "agents" working together (supervisor pattern)

A **supervisor** node decides who works next. Workers report back to it.

```python
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command

class State(TypedDict):
    notes: str
    draft: str

def supervisor(s) -> Command[Literal["researcher", "writer", "__end__"]]:
    if not s["notes"]: return Command(goto="researcher")   # nothing researched yet
    if not s["draft"]: return Command(goto="writer")       # have notes, need a draft
    return Command(goto=END)                               # all done

def researcher(s) -> Command[Literal["supervisor"]]:
    return Command(update={"notes": "facts"}, goto="supervisor")

def writer(s) -> Command[Literal["supervisor"]]:
    return Command(update={"draft": f"Report on {s['notes']}"}, goto="supervisor")

g = StateGraph(State)
g.add_node("supervisor", supervisor)
g.add_node("researcher", researcher)
g.add_node("writer", writer)
g.add_edge(START, "supervisor")
print(g.compile().invoke({"notes": "", "draft": ""}))
# {'notes': 'facts', 'draft': 'Report on facts'}
```
A subgraph can jump to a node in its parent with `Command(goto="x", graph=Command.PARENT)`. This behaviour varies by version, so check the docs.

---

## 12. An "agent" with a fake model (the ReAct loop)

An agent loops: **model thinks -> calls a tool -> reads the result -> answers**. Here a scripted fake model stands in for the AI, so no API key is needed.

```python
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START, MessagesState
from langgraph.prebuilt import ToolNode, tools_condition

@tool
def add(a: int, b: int) -> int:
    """Add two integers."""            # the model reads this description
    return a + b

def fake_model(state: MessagesState):
    last = state["messages"][-1]
    if isinstance(last, ToolMessage):  # tool already ran -> give the final answer
        return {"messages": [AIMessage(content=f"The answer is {last.content}")]}
    return {"messages": [AIMessage(content="", tool_calls=[   # otherwise ask for the tool
        {"name": "add", "args": {"a": 2, "b": 3}, "id": "c1"}])]}

g = StateGraph(MessagesState)
g.add_node("agent", fake_model)
g.add_node("tools", ToolNode([add]))                # runs the requested tool
g.add_edge(START, "agent")
g.add_conditional_edges("agent", tools_condition)   # tool requested -> "tools", else END
g.add_edge("tools", "agent")                        # loop back with the result

out = g.compile().invoke({"messages": [HumanMessage("2+3?")]})
print(out["messages"][-1].content)                  # The answer is 5
```

**Using a real model later:** `from langchain.chat_models import init_chat_model`, then `init_chat_model("openai:gpt-4o-mini")`. Keep API keys in environment variables, never in code. `create_react_agent` is being replaced in newer versions, so check the docs.

**Fake models for tests:** `FakeListChatModel(responses=["a", "b"])` from `langchain_core.language_models.fake_chat_models` returns your scripted replies in order.

---

## 13. Extras

**Cache a slow step**
```python
from langgraph.types import CachePolicy
from langgraph.cache.memory import InMemoryCache
# g.add_node("slow", slow_fn, cache_policy=CachePolicy(ttl=60))   # remember for 60 s
# app = g.compile(cache=InMemoryCache())                          # same input -> cached
```

**Pass settings without putting them in state** (newer versions)
```python
from dataclasses import dataclass
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.runtime import Runtime

@dataclass
class Ctx:
    greeting: str

class State(TypedDict):
    name: str
    msg: str

def greet(s, runtime: Runtime[Ctx]):
    return {"msg": f"{runtime.context.greeting}, {s['name']}"}

g = StateGraph(State, context_schema=Ctx)
g.add_node("greet", greet)
g.add_edge(START, "greet"); g.add_edge("greet", END)
print(g.compile().invoke({"name": "Ada"}, context=Ctx(greeting="Hello")))
```

**Async** (needed for real web or database calls)
```python
import asyncio
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    n: int

async def inc(s):                      # "async def" node
    await asyncio.sleep(0.1)           # pretend to wait on I/O
    return {"n": s["n"] + 1}

g = StateGraph(State)
g.add_node("inc", inc)
g.add_edge(START, "inc"); g.add_edge("inc", END)
print(asyncio.run(g.compile().ainvoke({"n": 0})))   # {'n': 1}
```

**Draw your graph** (best way to debug):
`print(app.get_graph().draw_mermaid())`, then paste the output into mermaid.live.

**Trace runs with LangSmith** (optional, free account):
```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your key, never commit it>"
```

---

## 14. Testing

Nodes are plain functions, so they are easy to test.

```python
# test_graph.py  -> run with: pytest
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    n: int

def double(s): return {"n": s["n"] * 2}

def build():
    g = StateGraph(State)
    g.add_node("double", double)
    g.add_edge(START, "double"); g.add_edge("double", END)
    return g.compile()

def test_node():  assert double({"n": 3}) == {"n": 6}       # test one step
def test_graph(): assert build().invoke({"n": 3}) == {"n": 6}  # test the whole flow
```
For agents, test the **answer** and the **steps taken** (which tools were called). Use a fake model so tests are fast and repeatable.

---

## 15. Deploying

```python
# agent.py
app = g.compile()    # no checkpointer: the server provides persistence
```
```json
{ "dependencies": ["."], "graphs": { "my_agent": "./agent.py:app" }, "env": ".env" }
```
```bash
pip install -U "langgraph-cli[inmem]"
langgraph dev        # run locally with a UI
```
Add `.env` to `.gitignore` and keep secrets out of git.

---

## 16. Common mistakes

| Mistake | What happens | Fix |
|---|---|---|
| Parallel nodes write the same key with no reducer | `InvalidUpdateError` | `Annotated[list, operator.add]` |
| Checkpointer but no `thread_id` | Error | Pass `{"configurable": {"thread_id": "x"}}` |
| Changing state in place (`s["a"].append(1)`) | Skips reducers and saving | Return a new value |
| Loop with no exit | Hits the recursion limit | Add a stop condition |
| Side effect before `interrupt()` | Runs twice | Put it after, or in a `@task` |
| Sets or custom objects in state | Can't be saved | Use lists and dicts |

---

## 17. Practice exercises

| # | Build this | Expected result |
|---|---|---|
| 1 | Binary search loop on `[1,3,5,7,9]`, target 7 | index `3` |
| 2 | Word counter with `Send` on `["a b", "c"]` | `3` |
| 3 | Approval needing 2 reviewers (2 interrupts) | `approved` after 2 resumes |
| 4 | Retry 3 times, then go to a `fallback` node | result is `fallback` |
| 5 | Subgraph hands off to a parent node | parent node runs next |

## Learning order

1. Chains (section 1)
2. First graph (2)
3. Decisions and loops (3)
4. Reducers (5)
5. Parallel work (4)
6. Subgraphs and reliability (6, 7)
7. Memory, human approval and streaming (8, 9)
8. Functional API and multi-agent (10, 11)
9. Agents, testing and deployment (12 to 15)
10. Real AI models

## Not covered yet

Real chat models, vector stores and RAG, plan-and-execute and reflection agents, MCP tools, guardrails, auth and multi-user setups, and the v1 migration (`create_agent`).