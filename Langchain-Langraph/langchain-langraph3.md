# LangChain Basics, Part 3: Data, Prompts and Parsers

```bash
pip install langchain-core langchain-community langchain-text-splitters \
            langchain-chroma faiss-cpu pypdf beautifulsoup4 pytest
```
Legend: 🔑 = needs a network or real model. Everything else runs offline.

## The big picture (the RAG pipeline)

```
Load  ->  Split  ->  Embed  ->  Store  ->  Retrieve  ->  Prompt  ->  Model  ->  Parse
files     chunks     numbers    vector DB   top matches   template    answer     object
```
Sections 1 to 4 cover the left half. Sections 5 and 6 cover the right half.

---

# 1. Document loaders

A loader reads a source and returns a list of `Document(page_content, metadata)`.

```python
from langchain_core.documents import Document
d = Document(page_content="Hello", metadata={"source": "demo.txt"})   # the basic unit everywhere
```

Make some sample files first so every example below runs:
```python
import csv, json, pathlib
base = pathlib.Path("data"); base.mkdir(exist_ok=True)
(base / "a.txt").write_text("Cats purr.\nDogs bark.", encoding="utf-8")
(base / "b.md").write_text("# Title\nBirds sing.", encoding="utf-8")
with open(base / "c.csv", "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows([["name", "role"], ["Ada", "engineer"], ["Bob", "designer"]])
(base / "d.json").write_text(json.dumps({"items": [{"text": "one"}, {"text": "two"}]}))
```

| Loader | Source | Package |
|---|---|---|
| `TextLoader` | `.txt` / `.md` | community |
| `DirectoryLoader` | a whole folder | community |
| `CSVLoader` | CSV, one doc per row | community |
| `JSONLoader` | JSON (needs `jq`) | community |
| `PyPDFLoader` | PDF, one doc per page | community |
| `WebBaseLoader` 🔑 | web page | community |
| `Document(...)` by hand | anything else | core |

```python
from langchain_community.document_loaders import TextLoader, DirectoryLoader, CSVLoader

# Single text file
print(TextLoader("data/a.txt", encoding="utf-8").load()[0].page_content)

# Whole folder, filtered by pattern
docs = DirectoryLoader("data", glob="**/*.txt", loader_cls=TextLoader,
                       loader_kwargs={"encoding": "utf-8"}).load()

# CSV: one Document per row
rows = CSVLoader("data/c.csv").load()
print(rows[0].page_content)          # name: Ada\nrole: engineer

# PDF: one Document per page (metadata has the page number)
# from langchain_community.document_loaders import PyPDFLoader
# pages = PyPDFLoader("report.pdf").load()

# Web page 🔑 (only fetch URLs you trust)
# from langchain_community.document_loaders import WebBaseLoader
# web = WebBaseLoader("https://example.com").load()
```

**JSON without extra dependencies** (simplest and safest):
```python
import json
data = json.loads(open("data/d.json", encoding="utf-8").read())
docs = [Document(page_content=i["text"], metadata={"source": "d.json"}) for i in data["items"]]
```

**Write your own loader** when nothing fits:
```python
def load_lines(path):
    with open(path, encoding="utf-8") as f:
        return [Document(page_content=line.strip(), metadata={"source": path, "line": n})
                for n, line in enumerate(f, 1) if line.strip()]
```
Security: never load files from a path supplied by a user without checking it. Resolve it and confirm it sits inside your allowed folder.
```python
def safe_path(user_name: str, root="data") -> pathlib.Path:
    p = (pathlib.Path(root) / user_name).resolve()
    if not p.is_relative_to(pathlib.Path(root).resolve()):   # blocks ../../etc/passwd
        raise ValueError("path not allowed")
    return p
```

---

# 2. Text splitters

Models and vector stores work better on small chunks. `chunk_overlap` repeats a little text between chunks so context isn't cut off.

| Splitter | Splits by | Use for |
|---|---|---|
| `CharacterTextSplitter` | one separator | simple text |
| `RecursiveCharacterTextSplitter` | paragraph, line, word, char | **default choice** |
| `MarkdownHeaderTextSplitter` | `#` headings | Markdown docs |
| `HTMLHeaderTextSplitter` | `<h1>`... | HTML |
| `RecursiveCharacterTextSplitter.from_language` | code syntax | source code |
| `TokenTextSplitter` | tokens | match model limits |

