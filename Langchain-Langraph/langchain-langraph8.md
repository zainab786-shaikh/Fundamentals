# Part 5: Deploying Agents (cloud-neutral: Docker + Kubernetes)

I haven't run any of this. Versions, image tags and API fields move quickly, so check them against the current docs before use. Items marked 🔑 call a paid model. I used the defaults I proposed: Python and FastAPI, GHCR, `kind`, Kustomize, Argo CD.

## 0. Big picture

```
Code -> Container image -> Registry -> Git (manifests) -> Argo CD -> Kubernetes
          scan + sign        GHCR        reviewed PRs                  |
                                                                       v
  Eval dataset <- redacted failures <- logs/traces/metrics <- running pods
```

| In a notebook | In production |
|---|---|
| One user, one run | Many users, concurrent, hostile input |
| Crash means rerun | Needs retries, timeouts, fallbacks |
| Key in env | Secret store, rotation, least privilege |
| Cost is a curiosity | Cost is a budget with caps |
| `print` | Logs, traces, metrics, alerts |

Repo layout used below:

```
app/{main,settings,security,state,reliability,metrics,cost}.py
worker/worker.py
Dockerfile  compose.yaml  requirements.txt
k8s/base/*.yaml   k8s/overlays/{dev,prod}/kustomization.yaml
.github/workflows/ci.yaml
```

---

## 1. Packaging the agent as a service

```python
# app/main.py
import json, uuid
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from app.security import current_user
from models import get_model, FAST

app = FastAPI(title="agent", docs_url=None, redoc_url=None)   # no public docs in prod

class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)       # cap input size
    session_id: str = Field(default_factory=lambda: uuid.uuid4().hex, pattern=r"^[a-f0-9]{32}$")

class ChatOut(BaseModel):
    session_id: str
    answer: str

@app.get("/healthz")                 # liveness: the process is alive, no dependencies checked
def healthz(): return {"ok": True}

@app.get("/readyz")                  # readiness: can serve traffic (add Redis ping here)
async def readyz(): return {"ready": True}

@app.post("/v1/chat", response_model=ChatOut)
async def chat(body: ChatIn, user: str = Depends(current_user)):
    llm = get_model(FAST)
    try:
        out = await llm.ainvoke(body.message)
    except Exception:
        raise HTTPException(502, "upstream model error")      # never leak provider details
    return ChatOut(session_id=body.session_id, answer=str(out.content))

@app.post("/v1/chat/stream")
async def chat_stream(body: ChatIn, user: str = Depends(current_user)):
    llm = get_model(FAST)
    async def gen():
        try:
            async for chunk in llm.astream(body.message):
                yield f"data: {json.dumps({'t': str(chunk.content)})}\n\n"
            yield "event: done\ndata: {}\n\n"
        except Exception:
            yield "event: error\ndata: {}\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"})
```

- **Liveness vs readiness:** liveness must not check Redis. Otherwise a Redis outage restarts every pod.
- **Versioned routes (`/v1`)** let you change the contract without breaking clients.
- **Pydantic limits** reject bad or oversized input before any model spend.
- **Errors are generic.** Details go to logs only.

Run `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

---

## 2. Configuration and secrets

```python
# app/settings.py
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AGENT_", extra="ignore")
    openai_api_key: SecretStr                     # required: startup fails fast if missing
    redis_url: str = "redis://redis:6379/0"
    jwt_issuer: str
    jwt_audience: str
    jwks_url: str
    daily_token_budget: int = 200_000
    max_inflight: int = 20

settings = Settings()
```

Note that `langchain-openai` reads `OPENAI_API_KEY`, so map the secret to that env var in the manifest. The `AGENT_` prefix then applies only to your own settings.

Kubernetes:

```yaml
# k8s/base/config.yaml
apiVersion: v1
kind: ConfigMap
metadata: { name: agent-config }
data:
  AGENT_REDIS_URL: "redis://redis:6379/0"
  AGENT_JWT_ISSUER: "https://idp.example.com/"
  AGENT_JWT_AUDIENCE: "agent-api"
  AGENT_JWKS_URL: "https://idp.example.com/.well-known/jwks.json"