```python
from langchain_text_splitters import (CharacterTextSplitter, RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter, Language)

text = "Para one is here.\n\nPara two is here.\n\nPara three is here."

# Simple: split on a fixed separator
print(CharacterTextSplitter(separator="\n\n", chunk_size=30, chunk_overlap=0).split_text(text))

# Recommended default: tries big separators first, then smaller ones
rec = RecursiveCharacterTextSplitter(chunk_size=40, chunk_overlap=10)
print(rec.split_text(text))

# Markdown: chunks keep their heading in metadata
md = "# Pets\n## Cats\nCats purr.\n## Dogs\nDogs bark."
mds = MarkdownHeaderTextSplitter(headers_to_split_on=[("#", "h1"), ("##", "h2")])
for d in mds.split_text(md):
    print(d.metadata, "->", d.page_content)   # {'h1': 'Pets', 'h2': 'Cats'} -> Cats purr.

# Code: splits on functions and classes
code = "def a():\n    return 1\n\ndef b():\n    return 2\n"
py = RecursiveCharacterTextSplitter.from_language(Language.PYTHON, chunk_size=30, chunk_overlap=0)
print(py.split_text(code))

# Tokens (needs tiktoken: pip install tiktoken)
# from langchain_text_splitters import TokenTextSplitter
# TokenTextSplitter(chunk_size=100, chunk_overlap=10).split_text(text)

# Split Documents (keeps metadata on every chunk)
chunks = rec.split_documents([Document(page_content=text, metadata={"source": "demo"})])
print(chunks[0].metadata)                     # {'source': 'demo'}
```
**Rule of thumb:** start with chunk size 500 to 1000 characters and overlap 10 to 20 percent. Then test what retrieval returns.

---

# 3. Embeddings

An embedding turns text into a list of numbers. Similar meaning gives nearby numbers.

```python
from langchain_core.embeddings import DeterministicFakeEmbedding
emb = DeterministicFakeEmbedding(size=64)
vec = emb.embed_query("cats purr")
print(len(vec))                    # 64
```
**Warning:** the fake embedding has no meaning. Only identical text matches. It lets you learn the plumbing offline. For real search use one of these:

| Option | Code | Notes |
|---|---|---|
| OpenAI 🔑 | `init_embeddings("openai:text-embedding-3-small")` | paid, key in env var |
| Ollama (local) | `OllamaEmbeddings(model="nomic-embed-text")` | free, offline |
| HuggingFace (local) | `HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")` | free, downloads a model |

---

# 4. Vector stores

All stores share the same methods, so you can swap one for another.

```python
store.add_documents(docs)                       # save
store.similarity_search("query", k=2)           # top 2 matches
store.similarity_search_with_score("query")     # matches + distance
store.as_retriever(search_kwargs={"k": 2})      # use inside chains
store.delete(ids=[...])                         # remove
```

| Kind | Class | Survives restart? | Use for |
|---|---|---|---|
| Memory | `InMemoryVectorStore` | no | learning, tests |
| Memory + fast | `FAISS` | only if you save it | local, fast |
| Persistent (folder) | `Chroma` | yes | small apps |
| File (JSON dump) | `InMemoryVectorStore.dump/load` | yes | tiny demos |
| Database | `PGVector` (Postgres) | yes | production |
| Cloud | Pinecone, Qdrant, etc. | yes | scale |

Shared setup:
```python
from langchain_core.documents import Document
from langchain_core.embeddings import DeterministicFakeEmbedding
emb = DeterministicFakeEmbedding(size=64)
docs = [Document(page_content=t, metadata={"topic": k})
        for t, k in [("cats purr", "cat"), ("dogs bark", "dog"), ("birds sing", "bird")]]
```

### 4.1 In-memory
```python
from langchain_core.vectorstores import InMemoryVectorStore
mem = InMemoryVectorStore(emb)
mem.add_documents(docs)
print(mem.similarity_search("cats purr", k=1)[0].page_content)    # cats purr
```

### 4.2 File (save to and load from disk)
```python
mem.dump("store.json")                          # save to a file
mem2 = InMemoryVectorStore.load("store.json", emb)
print(mem2.similarity_search("dogs bark", k=1)[0].page_content)
```
Newer versions provide `dump` and `load`. Otherwise, use FAISS or Chroma below.

### 4.3 FAISS (fast, local, saved to a folder)
```python
from langchain_community.vectorstores import FAISS
faiss_store = FAISS.from_documents(docs, emb)
faiss_store.save_local("faiss_index")
# Loading uses pickle. Only load indexes you created yourself.
loaded = FAISS.load_local("faiss_index", emb, allow_dangerous_deserialization=True)
print(loaded.similarity_search("birds sing", k=1)[0].page_content)
```

### 4.4 Chroma (persistent, folder on disk)
```python
from langchain_chroma import Chroma
chroma = Chroma(collection_name="demo", embedding_function=emb, persist_directory="chroma_db")
chroma.add_documents(docs)
print(chroma.similarity_search("cats purr", k=1)[0].page_content)
# A new process can reopen it with the same persist_directory
```

### 4.5 Database: Postgres with pgvector
```bash
pip install langchain-postgres "psycopg[binary]"
```
```python
# import os
# from langchain_postgres import PGVector
# pg = PGVector(embeddings=emb, collection_name="demo",
#               connection=os.environ["DATABASE_URL"])    # keep the URL in env or a secret manager
# pg.add_documents(docs)
# pg.similarity_search("cats purr", k=1)
```
Use a least-privilege DB user and TLS.

### 4.6 Metadata filtering
```python
print(mem.similarity_search("anything", k=3, filter=lambda d: d.metadata["topic"] == "dog"))
# Chroma uses a dict instead: chroma.similarity_search("x", filter={"topic": "dog"})
```

### 4.7 Search types
```python
retriever = faiss_store.as_retriever(search_type="mmr", search_kwargs={"k": 2, "fetch_k": 3})
# similarity: nearest matches
# mmr: nearest but varied (avoids near-duplicates)
# similarity_score_threshold: drop weak matches
```

### 4.8 Retrievers beyond a vector store
```python
from langchain_community.retrievers import BM25Retriever      # keyword search, no embeddings (pip install rank_bm25)
bm25 = BM25Retriever.from_documents(docs, k=1)
print(bm25.invoke("dogs")[0].page_content)
```
**Hybrid search** combines keyword and vector search. Use `EnsembleRetriever([bm25, vector_retriever], weights=[0.5, 0.5])`.

**Parent-document idea (simple version):** search small chunks, return the larger source.
```python
parents = {"p1": "Full article about cats. Cats purr and sleep."}
small = [Document(page_content="Cats purr", metadata={"parent": "p1"})]
hit = small[0]                             # pretend this came from a search
print(parents[hit.metadata["parent"]])     # return the full parent text
```

### Which store should I pick?
- Learning or tests: `InMemoryVectorStore`.
- Small local app: Chroma or FAISS.
- Production: Postgres with pgvector, or a managed vector database.

---

# 5. Chat prompt templates (simple to complex)

A prompt template turns variables into a list of messages.

### 5.1 Simple string template
```python
from langchain_core.prompts import PromptTemplate
p = PromptTemplate.from_template("Tell me a joke about {topic}.")
print(p.invoke({"topic": "cats"}).to_string())
```

### 5.2 Chat template (system + human)
```python
from langchain_core.prompts import ChatPromptTemplate
chat = ChatPromptTemplate.from_messages([
    ("system", "You are a {style} assistant."),    # sets behaviour
    ("human", "{question}"),
])
for m in chat.invoke({"style": "friendly", "question": "What is 2+2?"}).to_messages():
    print(m.type, ":", m.content)
```

### 5.3 Default values with `partial`
```python
friendly = chat.partial(style="friendly")           # pre-fill one variable
print(friendly.invoke({"question": "Hi"}).to_messages()[0].content)
```

### 5.4 Chat history with `MessagesPlaceholder`
```python
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
with_hist = ChatPromptTemplate.from_messages([
    ("system", "Be brief."),
    MessagesPlaceholder("history"),                 # a list of messages goes here
    ("human", "{q}"),
])
out = with_hist.invoke({"history": [HumanMessage("hi"), AIMessage("hello")], "q": "bye"})
print(len(out.to_messages()))                        # 4
```
Make the history optional with `MessagesPlaceholder("history", optional=True)`.

### 5.5 Few-shot (teach by example)
```python
from langchain_core.prompts import FewShotChatMessagePromptTemplate
shots = FewShotChatMessagePromptTemplate(
    examples=[{"q": "2+2", "a": "4"}, {"q": "3+3", "a": "6"}],
    example_prompt=ChatPromptTemplate.from_messages([("human", "{q}"), ("ai", "{a}")]),
)
final = ChatPromptTemplate.from_messages([("system", "Calculator."), shots, ("human", "{q}")])
print(len(final.invoke({"q": "5+5"}).to_messages()))   # 6
```
**Dynamic examples:** pass `example_selector=` (for example `SemanticSimilarityExampleSelector`) to pick only the most relevant examples.