```

Create the secret out of band, never in git:

```bash
kubectl create secret generic agent-secrets --from-literal=OPENAI_API_KEY="$OPENAI_API_KEY"
```

| Approach | Use |
|---|---|
| `Secret` created by hand | Demo only. Base64 is not encryption. |
| **External Secrets Operator** | Production. Syncs from Vault or a cloud secret manager and supports rotation. |
| Sealed Secrets | Encrypted secrets that are safe to commit. |

Also enable etcd encryption at rest on the cluster and restrict `get secrets` through RBAC.

---

## 3. Containerization

```dockerfile
# Dockerfile
FROM python:3.12-slim AS build
WORKDIR /w
ENV PIP_NO_CACHE_DIR=1
COPY requirements.txt .
RUN pip wheel --wheel-dir /wheels -r requirements.txt

FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
RUN useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin app
WORKDIR /srv
COPY --from=build /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels /wheels/* && rm -rf /wheels
COPY --chown=app:app app ./app
COPY --chown=app:app models.py .
USER 10001
EXPOSE 8000
HEALTHCHECK CMD python -c "import urllib.request as u;u.urlopen('http://127.0.0.1:8000/healthz',timeout=2)"
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]
```

```
# .dockerignore
.git
.env*
.eval_cache
evals
tests
__pycache__
```

Pin `requirements.txt` with hashes, for example `pip-compile --generate-hashes`. Prefer a digest-pinned base image, `python:3.12-slim@sha256:...`.

```bash
docker build -t ghcr.io/OWNER/agent:dev .
docker run --rm --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
  -e OPENAI_API_KEY -p 8000:8000 ghcr.io/OWNER/agent:dev
trivy image --severity HIGH,CRITICAL --exit-code 1 ghcr.io/OWNER/agent:dev
```

Add an SBOM (`syft`) and signing (`cosign sign`) in CI (section 14).

---

## 4. Local stack with Docker Compose

```yaml
# compose.yaml
services:
  agent:
    build: .
    env_file: .env.local            # git-ignored; contains OPENAI_API_KEY etc.
    ports: ["127.0.0.1:8000:8000"]  # bind to localhost only
    depends_on: [redis]
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
  redis:
    image: redis:7-alpine
    command: ["redis-server","--save","","--appendonly","no"]
  postgres:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD_FILE: /run/secrets/pg }
    secrets: [pg]
  otel:
    image: otel/opentelemetry-collector:latest   # pin a version in real use
secrets:
  pg: { file: ./secrets/pg_password.txt }
```

Run `docker compose up --build`. Redis and Postgres publish no ports, so only the agent is reachable.

---

## 5. State and memory

**Rule:** pods are stateless. Anything that must survive a restart goes in Redis or Postgres.

```python
# app/state.py
import json, redis.asyncio as redis
from app.settings import settings

r = redis.from_url(settings.redis_url, decode_responses=True)

def _k(user: str, sid: str) -> str:
    return f"sess:{user}:{sid}"                      # user id in the key = per-user isolation

async def load(user, sid) -> list[dict]:
    raw = await r.get(_k(user, sid))
    return json.loads(raw) if raw else []

async def save(user, sid, msgs: list[dict]):
    await r.set(_k(user, sid), json.dumps(msgs[-40:]), ex=86400)   # cap history, TTL

async def claim_idempotency(user, key: str) -> bool:
    return bool(await r.set(f"idem:{user}:{key}", "1", nx=True, ex=600))
```

- `user` comes from the verified JWT, never from the request body. This prevents cross-user reads.
- Clients send an `Idempotency-Key` header. If `claim_idempotency` returns False, return the stored result or 409, so retries don't repeat paid calls or side effects.
- For LangGraph checkpoints, use its Postgres checkpointer. Check the current package name and API.
- Use Redis auth and TLS outside local dev.

---

## 6. Kubernetes fundamentals for agents

```yaml
# k8s/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: agent }
spec:
  replicas: 2
  selector: { matchLabels: { app: agent } }
  strategy: { rollingUpdate: { maxUnavailable: 0, maxSurge: 1 } }
  template:
    metadata: { labels: { app: agent } }
    spec:
      serviceAccountName: agent
      automountServiceAccountToken: false
      terminationGracePeriodSeconds: 90           # longer than your longest stream
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: agent
          image: ghcr.io/OWNER/agent:REPLACED_BY_CI    # pin by digest in prod
          ports: [{ containerPort: 8000 }]
          envFrom:
            - configMapRef: { name: agent-config }
          env:
            - name: OPENAI_API_KEY
              valueFrom: { secretKeyRef: { name: agent-secrets, key: OPENAI_API_KEY } }
          resources:
            requests: { cpu: 250m, memory: 256Mi }
            limits: { memory: 512Mi }               # memory limit yes; CPU limit optional
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: [ALL] }
          volumeMounts: [{ name: tmp, mountPath: /tmp }]
          startupProbe:   { httpGet: { path: /healthz, port: 8000 }, failureThreshold: 30, periodSeconds: 2 }
          livenessProbe:  { httpGet: { path: /healthz, port: 8000 }, periodSeconds: 10 }
          readinessProbe: { httpGet: { path: /readyz,  port: 8000 }, periodSeconds: 5 }
          lifecycle:
            preStop: { exec: { command: ["sleep","10"] } }   # let the LB drain first
      volumes: [{ name: tmp, emptyDir: {} }]
---
apiVersion: v1
kind: Service
metadata: { name: agent }
spec:
  selector: { app: agent }
  ports: [{ port: 80, targetPort: 8000 }]
```

**Graceful shutdown:** on SIGTERM, Kubernetes removes the pod from endpoints. `preStop` gives load balancers time to stop sending traffic, and uvicorn then finishes in-flight streams until the grace period ends. Run uvicorn with `--timeout-graceful-shutdown 60`.

**Ingress:** SSE needs proxy buffering off and a long read timeout. For ingress-nginx, set `nginx.ingress.kubernetes.io/proxy-buffering: "off"` and `proxy-read-timeout: "300"`. Gateway API is the newer alternative.

---

## 7. Long-running and async work

Pattern: the API enqueues, a worker runs the agent, and the client polls or gets a webhook.

```python
# app/main.py (additions)
from app.state import r
@app.post("/v1/jobs", status_code=202)
async def submit(body: ChatIn, user: str = Depends(current_user)):
    job = uuid.uuid4().hex
    await r.hset(f"job:{job}", mapping={"user": user, "status": "queued", "q": body.message})
    await r.lpush("jobs", job)
    return {"job_id": job}

@app.get("/v1/jobs/{job}")
async def status(job: str, user: str = Depends(current_user)):
    d = await r.hgetall(f"job:{job}")
    if not d or d.get("user") != user:               # ownership check
        raise HTTPException(404)
    return {"status": d["status"], "answer": d.get("answer")}
```

```python
# worker/worker.py
import asyncio
from app.state import r
from models import get_model, FAST

async def main():
    llm = get_model(FAST)
    while True:
        item = await r.brpop("jobs", timeout=5)
        if not item: continue
        job = item[1]
        await r.hset(f"job:{job}", "status", "running")
        try:
            q = await r.hget(f"job:{job}", "q")
            out = await asyncio.wait_for(llm.ainvoke(q), timeout=120)    # hard timeout
            await r.hset(f"job:{job}", mapping={"status": "done", "answer": str(out.content)})
        except Exception:
            await r.hset(f"job:{job}", "status", "failed")
        await r.expire(f"job:{job}", 3600)

asyncio.run(main())
```

Caveat: `BRPOP` loses a job if the worker dies mid-run. For production, use a queue with acknowledgements (RabbitMQ, NATS JetStream, Redis Streams with consumer groups).

Use a `CronJob` for scheduled work, such as the nightly full eval from Part 4:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata: { name: nightly-eval }
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      backoffLimit: 1
      activeDeadlineSeconds: 3600
      template:
        spec:
          restartPolicy: Never
          containers: [{ name: eval, image: ghcr.io/OWNER/agent-evals:TAG, command: ["pytest","tests/test_eval.py"] }]
```

---

## 8. Reliability

```python
# app/reliability.py
import time, asyncio
from tenacity import retry, stop_after_attempt, wait_exponential_jitter, retry_if_exception_type

class Breaker:
    def __init__(self, fails=5, cooldown=30): self.fails, self.cool, self.n, self.opened = fails, cooldown, 0, 0.0
    def allow(self): return self.n < self.fails or time.time() - self.opened > self.cool
    def ok(self): self.n = 0
    def bad(self):
        self.n += 1
        if self.n >= self.fails: self.opened = time.time()

breaker = Breaker()

@retry(stop=stop_after_attempt(3), wait=wait_exponential_jitter(initial=0.5, max=8),
       retry=retry_if_exception_type((TimeoutError, ConnectionError)), reraise=True)
async def _call(llm, prompt): return await asyncio.wait_for(llm.ainvoke(prompt), timeout=30)

async def resilient(primary, fallback, prompt):
    for llm in (primary, fallback):
        if not breaker.allow(): continue
        try:
            out = await _call(llm, prompt); breaker.ok(); return out
        except Exception:
            breaker.bad()
    raise RuntimeError("all models unavailable")     # route turns this into a 503
```

- **Retry only transient errors**, and only idempotent calls. Never retry a tool with side effects blindly.
- **Fallback model** (cheaper or another provider) keeps you up during outages.
- **Caps:** `max_steps` in the agent loop (Part 4's `run_agent`), a per-request token cap and a per-user budget (section 12).
- **429s:** honour `Retry-After`, keep concurrency capped (section 9) and use jitter.
- **Degrade gracefully:** return a short "try later" or a cached answer rather than an error page.

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: agent }
spec:
  minAvailable: 1
  selector: { matchLabels: { app: agent } }
```

Spread replicas with `topologySpreadConstraints` so one node failure doesn't take out all pods.

---

## 9. Scaling

An LLM-bound service spends most of its time waiting, so CPU stays low while requests pile up. **Scale on in-flight requests or queue depth.**

Cap concurrency in the app so overload becomes a fast 429 rather than a timeout:

```python
import asyncio
from fastapi import Request
from app.settings import settings
sem = asyncio.Semaphore(settings.max_inflight)

@app.middleware("http")
async def limit(request: Request, call_next):
    if request.url.path.startswith("/v1/"):
        if sem.locked():
            from fastapi.responses import JSONResponse
            return JSONResponse({"detail": "busy"}, status_code=429, headers={"Retry-After": "2"})
        async with sem:
            return await call_next(request)
    return await call_next(request)
```

Note that for SSE streams, `call_next` returns before the body finishes, so this under-counts streams. For exact counting, acquire the semaphore inside the generator. Treat the middleware as a starting point.

HPA on a custom metric (needs a metrics adapter such as prometheus-adapter):

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: agent }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: agent }
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Pods
      pods:
        metric: { name: agent_inflight_requests }
        target: { type: AverageValue, averageValue: "10" }
  behavior:
    scaleDown: { stabilizationWindowSeconds: 300 }
```

KEDA for workers, scaling on queue depth (including to zero):

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: worker }
spec:
  scaleTargetRef: { name: worker }
  minReplicaCount: 0
  maxReplicaCount: 20
  triggers:
    - type: redis
      metadata: { address: redis:6379, listName: jobs, listLength: "5" }
```

Max replicas × per-pod concurrency must stay under your provider rate limit. Autoscaling into a 429 wall just wastes money.

---

## 10. Security hardening

**AuthN/AuthZ (OIDC/JWT):**

```python
# app/security.py
import jwt                                   # PyJWT
from fastapi import Header, HTTPException
from app.settings import settings

_jwks = jwt.PyJWKClient(settings.jwks_url, cache_keys=True)

def current_user(authorization: str = Header(default="")) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(401)
    token = authorization[7:]
    try:
        key = _jwks.get_signing_key_from_jwt(token).key
        claims = jwt.decode(token, key, algorithms=["RS256"],        # allow-list algorithms
                            audience=settings.jwt_audience, issuer=settings.jwt_issuer)
    except Exception:
        raise HTTPException(401)
    return claims["sub"]
```

Deny by default. Check scopes or roles per route and per tool, for example whether this tenant may call the `refund` tool at all.

**NetworkPolicy:** default-deny, then allow only what's needed.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny }
spec: { podSelector: {}, policyTypes: [Ingress, Egress] }
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: agent-allow }
spec:
  podSelector: { matchLabels: { app: agent } }
  policyTypes: [Ingress, Egress]
  ingress:
    - from: [{ namespaceSelector: { matchLabels: { kubernetes.io/metadata.name: ingress-nginx } } }]
      ports: [{ port: 8000 }]
  egress:
    - to: [{ podSelector: { matchLabels: { app: redis } } }]
      ports: [{ port: 6379 }]
    - to: [{ namespaceSelector: {}, podSelector: { matchLabels: { k8s-app: kube-dns } } }]
      ports: [{ port: 53, protocol: UDP }]
    - to: [{ ipBlock: { cidr: 0.0.0.0/0, except: [10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16] } }]
      ports: [{ port: 443 }]
```

The last rule allows internet HTTPS but blocks private ranges and the cloud metadata endpoint (`169.254.169.254`), which defends against SSRF. Standard `NetworkPolicy` can't filter by hostname. For a true host allow-list (`api.openai.com` only), use an egress proxy or a CNI with FQDN policies (Cilium). It needs a CNI that enforces policies, and `kind`'s default CNI does not, so install Calico or Cilium for exercise 6.

**Other controls:**

| Control | How |
|---|---|
| Pod Security Standards | Label the namespace `pod-security.kubernetes.io/enforce: restricted` |
| RBAC | A dedicated `ServiceAccount` with no roles, and token automount off (done above) |
| TLS | cert-manager plus an Ingress `tls:` block, HSTS at the edge |
| Rate limiting | Ingress annotations or a gateway, in addition to per-user budgets |
| Headers | `X-Content-Type-Options: nosniff`, `Content-Security-Policy`, strict CORS allow-list |
| Tool sandboxing | Run code or shell tools in a separate, no-network, short-lived pod (gVisor or Kata `RuntimeClass` if available) |
| Prompt injection | Treat retrieved text as data, allow-list tools per tenant, require confirmation for destructive actions (Part 3 guards) |
| Supply chain | Trivy, SBOM, cosign, and admission policy (Kyverno) to accept only signed images |

---

## 11. Observability

```python
# app/metrics.py
from prometheus_client import Counter, Histogram, Gauge, make_asgi_app
REQS = Counter("agent_requests_total", "requests", ["route", "status"])
LAT = Histogram("agent_latency_seconds", "latency", ["route"], buckets=(.5, 1, 2, 5, 10, 30, 60))
TOK = Counter("agent_tokens_total", "tokens", ["model", "kind"])        # kind=input|output
TOOL_ERR = Counter("agent_tool_errors_total", "tool errors", ["tool"])
INFLIGHT = Gauge("agent_inflight_requests", "in flight")
# app.mount("/metrics", make_asgi_app())  and block /metrics at the ingress; scrape in-cluster only
```

- **Labels:** never use user ids or prompts as labels. High cardinality will break Prometheus.
- **Logs:** JSON, with request id and trace id. Log metadata, not raw prompts or answers.
- **PII redaction:**

```python
import re
_P = [(re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+"), "[email]"), (re.compile(r"\b(?:\d[ -]?){13,16}\b"), "[card]"),
      (re.compile(r"sk-[A-Za-z0-9_-]{20,}"), "[key]")]
def redact(s: str) -> str:
    for rx, sub in _P: s = rx.sub(sub, s)
    return s
```
This regex set is a minimum, not complete. Use a dedicated PII tool for real data.

- **Tracing:** OpenTelemetry auto-instrumentation for FastAPI and HTTPX, exporting OTLP to the collector. Make one span per model call and per tool call.
- **Alerts (Prometheus):** p95 latency, 5xx rate, 429 rate, token spend per hour, breaker open, queue depth growing.

```yaml
- alert: AgentHighErrorRate
  expr: sum(rate(agent_requests_total{status=~"5.."}[5m])) / sum(rate(agent_requests_total[5m])) > 0.05
  for: 10m
```

---

## 12. Cost and capacity control

```python
# app/cost.py
from app.state import r
from app.settings import settings
import datetime as dt

async def charge(user: str, tokens: int) -> bool:
    key = f"budget:{user}:{dt.date.today()}"
    used = await r.incrby(key, tokens)
    await r.expire(key, 172800)
    return used <= settings.daily_token_budget

async def within_budget(user: str) -> bool:
    return int(await r.get(f"budget:{user}:{dt.date.today()}") or 0) < settings.daily_token_budget
```

Call `within_budget` before the model and `charge` afterwards with the usage from the response. Return 429 when over.

| Lever | Note |
|---|---|
| Response cache | Cache only deterministic, non-personal answers. Key it on a hash of normalised input, and never cache across tenants. |
| Model routing | A cheap model for easy requests and a strong one for hard or borderline ones |
| Caps | Max input chars, `max_tokens`, max steps |
| Concurrency | Section 9, tied to the provider limit |
| Provider-side limit | Set a spend limit in the provider dashboard as the last backstop |
| Node sizing | Agents are memory- and I/O-bound, so small pods and more replicas |

---

## 13. Packaging and config for Kubernetes

```
k8s/base/kustomization.yaml     # lists deployment, service, config, netpol, pdb, hpa
k8s/overlays/dev/kustomization.yaml
k8s/overlays/prod/kustomization.yaml
```

```yaml
# k8s/overlays/prod/kustomization.yaml
resources: [../../base]
namespace: agent-prod
images:
  - name: ghcr.io/OWNER/agent
    digest: sha256:REPLACED_BY_CI
replicas: [{ name: agent, count: 4 }]
patches:
  - target: { kind: ConfigMap, name: agent-config }
    patch: |-
      - op: replace
        path: /data/AGENT_JWT_ISSUER
        value: "https://idp.example.com/"
```

Preview with `kubectl kustomize k8s/overlays/prod`, and apply with `kubectl apply -k`.

| Choice | Pick when |
|---|---|
| **Kustomize** | Your own app, a few environments, patch-style differences (recommended here) |
| **Helm** | You distribute the chart to others, or need heavy templating and a values API |
| Both | Install third-party tools (KEDA, cert-manager) with Helm, and your app with Kustomize |

---

## 14. CI/CD

```yaml
# .github/workflows/ci.yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }
permissions: { contents: read }
concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: pytest -q tests/test_eval_offline.py       # offline tests
      - run: pytest -q tests/test_eval.py               # eval gate (Part 4); skips if no key (forks)
        env: { OPENAI_API_KEY: "${{ secrets.OPENAI_API_KEY }}" }

  image:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write, id-token: write }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: "${{ github.actor }}", password: "${{ secrets.GITHUB_TOKEN }}" }
      - id: build
        uses: docker/build-push-action@v6
        with: { push: true, tags: "ghcr.io/${{ github.repository }}/agent:${{ github.sha }}" }
      - uses: aquasecurity/trivy-action@master        # pin to a release or SHA in real use
        with:
          image-ref: ghcr.io/${{ github.repository }}/agent@${{ steps.build.outputs.digest }}
          severity: HIGH,CRITICAL
          exit-code: "1"
      - uses: sigstore/cosign-installer@v3
      - run: cosign sign --yes ghcr.io/${{ github.repository }}/agent@${{ steps.build.outputs.digest }}
```

Notes:
- **Pin third-party actions to a commit SHA** in production, not `@master` or a tag.
- Build the image on every PR, and push only from `main`.
- **Scan before sign.** A failed scan stops the pipeline.
- The `id-token: write` permission enables OIDC. Use it for any cloud login rather than long-lived keys.
- Fork PRs get no secrets, so the eval gate skips there. Require a maintainer-triggered run before merge.

**GitOps with Argo CD:** CI doesn't touch the cluster. It opens a PR (or commits) that updates the image digest in `k8s/overlays/prod`. Argo CD syncs it.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: agent-prod, namespace: argocd }
spec:
  project: default
  source: { repoURL: https://github.com/OWNER/agent-deploy, targetRevision: main, path: k8s/overlays/prod }
  destination: { server: https://kubernetes.default.svc, namespace: agent-prod }
  syncPolicy: { automated: { prune: true, selfHeal: true }, syncOptions: [CreateNamespace=true] }
```

Use a separate deploy repo or path, branch protection on `main` and required reviews. Merging is the deploy approval.

---

## 15. Release strategies

| Strategy | How | Use for |
|---|---|---|
| Rolling update | Default `Deployment` (`maxUnavailable: 0`) | Low-risk changes |
| Canary | Argo Rollouts, 5% → 25% → 100% with metric checks | Prompt, model or tool changes |
| Blue/green | Two stacks, switch the Service | Big or breaking changes |
| Shadow | Mirror traffic to the new version and discard its responses; compare offline with Part 4 pairwise | Model swaps |
| Feature flags | Per-tenant toggles for new tools or prompts | Gradual exposure |

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata: { name: agent }
spec:
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - analysis: { templates: [{ templateName: error-rate }] }   # aborts and rolls back on failure
        - setWeight: 50
        - pause: { duration: 10m }
```

**Version prompts and models like code:** keep prompts in git, expose `PROMPT_VERSION` and `MODEL_NAME` as config, and attach both to every log line and trace. When quality drops, you can tie it to a version. Rollback means reverting the Git commit, and Argo CD restores the previous state.

---

## 16. Local Kubernetes workflow

```bash
kind create cluster --name agent
kind load docker-image ghcr.io/OWNER/agent:dev --name agent
kubectl create secret generic agent-secrets --from-literal=OPENAI_API_KEY="$OPENAI_API_KEY"
kubectl apply -k k8s/overlays/dev
kubectl port-forward svc/agent 8000:80
```

Fast iteration with Skaffold:

```yaml
# skaffold.yaml
apiVersion: skaffold/v4beta11
kind: Config
build: { artifacts: [{ image: ghcr.io/OWNER/agent, docker: { dockerfile: Dockerfile } }] }
manifests: { kustomize: { paths: [k8s/overlays/dev] } }
```

Run `skaffold dev`. Check the current Skaffold schema version. `minikube` works equally well. Tilt is an alternative.

---

## 17. Optional: serving a local model (vLLM)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: vllm }
spec:
  replicas: 1
  selector: { matchLabels: { app: vllm } }
  template:
    metadata: { labels: { app: vllm } }
    spec:
      nodeSelector: { accelerator: nvidia }
      containers:
        - name: vllm
          image: vllm/vllm-openai:TAG          # pin a version
          args: ["--model","Qwen/Qwen2.5-14B-Instruct","--max-model-len","8192"]
          resources: { limits: { nvidia.com/gpu: 1 } }
          ports: [{ containerPort: 8000 }]
          startupProbe:   { httpGet: { path: /health, port: 8000 }, failureThreshold: 120, periodSeconds: 10 }
          readinessProbe: { httpGet: { path: /health, port: 8000 }, periodSeconds: 10 }
          volumeMounts: [{ name: shm, mountPath: /dev/shm }]
      volumes: [{ name: shm, emptyDir: { medium: Memory, sizeLimit: 2Gi } }]
```

Needs the NVIDIA device plugin. Use a long `startupProbe`, because model loading takes minutes. Cache weights on a PersistentVolume. Expose it only through a `ClusterIP` Service with a `NetworkPolicy` that admits the agent only. The agent talks to it using `base_url=http://vllm/v1` (see Part 4, exercise 12). Add auth in front if anything else shares the cluster.

---

## 18. Production feedback loop

1. Capture signals: thumbs up/down, retries, error traces, and low-scoring online judge samples.
2. Redact PII (section 11), with a human review before anything enters the dataset.
3. Add each failure to `evals/cases.jsonl` as a new `dev` case, with a reference answer written by a human.
4. Re-baseline through code review (Part 4).
5. Run online evals on a sample of live traffic (judge on 1–5%) and alert when the pass rate drops.
6. Store feedback with the trace id, `PROMPT_VERSION` and `MODEL_NAME`.

Get user consent and follow your retention policy before storing conversations.

---

## 19. Common mistakes

| Mistake | Fix |
|---|---|
| Keys baked into the image or committed | Env from a Secret or External Secrets, `.dockerignore`, secret scanning |
| Running as root | `runAsNonRoot`, drop capabilities, read-only filesystem |
| No resource requests/limits | Set requests, and a memory limit |
| Liveness probe checks Redis or the LLM | Liveness is process-only, readiness checks dependencies |
| No graceful shutdown | `preStop`, grace period, uvicorn graceful timeout |
| Scaling on CPU only | In-flight requests or queue depth (KEDA) |
| Autoscaling past the provider rate limit | Cap max replicas and concurrency |
| Retrying non-idempotent tools | Idempotency keys, retry only reads |
| Unlimited agent loops/tokens | Step, token and per-user budget caps |
| Session state in pod memory | Redis/Postgres |
| `user_id` taken from the request body | Take it from the verified token |
| Open egress | Default-deny `NetworkPolicy`, block metadata IPs, egress proxy |
| Prompts and PII in logs and metric labels | Redact, log metadata only, low-cardinality labels |
| `latest` tags, unpinned actions | Digests and SHAs |
| CI deploys with `kubectl` and a long-lived kubeconfig | GitOps, or OIDC |
| Deploying prompt changes without evals | Eval gate plus canary |
| `/metrics` and docs exposed publicly | Block at the ingress |

---

## 20. Exercises

| # | Build | Expected result |
|---|---|---|
| 1 | FastAPI `/v1/chat` and `/v1/chat/stream` | A 5,000-char message returns 422, and the stream emits `data:` events then `done` |
| 2 | Multi-stage, non-root Dockerfile | `docker run --read-only --cap-drop ALL` works, and Trivy has no HIGH/CRITICAL |
| 3 | Compose with agent and Redis | Session survives an agent restart |
| 4 | `kind` with Deployment, Service, probes | `kubectl delete pod` and a new pod becomes Ready, with no failed requests (2 replicas) |
| 5 | Secret via `kubectl create secret` | `docker history` and `git log -p` contain no key |
| 6 | Default-deny `NetworkPolicy` plus allow rules (on Calico or Cilium) | `curl` to a private IP or `169.254.169.254` from the pod fails |
| 7 | HPA/KEDA with a load script | Replicas grow under load and shrink after the stabilization window |
| 8 | Kustomize dev and prod overlays | `kubectl kustomize` shows different replicas, and the base is unchanged |
| 9 | CI: test, eval gate, build, scan, sign | Pipeline fails when a must-pass eval case breaks |
| 10 | Argo CD `Application` | A merge to `main` updates the cluster, and a manual `kubectl edit` is reverted (selfHeal) |
| 11 | Argo Rollouts canary with analysis | A version with an injected 500 error rate is aborted automatically |
| 12 | Prometheus and Grafana dashboard | p95 latency, tokens/min and cost per route are visible |
| 13 | Per-user budget | The user gets 429 after the budget, and another user is unaffected |
| 14 | Kill Redis | `/readyz` fails and pods leave rotation, `/healthz` stays OK, and no restarts happen |

---

## Next steps

I can build this as a working repo (the app, Dockerfile, Compose, Kustomize, CI workflow and tests) if you give me the `owner/repo`. I won't create a repo without your say-so.

Two decisions affect what I'd build. Which should I assume?
1. **Ingress:** ingress-nginx, or Gateway API?
2. **Secrets in the demo:** plain `Secret`, or External Secrets with a local Vault?