### 5.6 Mixing in message objects
```python
from langchain_core.messages import SystemMessage
mixed = ChatPromptTemplate.from_messages([
    SystemMessage(content="Fixed system text, no variables."),
    ("human", "{q}"),
])
```
A literal `{` or `}` in a template must be doubled: `{{` and `}}`.

### 5.7 Prompt + model + parser (full chain)
```python
from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.output_parsers import StrOutputParser
chain = chat | FakeListChatModel(responses=["It is 4."]) | StrOutputParser()
print(chain.invoke({"style": "friendly", "question": "2+2?"}))     # It is 4.
```

### 5.8 Complex: RAG prompt with retrieved context
```python
from langchain_core.runnables import RunnablePassthrough
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer ONLY from the context. If it isn't there, say you don't know.\n\nContext:\n{context}"),
    MessagesPlaceholder("history", optional=True),
    ("human", "{question}"),
])
retriever = mem.as_retriever(search_kwargs={"k": 1})
format_docs = lambda ds: "\n".join(d.page_content for d in ds)
rag = ({"context": retriever | format_docs, "question": RunnablePassthrough()}
       | rag_prompt | FakeListChatModel(responses=["Cats purr."]) | StrOutputParser())
print(rag.invoke("What do cats do?"))
```
Security: retrieved text is untrusted. The "answer only from context" instruction helps, but it can't stop every prompt injection.

---

# 6. Output parsers

A parser turns the model's text into something your code can use.

| Parser | Output | Notes |
|---|---|---|
| `StrOutputParser` | `str` | default |
| `JsonOutputParser` | `dict` | model must return JSON |
| `PydanticOutputParser` | validated object | checks types |
| `CommaSeparatedListOutputParser` | `list[str]` | simple lists |
| `XMLOutputParser` | `dict` | XML replies |
| `EnumOutputParser` | enum value | fixed choices |
| `with_structured_output()` 🔑 | object | **best with real models** |
| `OutputFixingParser` | repaired output | asks the model to fix it |

```python
from pydantic import BaseModel
from enum import Enum
from langchain_core.output_parsers import (StrOutputParser, JsonOutputParser,
    PydanticOutputParser, CommaSeparatedListOutputParser, XMLOutputParser)
from langchain.output_parsers import EnumOutputParser   # may be in langchain-classic in v1

print(StrOutputParser().parse("hi"))                                    # 'hi'
print(JsonOutputParser().parse('{"a": 1}'))                              # {'a': 1}
print(CommaSeparatedListOutputParser().parse("red, green, blue"))        # ['red','green','blue']
print(XMLOutputParser().parse("<a><b>1</b></a>"))                        # {'a': [{'b': '1'}]}

class Person(BaseModel):
    name: str
    age: int
pyd = PydanticOutputParser(pydantic_object=Person)
print(pyd.parse('{"name": "Ada", "age": 36}'))                           # name='Ada' age=36
try:
    pyd.parse('{"name": "Ada", "age": "old"}')                           # wrong type
except Exception as e:
    print("Rejected:", type(e).__name__)

class Color(Enum):
    RED = "red"; BLUE = "blue"
print(EnumOutputParser(enum=Color).parse("red"))                         # Color.RED
```

**Tell the model the format:** `pyd.get_format_instructions()` returns text to paste into your prompt.

**Structured output with a real model 🔑** (most reliable):
```python
# structured = model.with_structured_output(Person)
# person = structured.invoke("Ada is 36")      # returns a Person object
```

**Fix a bad reply (do-it-yourself):**
```python
def parse_or_repair(text, parser, repair, tries=2):
    for _ in range(tries):
        try:
            return parser.parse(text)
        except Exception as e:
            text = repair(text, str(e))      # repair() would call the model with the error
    raise ValueError("could not parse")
```
Always validate model output (Pydantic) before using it in code, a database or a command.

**Streaming a parser:** `chain.stream(...)` with `JsonOutputParser` yields partial JSON as it arrives.

---

# 7. Remaining basics

### 7.1 Messages
```python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage
msgs = [SystemMessage("Be brief."), HumanMessage("Hi"), AIMessage("Hello")]
# Roles: system = rules, human = user, ai = model, tool = tool result
```

### 7.2 Trim long history
```python
from langchain_core.messages import trim_messages
many = [HumanMessage(str(i)) for i in range(10)]
print(len(trim_messages(many, max_tokens=3, token_counter=len, strategy="last")))   # 3
```

### 7.3 Caching and rate limits
```python
from langchain_core.caches import InMemoryCache
from langchain_core.globals import set_llm_cache
set_llm_cache(InMemoryCache())      # same prompt, cached answer (saves cost)
```

### 7.4 Batch and async
```python
chain.batch([{"style": "kind", "question": "a"}, {"style": "kind", "question": "b"}])
# await chain.ainvoke(...)   # async version of every method
```

### 7.5 Debug a chain
```python
from langchain_core.globals import set_debug
set_debug(True)      # prints every step's input and output
```

### 7.6 Configure at run time
```python
chain.invoke({"style": "kind", "question": "hi"}, config={"tags": ["demo"], "max_concurrency": 2})
```

---

# 8. Mini end-to-end RAG (offline)

```python
from langchain_core.documents import Document
from langchain_core.embeddings import DeterministicFakeEmbedding
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_text_splitters import RecursiveCharacterTextSplitter

raw = [Document(page_content="Cats purr. Cats sleep a lot.", metadata={"source": "cats.txt"})]   # 1 Load
chunks = RecursiveCharacterTextSplitter(chunk_size=20, chunk_overlap=5).split_documents(raw)      # 2 Split
store = InMemoryVectorStore(DeterministicFakeEmbedding(size=64))                                  # 3 Embed
store.add_documents(chunks)                                                                       # 4 Store
retriever = store.as_retriever(search_kwargs={"k": 1})                                            # 5 Retrieve

prompt = ChatPromptTemplate.from_template("Context: {context}\nQuestion: {question}")             # 6 Prompt
fmt = lambda ds: "\n".join(d.page_content for d in ds)
rag = ({"context": retriever | fmt, "question": RunnablePassthrough()}
       | prompt | FakeListChatModel(responses=["Cats purr."]) | StrOutputParser())               # 7 Model + 8 Parse
print(rag.invoke("Cats purr. Cats sleep a lot."[:20]))
```
Because the fake embeddings match only identical text, the query above reuses a chunk's text. With real embeddings, any natural question works.

---

# 9. Common mistakes

| Mistake | Fix |
|---|---|
| Fake embeddings return nothing useful | They match exact text only. Use real embeddings for real search |
| Chunks too small or too big | Start at 500 to 1000 characters with some overlap and test |
| Using different embedding models for indexing and querying | Always use the same one |
| `{` in a prompt raises a `KeyError` | Double the braces: `{{` and `}}` |
| `FAISS.load_local` on a file you didn't create | It uses pickle, so only load files you trust |
| Parsing the model's JSON without validation | Use Pydantic or `with_structured_output` |
| Putting API keys in code | Use environment variables |
| Loading a user-supplied file path directly | Check it with `safe_path` (section 1) |

# 10. Exercises

| # | Build | Expected |
|---|---|---|
| 1 | Load `a.txt`, `b.md` and `c.csv` with the right loaders | 1, 1 and 2 Documents |
| 2 | Split a 1,000-character text (chunk 200, overlap 50) | every chunk is at most 200 characters |
| 3 | Split the Markdown sample by headings | metadata has `h1` and `h2` |
| 4 | Save and reload a FAISS index | same search result both times |
| 5 | Write a prompt with a system message, history and a question | 4 messages |
| 6 | Parse `"a, b, c"` into a list | `['a','b','c']` |
| 7 | Parse bad Pydantic JSON | exception raised |
| 8 | Run the mini RAG with `BM25Retriever` instead of vectors | works with natural questions |

# 11. Learning order
1. Documents and loaders (1)
2. Splitters (2)
3. Prompts (5)
4. Parsers (6)
5. Embeddings and vector stores (3, 4)
6. Messages and trimming (7)
7. Mini RAG (8)
8. Real models, then LangGraph agents (separate book)

## Parked for the other books
Agentic design patterns (plan-and-execute, reflection, corrective RAG, guardrails, tool approval) and Production (Part D: auth, observability, cost, Postgres checkpointer, Docker and CI, server features).