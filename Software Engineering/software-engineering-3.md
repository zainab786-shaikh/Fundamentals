
---
Confirmed — all code examples will use **TypeScript only**. I’ll start with **3.1 Dev environment**.

# 3.1 Dev environment

## Problem

Without a consistent development environment, developers encounter:

- “Works on my machine” failures.
- Different Node.js, package-manager, formatter, or OS behavior.
- Slow onboarding and inconsistent debugging.
- Accidental use of development secrets or unsafe local configuration.
- Production defects caused by environment differences.

```text
Developer A (Windows) ─┐
Developer B (macOS) ───┼──> Different tools/configuration ──> Inconsistent behavior
Developer C (Linux) ───┘
```

---

## Solution 1 — Documented local setup

Use VS Code, a supported Node.js version, a lockfile, environment-variable templates, and a clear README.

```text
README + Node version + lockfile + .env.example
                    │
                    ▼
       More repeatable local setup
```

### Pros

- Simple and fast to adopt.
- Works across Windows, macOS, and Linux.
- Minimal infrastructure.
- Good starting point for small projects.

### Cons

- Developers must install and configure tools themselves.
- Native dependencies can behave differently by operating system.
- Documentation can become outdated.

### Remaining limitation

A documented setup reduces differences but does not eliminate them. A developer can still have an incompatible runtime, global package, or operating-system dependency.

---

## Solution 2 — Version pinning and automated checks

Pin the runtime and dependencies, commit the lockfile, and run checks automatically.

Use:

- A supported Node.js LTS version.
- A package-manager lockfile.
- VS Code workspace recommendations.
- TypeScript strict mode.
- Linting, formatting, tests, and type checks in CI.
- `.env.example` containing **only non-secret placeholders**.

### Pros

- Prevents dependency drift.
- Detects incompatible changes before merge.
- Reduces setup errors.
- Improves code consistency across contributors.

### Cons

- Still depends on each developer’s host OS.
- Requires maintaining Node.js and tool versions.
- Local services such as databases may still differ.

### Remaining limitation

The project code is consistent, but the OS, installed tools, and local services can still vary.

---

## Solution 3 — Dev containers

Use a **VS Code dev container** to define a reproducible workspace in a container.

```text
VS Code
  │
  ▼
Dev Container
  ├── Pinned Node.js runtime
  ├── Project dependencies
  ├── TypeScript tooling
  ├── Linters and test tools
  └── Optional local services
```

### Pros

- Strong consistency across Windows, macOS, and Linux.
- Faster, more reliable onboarding.
- Keeps project tools isolated from the host machine.
- Lets CI and local development use similar environments.
- Makes it easier to standardize security tooling.

### Cons

- Requires a container runtime such as Docker.
- Can consume more disk, CPU, and memory.
- Filesystem performance may be slower on some host/container combinations.
- Adds configuration to maintain.

### Remaining limitation

Containers provide a consistent development environment, but they do not replace secure secret management, production infrastructure validation, or CI.

---

## Decision guide

| Situation | Choose |
|---|---|
| Small project, one or two contributors, few native dependencies | Documented local setup |
| Team project requiring reliable builds and reviews | Version pinning plus automated checks |
| Cross-platform team, complex tooling, services, or frequent onboarding | Dev containers |
| Security-sensitive or regulated project | Dev containers plus managed secrets and CI security scanning |

**Recommended default:** start with version pinning and CI checks. Add dev containers when onboarding friction, OS inconsistency, or service dependencies become noticeable.

---

## Practical TypeScript example — validated environment configuration

Application configuration should fail early when required values are missing or unsafe. Do not silently accept invalid configuration.

```typescript name=config.ts
type Environment = "development" | "test" | "production";

interface AppConfig {
  environment: Environment;
  port: number;
  databaseUrl: string;
}

const allowedEnvironments = new Set<Environment>([
  "development",
  "test",
  "production",
]);

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parsePort(value: string): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function parseEnvironment(value: string): Environment {
  if (!allowedEnvironments.has(value as Environment)) {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  return value as Environment;
}

export const config: AppConfig = {
  environment: parseEnvironment(process.env.NODE_ENV ?? "development"),
  port: parsePort(process.env.PORT ?? "3000"),
  databaseUrl: requireEnvironmentVariable("DATABASE_URL"),
};
```

### Why this is safer

- Fails at startup instead of failing later under load.
- Validates configuration values before using them.
- Does not log secrets such as `DATABASE_URL`.
- Keeps secrets outside source control.

---

## Validation

### Security

- Never commit `.env` files containing real credentials.
- Commit an `.env.example` with placeholders only.
- Use a secret manager for shared, staging, and production secrets.
- Restrict access using least privilege.
- Rotate credentials when exposure is suspected.
- Run dependency vulnerability scanning in CI.

### Cross-platform compatibility

- Use Node.js LTS.
- Avoid OS-specific shell commands in package scripts where possible.
- Prefer TypeScript/Node.js scripts over platform-specific automation.
- Test setup on Windows, macOS, and Linux if all are supported.

### Performance

- Exclude heavy folders such as dependency and build-output directories from file watching.
- Cache dependencies in CI.
- Keep container images small and pin base-image versions.

### Scalability and operations

- Ensure local, CI, staging, and production configuration use the same variable names.
- Add health checks before deploying services.
- Log non-sensitive runtime metadata: version, environment name, and enabled features.
- Document setup, common failures, and recovery steps in the README.

### Testing checklist

- Run type checking.
- Run linting and formatting checks.
- Run unit tests.
- Verify the application fails safely with a missing required environment variable.
- Verify production startup rejects insecure or invalid configuration.

---
# 3.2 Version control

## Problem

Without version control discipline, teams lose history, overwrite each other’s work, and struggle to recover from defects.

Common failures:

- Changes are made directly in the shared branch.
- Commit history is unclear or mixes unrelated work.
- A bug cannot be traced to a specific change.
- Merge conflicts become expensive and risky.
- Sensitive files, such as `.env`, are committed accidentally.
- Large features remain unreviewed until late in development.

```text
Developer A ──┐
Developer B ──┼──> Shared files without controlled integration
Developer C ──┘
                    ↓
          Lost work, conflicts, unclear history
```

---

## Solution 1 — Git with small, meaningful commits

Use Git to record changes locally before sharing them. Each commit should represent one logical, buildable change.

```text
Working directory
      │
      ▼
git add
      │
      ▼
git commit
      │
      ▼
Readable project history
```

Example commit messages:

```text
feat(auth): add login request validation
fix(api): return 404 for unknown user
test(auth): cover expired session handling
docs(readme): clarify local setup
```

### Pros

- Preserves change history.
- Makes it easier to undo a specific change.
- Supports collaboration without sharing files manually.
- Helps identify when a regression was introduced.

### Cons

- Commit history becomes hard to use if commits are vague or too large.
- Local commits alone do not provide review, automated checks, or shared backup.
- Developers can still commit secrets or unsafe changes.

### Remaining limitation

Git tracks changes, but it does not govern how changes enter the shared codebase.

---

## Solution 2 — Branches and pull requests

Create a short-lived branch for a focused change, then open a pull request (PR) for review and automated validation.

```text
main
 │
 ├── feature/login-validation
 │       │
 │       ├── commits
 │       ├── tests
 │       └── pull request ──> review + CI ──> merge
 │
 └── main
```

A PR should contain:

- A clear title and description.
- One focused purpose.
- Tests appropriate to the change.
- Security-relevant context, where applicable.
- Passing automated checks.
- Review by an authorized contributor.

### Pros

- Enables peer review before changes reach the shared branch.
- Allows CI to run tests, linting, type checking, and security scans.
- Creates an auditable discussion and approval record.
- Reduces the likelihood of accidental production regressions.

### Cons

- Adds process overhead.
- Long-lived branches drift from the main branch and increase merge conflicts.
- Large PRs are slow and difficult to review well.

### Remaining limitation

PRs help control integration, but teams still need a branching strategy that keeps changes small and frequently integrated.

---

## Solution 3 — Trunk-based development

With trunk-based development, developers integrate small changes into the main branch frequently. Feature branches are short-lived—usually hours or a few days.

Incomplete features are protected with feature flags rather than long-lived branches.

```text
main ──●──●──●──●──●──●──>
         \  /      \ /
       short-lived  short-lived
         branches    branches
```

### Pros

- Minimizes merge conflicts.
- Keeps work close to the latest tested code.
- Encourages small, reviewable PRs.
- Fits continuous integration and continuous delivery well.
- Speeds feedback from tests and reviewers.

### Cons

- Requires reliable automated tests and CI.
- Requires discipline to keep changes small.
- Incomplete work must be safely hidden or disabled.
- Teams need a safe feature-flag lifecycle to avoid permanent dead code.

### Remaining limitation

Trunk-based development is excellent for frequent delivery, but teams supporting multiple maintained releases may need formal release branches.

---

## Solution 4 — GitFlow or release branching

GitFlow typically uses dedicated branches such as `develop`, `release/*`, and `hotfix/*`, in addition to the production branch.

```text
main       ───────●────────────●────>
                    \ hotfix   /
develop    ──●──●──●──●──●──●──●────>
                    \
release/1.2          ●──●──●
```

### Pros

- Makes release stabilization explicit.
- Can fit products with scheduled releases and multiple supported versions.
- Provides a clear hotfix path for production issues.
- Useful when release approvals are formal or regulated.

### Cons

- More branches and rules to maintain.
- Changes can be duplicated across branches.
- Merge and release coordination become more complex.
- Feedback arrives later than with frequent mainline integration.
- Often adds unnecessary friction for continuously deployed services.

### Remaining limitation

A branching model does not replace branch protection, review policy, or secure CI.

---

## Merge vs. rebase

### Merge

A merge combines two histories and retains the actual integration point.

```text
Before:

main:    A──B──C
             \
feature:      D──E

After merge:

main:    A──B──C────M
             \     /
feature:      D──E
```

**Pros**

- Does not rewrite existing history.
- Safest choice for shared branches.
- Shows when work was integrated.

**Cons**

- Can create a noisier history when used frequently.
- Repeated merges from `main` into a feature branch can clutter the graph.

### Rebase

A rebase replays commits onto a newer base.

```text
Before:

main:    A──B──C
             \
feature:      D──E

After rebase:

main:    A──B──C
                 \
feature:          D'──E'
```

**Pros**

- Produces a linear, easier-to-read history.
- Lets a developer update a private feature branch before opening or updating a PR.

**Cons**

- Rewrites commit identifiers.
- Can disrupt collaborators if used on a shared branch.
- Requires force-pushing after rebasing.

### Safe rule

> Rebase only commits on a branch you alone control.  
> Do not rebase a shared or protected branch.

When force-pushing your own feature branch after a rebase, prefer:

```bash
git push --force-with-lease
```

`--force-with-lease` refuses to overwrite remote changes you have not fetched, making it safer than `--force`.

---

## Decision guide

| Situation | Choose |
|---|---|
| Any team project | Git, focused commits, PRs, protected primary branch |
| Frequently deployed web service | Trunk-based development with short-lived branches |
| Small team with strong CI and feature flags | Trunk-based development |
| Scheduled releases or several supported versions | Release branches; use GitFlow only if its added process is justified |
| Updating your own feature branch before review | Rebase |
| Integrating shared branches or preserving integration history | Merge |
| Unsure which branching model to use | Start with short-lived feature branches targeting `main` |

**Recommended default:** short-lived feature branches, PR review, required CI checks, and a protected `main` branch. This gets most of the benefits of trunk-based development without unnecessary branch complexity.

---

## Practical workflow

```text
1. Update local main
2. Create focused branch
3. Make a small change
4. Run checks locally
5. Commit with clear message
6. Push branch
7. Open PR
8. Review + CI pass
9. Merge into protected main
10. Delete merged branch
```

Example commands:

```bash
git switch main
git pull --ff-only

git switch -c fix/login-validation

git add src/auth/login.ts tests/auth/login.test.ts
git commit -m "fix(auth): reject malformed login requests"

git push -u origin fix/login-validation
```

`git pull --ff-only` prevents Git from silently creating a merge commit when the local branch has diverged. Resolve divergence deliberately instead.

---

## Validation

### Security

- Protect the primary branch from direct pushes.
- Require pull-request review and passing checks before merge.
- Restrict who can bypass branch protections.
- Use secret scanning and push protection where available.
- Add `.env`, certificates, private keys, and generated credentials to `.gitignore`.
- If a secret is committed, treat it as exposed: revoke or rotate it immediately. Removing it from Git history alone is not sufficient.
- Require dependency and static-analysis checks for relevant changes.

### Testing and quality

A PR should normally run:

```text
TypeScript type check
→ linting and formatting
→ unit tests
→ integration tests where relevant
→ dependency vulnerability scanning
→ build/package validation
```

### Performance and scalability

- Keep branches and PRs small to reduce merge-conflict cost.
- Avoid committing build output, dependencies, logs, coverage reports, or large binary files.
- Use Git LFS only when large binary assets are genuinely required.
- Split independent changes into separate PRs so they can be reviewed and deployed independently.

### Accessibility

Version control does not directly affect user accessibility, but PR review should require accessibility checks for UI changes:

- Keyboard navigation.
- Semantic HTML.
- Focus behavior.
- Accessible names and labels.
- Screen-reader validation where appropriate.

### Operational considerations

- Tag production releases using a consistent convention, such as `v1.4.0`.
- Link deployment artifacts to the commit SHA that produced them.
- Keep rollback instructions documented.
- Prefer reverting a problematic production commit with a new commit over rewriting published history.

---

# 3.3 Language and programming fundamentals

## Problem

Applications fail when code does not model data correctly, handles errors inconsistently, blocks execution unnecessarily, or shares mutable state unsafely.

Typical results:

- Invalid data reaches business logic or persistence.
- `null` / `undefined` errors occur at runtime.
- Slow operations block requests.
- Concurrent work produces inconsistent state.
- Errors are hidden, swallowed, or expose internal details.
- Memory use grows because objects, timers, listeners, or responses are retained longer than needed.

```text
Unvalidated input
      │
      ▼
Incorrect assumptions in code
      │
      ▼
Runtime errors, data corruption, slow or unreliable requests
```

---

## Solution 1 — Use TypeScript types

TypeScript adds compile-time checking over JavaScript. Use explicit types where they make contracts clearer, enable strict compiler settings, and model uncertainty honestly.

```text
JavaScript:  value can be anything
TypeScript:  value must match an expected shape
```

### Pros

- Catches many errors before running the application.
- Makes function contracts and data structures clearer.
- Improves editor completion, refactoring, and navigation.
- Helps prevent incorrect assumptions about optional values.

### Cons

- Types do not validate untrusted runtime data.
- Incorrect type assertions can hide defects.
- Type complexity can reduce readability when overused.

### Remaining limitation

TypeScript disappears at runtime. Data received from HTTP requests, environment variables, databases, files, or queues can still be malformed.

---

## Solution 2 — Validate runtime boundaries

Validate untrusted data at the point it enters the system, then convert it into a trusted internal type.

```text
Untrusted boundary data
        │
        ▼
Runtime validation
        │
        ▼
Trusted typed application data
```

Typical boundaries:

- HTTP requests and query parameters.
- Webhook payloads.
- Environment variables.
- Queue messages.
- Uploaded files.
- External API responses.

### Pros

- Prevents malformed values from reaching business logic.
- Gives users clear, safe validation errors.
- Reduces injection, type-confusion, and unexpected-state risks.
- Complements compile-time TypeScript checking.

### Cons

- Requires deliberate validation code or a maintained validation library.
- Adds a small amount of runtime work.
- Schema definitions must evolve with APIs.

### Remaining limitation

Validated data can still cause failures during asynchronous work—database calls, network requests, file operations, and background jobs need error and cancellation handling.

---

## Solution 3 — Use asynchronous APIs deliberately

JavaScript runs application code on a single event-loop thread. Asynchronous I/O lets the runtime wait for network, file, and database operations without blocking other requests.

Use `async`/`await` for promise-based asynchronous work.

```text
Request A: start database request ── wait ── continue
Request B: start API request      ── wait ── continue
Request C: can run while A/B wait
```

### Pros

- Improves throughput for I/O-heavy services.
- Usually reads more clearly than chained `.then()` calls.
- Lets errors be handled with `try` / `catch`.
- Supports cancellation through `AbortSignal` in APIs that accept it.

### Cons

- Forgetting `await` can create race conditions or unhandled promise rejections.
- Sequential `await`s can be unnecessarily slow if work is independent.
- `Promise.all()` fails as soon as one promise rejects.
- CPU-intensive work still blocks the event loop.

### Remaining limitation

Async I/O helps with waiting, not CPU-heavy computations or unsafe shared mutable state.

---

## Solution 4 — Limit concurrency and avoid shared mutable state

Start independent work in parallel, but limit concurrency when calling databases, external services, or resource-intensive operations.

```text
Unsafe:
Shared mutable state ──> concurrent updates ──> unpredictable result

Safer:
Immutable input ──> isolated operation ──> explicit result
```

For CPU-intensive operations, use a worker thread, job queue, or separate service rather than blocking request handling.

### Pros

- Prevents resource exhaustion.
- Avoids overwhelming downstream dependencies.
- Improves response consistency under load.
- Reduces concurrency-related bugs.

### Cons

- Adds operational and implementation complexity.
- Requires timeouts, retries, observability, and idempotency for background work.
- Parallelism must respect database connection and API rate limits.

### Remaining limitation

Even correctly concurrent code must expose errors safely and consistently.

---

## Error handling

### Problem

This pattern hides failure:

```typescript name=unsafe-error-handling.ts
try {
  await saveOrder();
} catch {
  // The operation failed, but the caller cannot know.
}
```

The request may look successful even though data was not saved.

### Better approach

- Validate expected failures and return a safe, actionable result.
- Log unexpected failures with structured, non-sensitive context.
- Return a generic server error to external callers.
- Preserve the original error as a `cause` for diagnostics when appropriate.
- Do not expose stack traces, SQL statements, credentials, tokens, or internal paths in production responses.

```text
Expected error     → safe client-facing response
Unexpected error   → log securely + generic server response
```

---

## Decision guide

| Need | Choose |
|---|---|
| Model known data inside the application | TypeScript types and interfaces |
| Accept HTTP, database, file, queue, or external API data | Runtime validation at the boundary |
| Make database, network, or filesystem calls | `async` / `await`, timeout, cancellation where supported |
| Run independent, small I/O operations | Parallel promises with controlled limits |
| Run CPU-intensive work | Worker threads, a job queue, or a separate service |
| Handle expected invalid user input | Explicit validation result and safe error message |
| Handle unexpected system failure | Structured logs and a generic external error response |

---

## Practical TypeScript example — validate input and handle async failure safely

This example demonstrates a small registration handler. It validates untrusted input, avoids leaking internal errors, and supports cancellation.

```typescript name=register-user.ts
type RegistrationInput = {
  email: string;
  password: string;
};

type RegistrationResult =
  | { ok: true; userId: string }
  | { ok: false; status: 400 | 409 | 500; message: string };

interface UserRepository {
  emailExists(email: string, signal: AbortSignal): Promise<boolean>;
  create(
    input: RegistrationInput,
    signal: AbortSignal,
  ): Promise<{ id: string }>;
}

function parseRegistrationInput(value: unknown): RegistrationInput | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const email = candidate.email;
  const password = candidate.password;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 254 ||
    password.length < 12 ||
    password.length > 128 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return null;
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
}

export async function registerUser(
  body: unknown,
  users: UserRepository,
  signal: AbortSignal,
): Promise<RegistrationResult> {
  const input = parseRegistrationInput(body);

  if (!input) {
    return {
      ok: false,
      status: 400,
      message: "Enter a valid email address and a password of at least 12 characters.",
    };
  }

  try {
    if (await users.emailExists(input.email, signal)) {
      return {
        ok: false,
        status: 409,
        message: "An account with that email address already exists.",
      };
    }

    // The repository must hash the password using Argon2id or bcrypt.
    // Never log or persist the raw password.
    const user = await users.create(input, signal);

    return { ok: true, userId: user.id };
  } catch (error) {
    if (signal.aborted) {
      return {
        ok: false,
        status: 500,
        message: "The request was cancelled. Please try again.",
      };
    }

    // Send this to structured logging with a request ID in production.
    // Do not include raw request bodies, passwords, or access tokens.
    console.error("User registration failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      ok: false,
      status: 500,
      message: "Unable to create the account right now. Please try again later.",
    };
  }
}
```

### Why this is safer

- `unknown` forces validation before values are used.
- Length limits reduce excessively large input processing.
- The returned type makes success and failure states explicit.
- The error response does not disclose database or internal implementation details.
- A cancellation signal allows the caller to stop work when the client disconnects or a timeout expires.
- The code explicitly identifies password hashing as a repository responsibility and prevents raw-password logging.

> In production, use a mature request-validation library where appropriate, enforce rate limiting, and use a robust email-validation policy suited to the application. The regular expression here is intentionally simple and should not be treated as proof that an email address exists.

---

## Validation

### Type safety

Use strict TypeScript compiler options:

```json name=tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

These options make unsafe optional access, missing cases, and incorrect overrides easier to detect.

### Security

- Treat all external data as `unknown` until validated.
- Use allow-lists and length limits; reject unexpected fields where the API contract requires it.
- Never use `any` for untrusted input.
- Do not use type assertions (`as SomeType`) as a substitute for validation.
- Use parameterized queries for persistence.
- Hash passwords with Argon2id or bcrypt; never encrypt or hash them manually.
- Apply request-size limits, rate limiting, authentication, and authorization.
- Avoid logging request bodies that may contain credentials, tokens, personal data, or payment data.

### Performance and scalability

- Do not perform CPU-heavy work in request handlers.
- Avoid sequential `await` when independent I/O can safely run concurrently.
- Set timeouts and pass cancellation signals to outbound calls where supported.
- Bound concurrency for bulk processing and background tasks.
- Monitor event-loop delay, queue depth, request latency, error rates, and dependency timeouts.

### Accessibility

Backend fundamentals do not create accessible UI directly, but error contracts affect accessibility:

- Return clear, user-safe validation messages.
- Include structured field-level errors when building form APIs.
- Let the frontend associate errors with fields and announce them to assistive technology.
- Avoid vague messages such as “Invalid input” when a safe, specific explanation is possible.

### Testing

Test at least:

```text
Valid input                         → success result
Missing / invalid fields            → safe 400 result
Duplicate account                   → safe 409 result
Repository failure                  → generic 500 result + log
Request cancellation                → no continued unsafe work
Unexpected runtime value            → rejected before business logic
```


---

# 3.4 Data structures and algorithms

## Problem

Poor data-structure and algorithm choices make applications slow, memory-heavy, and difficult to scale.

Common failures:

- Searching a large list repeatedly.
- Allowing duplicate values when uniqueness is required.
- Using nested loops that become slow as data grows.
- Sorting data repeatedly instead of indexing or caching it.
- Choosing an efficient algorithm that is too complex for a small, infrequent task.

```text
Small dataset:  inefficient code may appear fine
Large dataset:  the same code becomes slow or expensive
```

The key question is:

> How does the amount of work grow as the input grows?

---

## Solution 1 — Arrays and linear search

An array stores an ordered sequence of values. It is the standard choice for ordered data, iteration, filtering, and small collections.

```text
Array: ["draft", "review", "published"]
Index:    0        1          2
```

Searching an unsorted array checks values one by one.

```text
Find "published":

"draft" → "review" → "published"
```

This has **O(n)** time complexity: in the worst case, the work grows in proportion to the number of items.

### Pros

- Simple and familiar.
- Preserves order.
- Good for rendering lists, mapping, filtering, and small collections.
- Efficient sequential iteration.

### Cons

- Searching for one value is O(n).
- Checking uniqueness repeatedly is inefficient.
- Removing or inserting near the start shifts later items.

### Remaining limitation

Arrays are not ideal when the application frequently needs fast lookup by a unique key.

---

## Solution 2 — `Map` for keyed lookup and `Set` for uniqueness

Use a `Map` to store values by a key. Use a `Set` when only membership or uniqueness matters.

```text
Map:
"user-101" ──> { name: "Avery" }
"user-102" ──> { name: "Sam" }

Set:
"admin", "editor", "viewer"
```

Typical lookup and membership checks are **O(1)** on average.

### Pros

- Fast lookups by key.
- `Set` prevents duplicate values naturally.
- Makes intent explicit: lookup versus ordered list.
- Avoids repeated linear searches.

### Cons

- Does not provide sorted order.
- Uses additional memory.
- Object keys in a `Map` compare by reference, not by object content.
- Data must still be validated before becoming a key.

### Remaining limitation

`Map` and `Set` make individual lookups fast, but they do not answer range, prefix, or ordered-query needs by themselves.

---

## Solution 3 — Sort only when ordering is needed

Sorting arranges values for display, ranking, reporting, or binary search.

Common sort complexities:

| Algorithm | Typical complexity | Notes |
|---|---:|---|
| Linear search | O(n) | Works on any list |
| Binary search | O(log n) | Requires sorted data |
| Comparison sort | O(n log n) | Typical general-purpose sorting |
| Nested-loop comparison | O(n²) | Becomes expensive quickly |

```text
Unsorted: [42, 7, 19, 3]
Sorted:   [3, 7, 19, 42]

Binary search:
[3, 7, 19, 42]
       ↑
Compare middle, then discard half of remaining values.
```

### Pros

- Produces predictable ordering for users and reports.
- Enables binary search on static, sorted collections.
- Useful for ranking and pagination.

### Cons

- Sorting costs O(n log n).
- Sorting on every request wastes CPU for large or frequently accessed data.
- Sorting user-facing text requires locale-aware comparison.
- JavaScript’s default `sort()` converts values to strings, which can give unexpected results.

### Remaining limitation

In-memory sort and search work for moderate data. Large, shared, or persistent datasets need database indexes and query design.

---

## Solution 4 — Use database indexes for persistent data

For persistent application data, let the database search and order data using appropriate indexes instead of loading all rows into TypeScript.

```text
Application request
      │
      ▼
Parameterized indexed database query
      │
      ▼
Small result set returned to application
```

### Pros

- Scales better than loading entire datasets into memory.
- Reduces network transfer and application memory use.
- Lets the database optimize filtering, ordering, joins, and pagination.
- Supports concurrent access and durable storage.

### Cons

- Indexes consume storage and slow writes slightly.
- Incorrect indexes may not improve queries.
- Query plans and index usage must be measured, not assumed.
- The application still needs authorization and parameterized queries.

### Remaining limitation

Indexes solve lookup efficiency, but they do not fix bad API design, unbounded queries, excessive payloads, or missing access controls.

---

## Decision guide

| Need | Choose |
|---|---|
| Keep an ordered, small-to-medium list | `Array` |
| Find an item by ID repeatedly in memory | `Map<string, T>` |
| Track unique IDs, tags, or permissions | `Set<string>` |
| Display ordered results | Sort once when required |
| Search a sorted static collection | Binary search |
| Filter, sort, or paginate persistent large data | Indexed database query |
| Process a large collection | Paginate or stream; avoid loading all data at once |

**Recommended default:** use arrays for ordered collections, `Map` for repeated ID lookup, and `Set` for uniqueness. For production data, use database queries and indexes rather than in-memory filtering of all records.

---

## Practical TypeScript example — efficient, validated role lookup

This example turns role assignments into a `Set`, allowing fast permission checks and preventing duplicates.

```typescript name=permissions.ts
type Role = "admin" | "editor" | "viewer";

const validRoles = new Set<Role>(["admin", "editor", "viewer"]);

function parseRoles(value: unknown): Set<Role> {
  if (!Array.isArray(value) || value.length > 10) {
    return new Set();
  }

  const roles = new Set<Role>();

  for (const role of value) {
    if (typeof role === "string" && validRoles.has(role as Role)) {
      roles.add(role as Role);
    }
  }

  return roles;
}

export function canEditContent(untrustedRoles: unknown): boolean {
  const roles = parseRoles(untrustedRoles);

  return roles.has("admin") || roles.has("editor");
}
```

### Why this is useful

```text
Array approach:
roles.includes("admin") → O(n)

Set approach:
roles.has("admin")      → O(1) average
```

The performance difference may be small for three roles, but the `Set` also models the business rule that duplicate roles do not add meaning.

### Security limitation

A role in a client request must **not** be trusted for authorization. In a real application:

```text
Authenticated session
      │
      ▼
Server loads current roles from trusted server-side data
      │
      ▼
Server checks permission for the requested action
```

The example demonstrates data-structure choice only. Authorization must verify the authenticated user and their current server-side permissions.

---

## Complexity guide

| Complexity | Meaning | Example |
|---|---|---|
| O(1) | Constant work as input grows | `Set.has()`, `Map.get()` |
| O(log n) | Work grows slowly | Binary search |
| O(n) | Work grows proportionally | Array scan, filter |
| O(n log n) | Efficient general sorting | Standard sort |
| O(n²) | Work grows rapidly | Comparing every item with every other item |

Example growth:

```text
10 items      → O(n²) ≈ 100 comparisons
1,000 items   → O(n²) ≈ 1,000,000 comparisons
10,000 items  → O(n²) ≈ 100,000,000 comparisons
```

Avoid O(n²) work in request paths unless input size is strictly small and enforced.

---

## Validation

### Security

- Validate IDs, filters, sort fields, and pagination values.
- Use allow-lists for requested sort columns and directions.
- Never construct SQL by concatenating user input.
- Use parameterized queries.
- Enforce authorization before querying sensitive data.
- Apply maximum input sizes to prevent memory or CPU exhaustion.
- Do not expose internal IDs or data merely because a lookup succeeds.

A safe API sort policy looks like this:

```text
Allowed fields: createdAt, displayName
Allowed directions: ascending, descending
Anything else: reject with a safe validation error
```

### Performance and scalability

- Measure before optimizing; use real production-like volumes.
- Avoid `array.find()` inside loops over another large array.
- Build a `Map` once if repeated lookups are required.
- Do not sort data unless consumers need sorted results.
- Use pagination with a maximum page size.
- Prefer cursor pagination for large or frequently changing datasets.
- Add and verify database indexes for real query patterns.
- Monitor slow queries, memory use, request latency, and CPU.

### Accessibility

Data structure choices are mostly backend concerns, but sorting and pagination affect interface accessibility:

- Announce the current sort order clearly.
- Keep result ordering stable across pages.
- Provide understandable labels such as “Sort by date, newest first.”
- Do not rely only on visual indicators for sort direction.
- Preserve keyboard focus predictably after loading more results.

### Testing

Test the behavior and limits:

```text
Duplicate role values               → treated as one role
Unknown role                        → rejected or ignored according to policy
Too many supplied roles             → safe failure / empty result
Authorized editor role              → access granted
Viewer-only role                    → access denied
Large input collection              → bounded processing
Requested unsupported sort field    → validation failure
```

---

# 3.5 Clean code and refactoring

## Problem

Code becomes difficult and risky to change when its intent is unclear or responsibilities are mixed.

Common symptoms:

- Names do not explain what values or functions mean.
- One function validates input, performs authorization, queries data, formats output, and sends notifications.
- The same business rule appears in multiple places.
- Tests are hard to write because code depends directly on databases, time, or network calls.
- A small change causes unrelated regressions.
- Teams stop improving code because changes feel unsafe.

```text
New requirement
      │
      ▼
Unclear, tightly coupled code
      │
      ▼
Slow changes, defects, and growing technical debt
```

**Technical debt** is the future cost created by a shortcut today. It is not automatically bad; it becomes harmful when it is undocumented, unmeasured, or never repaid.

---

## Solution 1 — Clear naming and small, focused functions

Name code for the domain and its intent. Keep each function focused on one meaningful responsibility.

```text
Unclear: process(data)
Clear:   calculateInvoiceTotal(invoice)
```

### Pros

- Reduces the need for comments that merely explain what code does.
- Makes reviews faster and defects easier to spot.
- Improves editor navigation and search.
- Produces smaller units that are easier to test.

### Cons

- “Small” does not always mean “good”; splitting coherent logic into too many tiny functions can hide the overall flow.
- Renaming public APIs may be a breaking change.
- Good naming requires understanding the domain.

### Remaining limitation

Clear functions help readers, but duplication and tightly coupled dependencies can still make behavior difficult to change safely.

---

## Solution 2 — Remove duplication and separate responsibilities

Keep a business rule in one authoritative location. Separate pure domain logic from side effects such as databases, HTTP calls, logging, and notifications.

```text
HTTP handler
    │
    ├── validate request
    ├── authorize caller
    └── call domain service
              │
              ├── calculate result (pure logic)
              └── use repository / notifier interfaces
```

### Pros

- Changes to a business rule happen in one place.
- Pure logic is easy and fast to test.
- External dependencies can be substituted in tests.
- Failures and security checks are easier to reason about.

### Cons

- Introducing interfaces and layers too early can add unnecessary abstraction.
- Separating every operation into a service, repository, factory, and adapter can make small applications harder to navigate.
- Dependency boundaries need clear ownership.

### Remaining limitation

Better structure lowers change risk, but improvements can still introduce regressions if refactoring changes behavior without adequate tests.

---

## Solution 3 — Refactor in small, behavior-preserving steps

Refactoring changes internal structure **without changing externally observable behavior**.

Use a safe cycle:

```text
1. Characterize existing behavior
          │
          ▼
2. Add or confirm tests
          │
          ▼
3. Make one small structural change
          │
          ▼
4. Run checks
          │
          ▼
5. Review and merge
```

Examples of low-risk refactorings:

- Rename a misleading variable or function.
- Extract a cohesive function.
- Replace repeated logic with one helper.
- Replace conditional branching with a lookup table when it improves clarity.
- Move a domain rule closer to the data it governs.
- Replace implicit values with named constants.

### Pros

- Keeps changes reviewable.
- Makes failures easier to locate and revert.
- Reduces technical debt continuously.
- Prevents large, risky “rewrite” projects.

### Cons

- Requires time for tests and review.
- Existing code may need characterization tests before it can be changed safely.
- Refactoring does not add user-visible functionality by itself.

### Remaining limitation

Refactoring safely relies on automated checks and a team agreement on standards.

---

## Code smells

A **code smell** is a sign that code may be harder to maintain. It is not proof that code is wrong.

| Smell | Typical risk | First improvement |
|---|---|---|
| Long function | Mixed responsibilities | Extract cohesive steps |
| Duplicate logic | Rules diverge over time | Create one shared implementation |
| Long parameter list | Unclear input contract | Group related values into a typed object |
| Boolean flag parameter | Function has multiple jobs | Split into named functions |
| Deep nesting | Hard-to-follow control flow | Use early returns or extract logic |
| Unclear names | Incorrect assumptions | Rename for domain intent |
| Large `switch` repeated in many places | Missed cases | Centralize behavior |
| Direct dependency on time/network/database | Difficult tests | Inject an interface or value |
| `any` used to silence errors | Runtime type failures | Validate as `unknown`, then narrow |

Do not “fix” a smell mechanically. Improve code only when the result is clearer and safer.

---

## Decision guide

| Situation | Choose |
|---|---|
| A name needs a comment to explain it | Rename it |
| A function has unrelated steps | Extract cohesive functions |
| A business rule appears in more than one place | Centralize it |
| Logic has no I/O or external dependencies | Keep it as a pure function |
| Behavior is unclear or untested | Add characterization tests first |
| A risky or large rewrite is proposed | Prefer incremental refactoring |
| An abstraction is used once and does not simplify testing or change | Keep the direct implementation |
| A public contract must change | Plan a versioned migration or compatibility period |

**Recommended default:** optimize for readable domain names, focused functions, and small refactorings protected by tests. Add abstractions only when they reduce real duplication, isolate external dependencies, or make required changes safer.

---

## Practical TypeScript example — extract pure pricing logic

### Before

This handler mixes request validation, discount calculation, and response construction. The discount rule is difficult to test without exercising the entire handler.

```typescript name=checkout-before.ts
type CheckoutRequest = {
  subtotal: number;
  customerType: string;
};

export function createCheckoutResponse(request: CheckoutRequest) {
  if (!Number.isFinite(request.subtotal) || request.subtotal < 0) {
    return { status: 400, body: { message: "Invalid subtotal." } };
  }

  let total = request.subtotal;

  if (request.customerType === "member") {
    total = total * 0.9;
  } else if (request.customerType === "staff") {
    total = total * 0.8;
  }

  return {
    status: 200,
    body: {
      subtotal: request.subtotal,
      total,
    },
  };
}
```

### After

The pricing rule becomes a pure, typed function. The handler retains responsibility for request-level concerns.

```typescript name=checkout-after.ts
type CustomerType = "guest" | "member" | "staff";

type CheckoutRequest = {
  subtotal: number;
  customerType: CustomerType;
};

const discountRateByCustomerType: Readonly<Record<CustomerType, number>> = {
  guest: 0,
  member: 0.1,
  staff: 0.2,
};

export function calculateTotal(
  subtotal: number,
  customerType: CustomerType,
): number {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new RangeError("Subtotal must be a non-negative finite number.");
  }

  const discountRate = discountRateByCustomerType[customerType];

  return subtotal * (1 - discountRate);
}

export function createCheckoutResponse(request: CheckoutRequest) {
  try {
    const total = calculateTotal(request.subtotal, request.customerType);

    return {
      status: 200,
      body: {
        subtotal: request.subtotal,
        total,
      },
    };
  } catch (error) {
    if (error instanceof RangeError) {
      return { status: 400, body: { message: "Invalid subtotal." } };
    }

    throw error;
  }
}
```

### What improved

```text
Before:
HTTP concerns + validation + domain pricing rule in one function

After:
Handler        → request-facing error response
calculateTotal → isolated domain pricing rule
```

- `calculateTotal` can be tested without HTTP, database, or framework setup.
- Customer types are explicit rather than arbitrary strings.
- Discount rates have one source of truth.
- Invalid subtotal values are rejected instead of producing invalid totals.

### What did not change

The observable successful response still contains `subtotal` and `total`. That preserves behavior while making the code easier to extend.

---

## Validation

### Testing

Refactoring is safe only when behavior is verified.

For the example, test:

```text
Guest subtotal                    → no discount
Member subtotal                   → 10% discount
Staff subtotal                    → 20% discount
Zero subtotal                     → zero total
Negative subtotal                 → rejected
NaN or Infinity                  → rejected
Every customer type               → has an explicit discount rule
```

Also verify request-level behavior separately:

```text
Invalid request value             → safe 400 response
Unexpected implementation failure → not incorrectly treated as client error
```

### Security

- Keep validation and authorization explicit; do not hide security decisions inside generic helper functions.
- Never duplicate authorization logic across handlers—centralize policy enforcement where practical.
- Treat raw request data as `unknown` and validate it at the boundary.
- Do not refactor by replacing safe checks with type assertions or `any`.
- Avoid logging passwords, tokens, personal data, or complete request bodies.
- Review refactors for accidental authorization bypasses, changed error behavior, and changed validation order.

### Performance and scalability

- Prefer clarity first; measure before optimizing.
- Avoid premature caching, generic frameworks, or abstractions without a demonstrated bottleneck.
- Keep pure computation separate from I/O so expensive work can be measured and optimized independently.
- Avoid repeated parsing, sorting, or database access inside loops.
- Profile production-like workloads before claiming a refactoring improves performance.

### Accessibility

For frontend code, refactoring must preserve accessible behavior:

- Keep semantic elements and accessible names unchanged unless intentionally improving them.
- Preserve keyboard interaction, focus management, and error announcements.
- Test with keyboard-only use and a screen reader when changing components or form flows.
- Treat accessibility regressions as behavior changes, not cosmetic differences.

### Operational considerations

- Keep refactoring PRs separate from feature changes where possible.
- Make one coherent improvement per PR.
- Ensure linting, type checking, tests, and security scans pass.
- Use clear PR descriptions: state what structure changed, what behavior should remain unchanged, and what tests prove it.
- Revert rather than rewrite shared history if a refactor causes a production regression.

---

# 3.6 Secure coding

## Problem

Applications become vulnerable when they trust input, assume users are authorized, expose sensitive data, or use unsafe dependencies.

Common failures:

- Attackers submit unexpected request data.
- SQL, command, path, or URL injection becomes possible.
- Users access data or actions they do not own.
- Secrets are committed or logged.
- Vulnerable dependencies reach production.
- Error messages expose internal implementation details.
- Security controls are added inconsistently across endpoints.

```text
Untrusted input
      │
      ▼
No validation or authorization
      │
      ▼
Injection, data exposure, account abuse, or service disruption
```

Secure coding means treating every external input and every permission decision as untrusted until verified.

---

## Solution 1 — Validate and constrain input

Validate data at application boundaries before using it.

Important boundaries include:

- HTTP request bodies, routes, query strings, and headers.
- Uploaded file names and content.
- Environment variables.
- Webhook and queue messages.
- Database values from legacy or external systems.
- URLs passed to server-side requests.

```text
External data
    │
    ▼
Validate type, shape, length, format, and allowed values
    │
    ▼
Trusted application data
```

### Pros

- Prevents malformed data reaching business logic.
- Reduces injection and resource-exhaustion risks.
- Produces clear, user-safe validation errors.
- Makes downstream code simpler.

### Cons

- Validation rules require maintenance.
- Validation alone cannot determine whether a valid request is permitted.
- Overly strict validation can reject legitimate international input.

### Remaining limitation

Valid input can still request an unauthorized action. A user may submit a valid `documentId` that belongs to someone else.

---

## Solution 2 — Authenticate and authorize every protected action

**Authentication** answers: “Who is making this request?”  
**Authorization** answers: “May this authenticated user perform this action on this resource?”

Apply deny-by-default authorization on the server. Never rely on hidden UI controls, client-side role checks, or IDs that users submit.

```text
Request
  │
  ├── Authenticate identity
  │
  ├── Load trusted server-side permissions/resource ownership
  │
  └── Allow only explicitly permitted action
```

### Pros

- Prevents horizontal privilege escalation—accessing another user’s data.
- Prevents vertical privilege escalation—gaining administrator capabilities.
- Supports least privilege.
- Creates a consistent policy boundary.

### Cons

- Requires a clear permission model.
- Resource-level authorization can add database lookups.
- Permission rules must be tested as carefully as business rules.

### Remaining limitation

Correct authorization does not protect against unsafe database queries, unsafe URLs, vulnerable packages, or leaked secrets.

---

## Solution 3 — Use safe APIs and secure defaults

Prefer APIs that make dangerous behavior harder:

| Risk | Unsafe approach | Safer approach |
|---|---|---|
| SQL injection | SQL string concatenation | Parameterized queries / ORM parameters |
| XSS | `innerHTML` with untrusted content | Framework escaping / `textContent` |
| Command injection | Shell command with input | Avoid shell; use safe process APIs with fixed arguments |
| Path traversal | Concatenate user-provided paths | Allow-list IDs; resolve and verify paths |
| SSRF | Fetch arbitrary user URL | Strict allow-list for protocol, host, port, and path |
| Secret leakage | Hardcoded values or logs | Environment/secrets manager; redacted logs |
| Weak passwords | Custom hashing | Argon2id or bcrypt through a maintained library |

### Pros

- Removes entire classes of common mistakes.
- Reduces security review burden.
- Makes secure behavior the default.
- Usually improves reliability and readability.

### Cons

- Some safe APIs impose restrictions or require configuration.
- Security controls can add development and operational work.
- Incorrect configuration can weaken otherwise secure libraries.

### Remaining limitation

Secure application code can still be compromised by vulnerable dependencies or insecure deployment configuration.

---

## Solution 4 — Manage dependencies and verify continuously

Dependencies are production code. Track, update, and scan them continuously.

```text
Source code + dependencies
           │
           ▼
Type checks, tests, SAST, secret scanning, dependency scanning
           │
           ▼
Protected build artifact
           │
           ▼
Deploy with monitored runtime controls
```

### Pros

- Detects known vulnerable packages and leaked secrets.
- Catches insecure patterns before deployment.
- Supports repeatable, auditable releases.
- Reduces the time vulnerabilities remain exposed.

### Cons

- Scanners can produce false positives.
- Dependency upgrades may require compatibility testing.
- Tooling does not replace human review or threat modeling.

### Remaining limitation

Automated scanning identifies known patterns and vulnerabilities; it cannot fully understand business logic, authorization rules, or every deployment risk.

---

## Decision guide

| Need | Choose |
|---|---|
| Receive any external value | Runtime validation with allow-lists and size limits |
| Protect an API endpoint or sensitive action | Authentication plus server-side authorization |
| Query a database | Parameterized query or ORM parameter binding |
| Render user-controlled text | Escaped framework output or `textContent` |
| Fetch a user-supplied URL server-side | Strict URL allow-list validation |
| Store passwords | Argon2id or bcrypt via a maintained library |
| Store credentials or API keys | Secret manager or protected environment configuration |
| Add/update a package | Lockfile, review, vulnerability scan, compatibility tests |
| Handle unexpected server failure | Structured, redacted log and generic client error |

**Recommended default:** validate at boundaries, authorize every protected operation server-side, use parameterized and context-safe APIs, keep secrets outside source control, and run security checks in CI.

---

## Practical TypeScript example — validate an outbound URL to prevent SSRF

Server-side request forgery (SSRF) occurs when an attacker makes your server request internal or unintended services, such as cloud metadata endpoints or private network systems.

This example allows only HTTPS requests to a small set of known hosts and paths.

```typescript name=allowed-webhook-url.ts
const allowedWebhookHosts = new Set([
  "api.example-payments.com",
  "hooks.example-notifications.com",
]);

const allowedPorts = new Set(["", "443"]);

const allowedPathPrefixes = ["/v1/events/", "/webhooks/"];

export function parseAllowedWebhookUrl(value: unknown): URL {
  if (typeof value !== "string" || value.length > 2_048) {
    throw new Error("Webhook URL must be a non-empty URL under 2048 characters.");
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Webhook URL is invalid.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Webhook URL must use HTTPS.");
  }

  if (!allowedWebhookHosts.has(url.hostname)) {
    throw new Error("Webhook host is not allowed.");
  }

  if (!allowedPorts.has(url.port)) {
    throw new Error("Webhook port is not allowed.");
  }

  if (!allowedPathPrefixes.some((prefix) => url.pathname.startsWith(prefix))) {
    throw new Error("Webhook path is not allowed.");
  }

  if (url.username || url.password) {
    throw new Error("Webhook URL must not contain credentials.");
  }

  if (url.hash) {
    throw new Error("Webhook URL must not contain a fragment.");
  }

  return url;
}
```

### Why this is safer

```text
Attacker-controlled URL
        │
        ▼
Protocol allow-list: HTTPS only
        │
        ▼
Host allow-list: known domains only
        │
        ▼
Port and path allow-list
        │
        ▼
Approved outbound destination
```

- Rejects non-HTTPS protocols such as `http:`, `file:`, or unexpected schemes.
- Rejects private or unapproved hosts by allowing only explicit hostnames.
- Rejects non-standard ports.
- Restricts requests to expected API paths.
- Rejects embedded URL credentials.
- Avoids attempting to identify “safe” hosts through a deny-list, which is easy to bypass.

### Important limitation

For high-risk systems, validate the resolved IP address as well and prevent DNS rebinding. Also configure outbound network controls so the application cannot reach private networks or cloud metadata services, even if application validation fails.

---

## OWASP Top 10—practical focus

| Risk area | Practical mitigation |
|---|---|
| Broken access control | Check authorization server-side for every protected resource/action |
| Cryptographic failures | Use HTTPS, modern libraries, managed keys, and secret rotation |
| Injection | Validate input; parameterize queries; avoid shell interpolation |
| Insecure design | Threat-model sensitive workflows; use deny-by-default policies |
| Security misconfiguration | Disable debug mode; configure security headers; restrict CORS |
| Vulnerable components | Pin versions, scan dependencies, update promptly |
| Authentication failures | Rate-limit login; use secure sessions; regenerate session IDs at login |
| Software/data integrity failures | Verify artifacts; protect CI; validate webhooks and signatures |
| Logging/monitoring failures | Log security events safely; alert on suspicious activity |
| SSRF | Strict outbound URL allow-lists and egress network controls |

---

## Validation

### Security

- Treat all request data as `unknown` until validated.
- Prefer allow-lists over deny-lists for values, file types, paths, hosts, ports, and actions.
- Use maximum lengths, request-body limits, pagination limits, and rate limits to prevent resource exhaustion.
- Use parameterized database queries—never concatenate user data into SQL.
- Verify authorization against trusted server-side data for every sensitive resource.
- Set session cookies as `HttpOnly`, `Secure`, and `SameSite=Strict` where compatible with the required flow.
- Generate a new session identifier after login.
- Use generic external error messages; preserve detailed diagnostics only in protected logs.
- Never log credentials, access tokens, raw passwords, full payment data, or sensitive personal data.
- Store secrets in environment-specific secret management, not source code or `.env` files committed to Git.
- Use HTTPS for all production network traffic.

### Dependency and supply-chain security

- Commit and enforce the package lockfile.
- Review new dependencies for maintenance, licensing, scope, and necessity.
- Run dependency vulnerability scanning in CI.
- Run secret scanning and static application security testing (SAST).
- Update vulnerable dependencies promptly and test the upgrade.
- Restrict CI credentials to least privilege and protect deployment environments.

### Testing

Test security controls explicitly:

```text
Malformed or oversized input              → rejected safely
Unexpected object fields                  → rejected or ignored by documented policy
Unauthenticated protected request         → denied
Authenticated wrong-owner request         → denied
Authenticated authorized request           → allowed
SQL/meta-character input                  → treated as data, not executable code
Disallowed outbound URL                   → rejected
Allowed HTTPS outbound URL                → accepted
Unexpected internal failure               → generic response, redacted log
```

### Performance and scalability

- Validate cheaply before expensive database or network operations.
- Rate-limit sensitive endpoints such as login, password reset, registration, and webhook ingestion.
- Bound concurrent outbound calls and apply timeouts.
- Avoid logging excessively under attack; rate-limit or sample repetitive errors.
- Monitor authentication failures, authorization denials, request size rejections, dependency alerts, and unusual outbound requests.

### Accessibility

Security controls must remain usable:

- Give clear, non-sensitive form validation messages.
- Associate errors with form fields programmatically.
- Do not rely only on color, CAPTCHA puzzles, or time pressure.
- Ensure multi-factor authentication and account-recovery flows work with keyboards and assistive technology.
- Balance account-lockout protections with safe recovery mechanisms to avoid enabling denial-of-service against legitimate users.

---

# 3.7 Backend implementation

## Problem

A backend fails when it treats requests as simple data passing rather than a controlled boundary between clients, business rules, and persistent systems.

Common failures:

- Request data reaches the database without validation.
- Users can access or modify records they do not own.
- Business rules are duplicated across routes.
- Database queries are slow, unbounded, or vulnerable to injection.
- Long-running work blocks requests and causes timeouts.
- Failures cannot be diagnosed because logs lack context.
- Retries create duplicate payments, emails, or records.

```text
Client request
     │
     ▼
Route directly accesses database
     │
     ▼
Mixed validation, authorization, business rules, and persistence
     │
     ▼
Security gaps, brittle changes, slow requests
```

---

## Solution 1 — Route handlers directly access persistence

For a very small prototype, a route handler might validate a request and query the database directly.

```text
HTTP route
   │
   ├── validate input
   ├── query database
   └── return response
```

### Pros

- Minimal code.
- Easy to understand for one small endpoint.
- Fast to prototype.

### Cons

- Routes become large as requirements grow.
- Business rules are duplicated across endpoints.
- Authorization can be missed or inconsistently applied.
- Database details leak into transport code.
- Testing requires database setup or extensive mocking.

### Remaining limitation

This approach does not scale well when multiple clients, workflows, or business rules use the same data.

---

## Solution 2 — Separate transport, domain, and persistence responsibilities

Use a layered structure with clear responsibilities.

```text
HTTP request
   │
   ▼
Controller / route
   ├── Parse and validate input
   ├── Authenticate caller
   └── Map result to HTTP response
   │
   ▼
Service / domain logic
   ├── Apply business rules
   ├── Authorize action on resource
   └── Coordinate work
   │
   ▼
Repository / persistence
   ├── Parameterized database access
   └── Return domain data
```

### Pros

- Business rules have a clear home.
- Validation and authorization become easier to review.
- Persistence can change with less impact on API code.
- Domain logic can be tested without HTTP infrastructure.
- Supports multiple interfaces, such as HTTP APIs, jobs, and event consumers.

### Cons

- More files and interfaces.
- Over-abstraction can make a small service harder to navigate.
- The boundaries must remain practical rather than ceremonial.

### Remaining limitation

Layering clarifies responsibilities, but data must still be modeled and queried efficiently.

---

## Solution 3 — Use persistence deliberately: schema, ORM, and indexes

Persistent data needs explicit schema constraints, safe queries, and indexes that match real access patterns.

```text
Application
   │
   ▼
Repository
   │
   ├── Parameterized query / ORM binding
   ├── Transaction where required
   ├── Index-supported filter and ordering
   └── Bounded result set
   │
   ▼
Database
```

### ORM options

An ORM maps application objects to database records. It can improve productivity, but it does not remove database responsibilities.

| Approach | Strengths | Limitations |
|---|---|---|
| Raw parameterized SQL | Precise, transparent, often best for complex queries | More query code to maintain |
| Query builder | Safer composition and database control | Still requires SQL and schema knowledge |
| ORM | Productive CRUD and typed models | Can hide inefficient queries or produce unnecessary data access |

### Pros

- Parameter binding prevents SQL injection.
- Database constraints protect integrity even if application code has a defect.
- Indexes improve filters, joins, and ordered queries.
- Transactions keep related writes consistent.

### Cons

- Indexes consume storage and increase write cost.
- Transactions can reduce throughput if overly broad or long-running.
- ORM-generated queries must still be inspected and measured.

### Remaining limitation

Efficient persistence does not make slow external work suitable for a request/response cycle.

---

## Solution 4 — Move long-running work to background jobs

Queue work that is slow, retriable, or not required before the client receives a response.

Examples:

- Sending email or notifications.
- Generating reports.
- Processing uploaded files.
- Calling non-critical external systems.
- Rebuilding search indexes.
- Importing large datasets.

```text
API request
   │
   ├── Validate + authorize
   ├── Save required state
   ├── Enqueue durable job
   └── Return accepted response
                │
                ▼
            Worker process
                │
                ├── Process job
                ├── Retry safely if transient failure
                └── Record outcome
```

### Pros

- Keeps API response times predictable.
- Supports retries and independent scaling of workers.
- Protects request handlers from long-running tasks.
- Improves resilience when external services are temporarily unavailable.

### Cons

- Eventual consistency: work may complete after the API response.
- Requires reliable queue infrastructure and monitoring.
- Jobs must be idempotent to tolerate retries.
- Failures need dead-letter handling and operational runbooks.

### Remaining limitation

Background jobs improve throughput and reliability, but the system still needs observability, health checks, and reliable configuration.

---

## Decision guide

| Need | Choose |
|---|---|
| Small, low-risk prototype endpoint | Route plus minimal repository logic |
| Shared business rules or several API endpoints | Controller → service → repository separation |
| Simple typed CRUD operations | ORM or query builder, with query review |
| Complex reporting or performance-critical query | Parameterized SQL or a query builder |
| Filter/order persistent data | Database index plus bounded pagination |
| Multiple related writes that must succeed together | Short database transaction |
| Work that takes seconds or relies on external services | Durable background job |
| Client needs immediate final result | Synchronous request only if fast and dependable |

**Recommended default:** validate and authenticate in the route layer; enforce business rules and resource authorization in a service; isolate parameterized persistence in a repository; run non-essential or long-running work in durable background jobs.

---

## Practical TypeScript example — ownership authorization and safe persistence boundary

This example shows an application service that validates an identifier, checks whether the authenticated user owns the resource, and deletes it only when explicitly authorized.

```typescript name=delete-project.ts
type UserId = string;
type ProjectId = string;

type AuthenticatedUser = {
  id: UserId;
};

type Project = {
  id: ProjectId;
  ownerId: UserId;
};

interface ProjectRepository {
  findById(projectId: ProjectId): Promise<Project | null>;
  deleteById(projectId: ProjectId): Promise<void>;
}

type DeleteProjectResult =
  | { ok: true }
  | { ok: false; status: 400 | 404 | 403; message: string };

function parseProjectId(value: unknown): ProjectId | null {
  if (typeof value !== "string") {
    return null;
  }

  const projectId = value.trim();

  // Example format only. Use the identifier format adopted by the application.
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(projectId)) {
    return null;
  }

  return projectId;
}

export async function deleteProject(
  user: AuthenticatedUser,
  untrustedProjectId: unknown,
  projects: ProjectRepository,
): Promise<DeleteProjectResult> {
  const projectId = parseProjectId(untrustedProjectId);

  if (!projectId) {
    return {
      ok: false,
      status: 400,
      message: "The project identifier is invalid.",
    };
  }

  const project = await projects.findById(projectId);

  // Returning 404 for both missing and non-owned resources can reduce
  // resource-enumeration risk in many applications.
  if (!project || project.ownerId !== user.id) {
    return {
      ok: false,
      status: 404,
      message: "Project not found.",
    };
  }

  await projects.deleteById(project.id);

  return { ok: true };
}
```

### Why this is safer

```text
Untrusted project ID
       │
       ▼
Validate expected format
       │
       ▼
Load project from trusted persistence
       │
       ▼
Check authenticated user owns project
       │
       ▼
Perform deletion
```

- The project ID is validated before persistence access.
- The user identity comes from authentication middleware, not the request body.
- Ownership is verified against trusted server-side data.
- The response does not reveal whether a non-owned project exists.
- The repository interface keeps database-specific code separate.

### Important persistence requirement

The repository implementation must use parameterized queries or ORM parameter binding. It must **not** build a query by concatenating `projectId`.

For high-value actions, also consider:

- Audit logging of the deletion without storing sensitive request data.
- Soft deletion or a retention period where recovery is required.
- Optimistic concurrency checks if multiple users or systems can modify the record.
- A transaction when deletion includes related records or audit events.

---

## Validation

### Security

- Authenticate every protected request before performing resource operations.
- Enforce authorization on the server for every action and resource.
- Use deny-by-default policies; grant only explicit permissions.
- Validate every external value, including route parameters and queue messages.
- Use parameterized queries or ORM bindings; never concatenate SQL.
- Enforce database constraints: primary keys, foreign keys, uniqueness, non-null values, and appropriate checks.
- Store passwords only as Argon2id or bcrypt hashes.
- Use HTTPS and secure session/token handling.
- Apply rate limits to sensitive endpoints.
- Do not expose stack traces, query details, or resource existence to unauthorized callers.
- Log security-relevant events with request and actor IDs, while redacting secrets and personal data.

### Reliability and scalability

- Set request, database, and outbound-call timeouts.
- Keep transactions short and bounded.
- Use pagination with a maximum page size; avoid fetching unbounded result sets.
- Add indexes based on measured query patterns.
- Use connection pooling and size it for application instances and database capacity.
- Make background jobs idempotent; use stable job or operation identifiers.
- Configure retry limits, exponential backoff, and a dead-letter path.
- Use an outbox pattern when a database update and emitted event must remain consistent.

### Testing

Test each boundary separately:

```text
Malformed project ID                  → 400 response
Unauthenticated request               → rejected before service call
Authenticated owner                   → project deleted
Authenticated non-owner               → 404 / denied
Missing project                       → 404 response
Repository/database failure           → generic 500 at HTTP boundary
Duplicate background-job delivery     → no duplicate external effect
Transaction failure                   → no partial persisted state
```

### Accessibility

Backend APIs support accessible interfaces when they provide predictable error contracts:

- Return stable, field-specific validation error structures.
- Use clear, non-sensitive messages.
- Avoid returning only error codes that require users to infer the problem.
- Preserve consistent status codes so frontend clients can communicate errors through accessible form patterns.

### Operational considerations

- Provide health endpoints that distinguish liveness from readiness.
- Include a correlation/request ID in logs, traces, and error responses where appropriate.
- Monitor latency, error rate, database pool usage, queue depth, job failures, retry counts, and dead-letter volume.
- Document data migrations, rollback procedures, backup retention, and restoration tests.
- Use separate credentials per environment with least-privilege database permissions.

---

# 3.8 Frontend implementation

## Problem

Frontend applications become unreliable when UI state, server data, validation, accessibility, and performance are handled inconsistently.

Common failures:

- Components become large and mix rendering, data loading, validation, and business rules.
- UI state becomes stale after server updates.
- Forms allow invalid submissions or show unclear errors.
- Keyboard and screen-reader users cannot complete key tasks.
- Large bundles and unnecessary renders slow the interface.
- Client-side checks are treated as security controls.

```text
User action
   │
   ▼
Large component with mixed responsibilities
   │
   ├── UI rendering
   ├── data fetching
   ├── validation
   ├── loading state
   └── error handling
   │
   ▼
Hard-to-test, inaccessible, slow UI
```

Client-side validation improves user experience, but the backend must still validate and authorize every request.

---

## Solution 1 — Component-based UI

Build the interface from focused, reusable components. Each component should have a clear responsibility and predictable inputs.

```text
Page
 ├── ProjectList
 │    └── ProjectListItem
 ├── CreateProjectForm
 └── ErrorMessage
```

### Pros

- Breaks a page into understandable units.
- Encourages reuse of consistent UI behavior.
- Makes component-level testing easier.
- Limits the impact of visual changes.

### Cons

- Too many tiny components can obscure the user flow.
- Reusable components can become overly generic and difficult to use.
- Component boundaries alone do not manage shared state or data fetching.

### Remaining limitation

Focused components still need a clear model for where state belongs and how server data is updated.

---

## Solution 2 — Keep state close to where it is used

Use local component state for UI-only concerns:

- Open or closed dialog.
- Current input value.
- Selected tab.
- Local loading indicator.
- Temporary inline error.

```text
Component state
  ├── Is the modal open?
  ├── What is in this text field?
  └── Which tab is selected?
```

Move state upward only when multiple sibling components need to coordinate.

### Pros

- Reduces unnecessary global state.
- Makes ownership clear.
- Limits re-renders to relevant parts of the UI.
- Simplifies testing and debugging.

### Cons

- State lifted too far up makes parent components complex.
- Deeply passed props can become hard to maintain.
- Local state is not suitable as the source of truth for shared server data.

### Remaining limitation

Server-provided data has different needs: caching, loading status, retries, invalidation, and synchronization after mutations.

---

## Solution 3 — Treat server data separately from UI state

Server data is data owned by the backend. Fetch it through a dedicated data-access layer and refresh or invalidate it after a successful mutation.

```text
UI state                     Server state
────────                     ────────────
Dialog open                  Projects from API
Focused field                Current account
Expanded section             Permissions
Draft text                   Paginated search results
```

```text
User submits form
      │
      ▼
Validate client-side
      │
      ▼
Send authenticated request
      │
      ▼
Backend validates + authorizes + saves
      │
      ▼
Refresh / invalidate server data in UI
```

### Pros

- Avoids treating stale client memory as authoritative.
- Makes loading, error, retry, and empty states explicit.
- Supports caching and request deduplication.
- Keeps data-fetching behavior consistent.

### Cons

- Adds a data-fetching convention or library.
- Cache invalidation requires deliberate design.
- Optimistic updates require rollback handling when requests fail.

### Remaining limitation

Correct state management does not make an interface accessible or protect it from slow rendering and large assets.

---

## Solution 4 — Build accessible, performant UI by default

Accessibility and performance are implementation requirements, not final polish.

Use:

- Semantic HTML before custom roles.
- Native buttons and inputs where possible.
- Visible keyboard focus.
- Clear labels and error messages.
- Programmatic associations between inputs and errors.
- Responsive layouts and reduced-motion support.
- Code splitting and image optimization where needed.
- Measured performance improvements, not premature memoization.

```text
Accessible interface
 ├── Keyboard operable
 ├── Screen-reader understandable
 ├── Visible focus
 ├── Clear errors
 └── Touch and responsive support
```

### Pros

- Supports more users and devices.
- Improves usability for everyone.
- Reduces accessibility defects that are costly to fix later.
- Faster interfaces improve conversion, user satisfaction, and device compatibility.

### Cons

- Requires testing beyond visual inspection.
- Complex widgets need careful focus and keyboard design.
- Performance optimization requires measurement and monitoring.

### Remaining limitation

A secure, accessible frontend still depends on backend enforcement, safe deployment configuration, and end-to-end monitoring.

---

## Decision guide

| Need | Choose |
|---|---|
| Reusable visual or interaction unit | Focused component |
| Temporary state used by one component | Local component state |
| State shared by nearby components | Lift state to the closest common parent |
| Application-wide UI preference, such as theme | Narrow shared context/store |
| Data owned by the backend | Dedicated server-data query layer |
| Form input | Local state plus client validation |
| Permission-sensitive action | Backend authorization; optionally hide unavailable UI actions |
| Complex interactive widget | Native element first; custom ARIA pattern only when necessary |
| Slow page or large bundle | Measure first, then split code/assets or reduce rendering work |

**Recommended default:** use focused components, keep UI state local, manage server data separately, use semantic HTML, and enforce all real security decisions on the backend.

---

## Practical TypeScript example — accessible form submission state

This example uses React with TypeScript. It provides client-side validation, communicates errors accessibly, disables repeat submission while a request is active, and treats the server as authoritative.

```tsx name=CreateProjectForm.tsx
import { FormEvent, useId, useState } from "react";

type CreateProjectResponse =
  | { ok: true; projectId: string }
  | { ok: false; message: string };

type FormErrors = {
  name?: string;
  form?: string;
};

function validateProjectName(value: string): string | undefined {
  const name = value.trim();

  if (name.length === 0) {
    return "Enter a project name.";
  }

  if (name.length > 100) {
    return "Project names must be 100 characters or fewer.";
  }

  return undefined;
}

async function createProject(name: string): Promise<CreateProjectResponse> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    return {
      ok: false,
      message: "Unable to create the project. Please try again.",
    };
  }

  return (await response.json()) as CreateProjectResponse;
}

export function CreateProjectForm() {
  const nameInputId = useId();
  const nameErrorId = useId();
  const formErrorId = useId();

  const [name, setName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nameError = validateProjectName(name);

    if (nameError) {
      setErrors({ name: nameError });
      setSuccessMessage(null);
      return;
    }

    setErrors({});
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await createProject(name.trim());

      if (!result.ok) {
        setErrors({ form: result.message });
        return;
      }

      setName("");
      setSuccessMessage("Project created successfully.");
    } catch {
      setErrors({
        form: "Unable to create the project. Check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor={nameInputId}>Project name</label>
        <input
          id={nameInputId}
          name="name"
          type="text"
          value={name}
          maxLength={100}
          required
          aria-describedby={errors.name ? nameErrorId : undefined}
          aria-invalid={errors.name ? "true" : undefined}
          onChange={(event) => setName(event.target.value)}
        />

        {errors.name ? (
          <p id={nameErrorId} role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p id={formErrorId} role="alert">
          {errors.form}
        </p>
      ) : null}

      {successMessage ? <p role="status">{successMessage}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating project…" : "Create project"}
      </button>
    </form>
  );
}
```

### Why this is effective

```text
User submits form
       │
       ▼
Client validates basic input
       │
       ├── Invalid → clear associated error message
       │
       ▼
Valid → submit once while pending
       │
       ▼
Backend validates + authorizes again
       │
       ▼
UI presents safe success or error state
```

- Uses a native `<form>`, `<label>`, `<input>`, and `<button>`.
- Connects the invalid field to its error using `aria-describedby`.
- Uses `aria-invalid` only when an error exists.
- Announces errors and successful completion through live-region roles.
- Prevents accidental duplicate submission while a request is in flight.
- Enforces client-side size limits for usability, while requiring the backend to enforce them again.
- Uses same-origin credentials; the server must still implement authentication, authorization, CSRF protections appropriate to its session model, and request validation.

### Important limitation

The type assertion for `response.json()` does not validate the response at runtime. For production systems, validate responses from external or independently deployed APIs before relying on them, especially when API compatibility is not guaranteed.

---

## Validation

### Security

- Treat all browser-controlled values as untrusted, including hidden fields, route parameters, local storage, and client state.
- Enforce authorization and validation on the backend for every protected operation.
- Never store long-lived secrets, private keys, or privileged API credentials in frontend code.
- Avoid rendering untrusted HTML. Prefer framework-escaped output and `textContent`; sanitize only when HTML rendering is genuinely required.
- Use HTTPS, a restrictive Content Security Policy, and appropriate security headers.
- Protect cookie-based state-changing requests against CSRF using an approach appropriate to the application architecture.
- Avoid exposing sensitive data in URLs, browser storage, analytics events, error reports, or console logs.

### Accessibility

Test every user flow with:

```text
Keyboard only                       → complete every action
Visible focus                       → always clear where focus is
Screen reader                       → controls have meaningful names
Form error                          → associated with the relevant field
Dynamic update                      → announced without unexpected disruption
Zoom / reflow                       → usable at 200% and narrow screens
Reduced motion                      → no essential information only in animation
Color independence                  → meaning not conveyed by color alone
```

Prefer native controls. Custom controls must implement the correct keyboard behavior, focus handling, semantics, and accessible names.

### Performance and scalability

- Measure Web Vitals and real-user performance before optimizing.
- Avoid fetching data that is not needed for the current screen.
- Paginate or virtualize very large lists.
- Split large routes or optional features into separate bundles.
- Optimize images with correct dimensions, modern formats, and lazy loading where appropriate.
- Avoid unnecessary state updates and expensive work during rendering.
- Debounce user-triggered searches, but do not delay essential typing feedback.
- Cancel obsolete network requests when a newer search or navigation supersedes them.
- Cache server data with a clear freshness and invalidation strategy.

### Testing

Test components and user workflows:

```text
Required field empty                → error is visible and announced
Invalid long name                   → submission is blocked
Valid submission                    → request is sent once
Pending request                     → submit control is disabled
Server validation failure           → safe form-level error
Success response                    → success state is announced
Keyboard navigation                 → label, field, and button usable
Backend authorization denial        → UI handles denial without exposing data
```

### Operational considerations

- Capture frontend errors with privacy-aware monitoring; redact personal and authentication data.
- Include release version and correlation IDs where available.
- Track API error rates, client errors, page load performance, and accessibility regressions.
- Use feature flags for staged rollout of risky user-interface changes.
- Test supported browsers and devices, including reduced-capability and slower-network conditions.

---

# 3.9 Logging, observability, and error handling

## Problem

When a production issue occurs without useful logs, metrics, or traces, teams cannot quickly answer:

- What failed?
- Which users or requests were affected?
- Where did the failure occur?
- Is it a code bug, database issue, external dependency, or configuration problem?
- Is the service healthy enough to receive traffic?

Poor observability causes long outages and unsafe troubleshooting practices, such as enabling verbose production errors or logging sensitive request data.

```text
User reports: "The app failed"
          │
          ▼
No request ID, logs, metrics, or trace
          │
          ▼
Slow investigation and guesswork
```

---

## Solution 1 — Application logs

Logs record discrete events, such as request completion, failed database calls, authorization denials, and background-job failures.

```text
Service event
    │
    ▼
Structured log record
    │
    ▼
Central log storage and search
```

### Pros

- Useful for investigating specific events.
- Preserves context around failures.
- Supports audit and security-event analysis.
- Low barrier to adoption.

### Cons

- Unstructured text logs are difficult to search and aggregate.
- Excessive logging increases cost and hides important signals.
- Logs may expose secrets or personal data if fields are not carefully controlled.

### Remaining limitation

Logs explain individual events, but they do not efficiently show aggregate service health, such as latency trends or error rates.

---

## Solution 2 — Structured logging and metrics

Use **structured logs**: consistent JSON-like records with named fields rather than interpolated text.

```text
Unstructured:
"Request failed for user 42"

Structured:
{
  event: "request.completed",
  requestId: "…",
  statusCode: 500,
  durationMs: 245,
  route: "/api/projects"
}
```

Use **metrics** for numeric trends and alerting:

- Request count.
- Error count and rate.
- Request latency.
- Database connection-pool usage.
- Queue depth and job failures.
- Process memory and CPU.
- Event-loop delay.

```text
Logs:    What happened to this request?
Metrics: Is the service becoming unhealthy overall?
```

### Pros

- Makes dashboards, aggregation, and alerts practical.
- Supports capacity planning and performance analysis.
- Reduces time to detect broad incidents.
- Enables consistent querying across services.

### Cons

- Metrics require careful naming and cardinality control.
- Too many labels—such as raw user IDs or request IDs—can make monitoring systems expensive or unusable.
- Dashboards and alerts require maintenance.

### Remaining limitation

Metrics indicate that a request path is slow or failing, but not always the path through multiple services that caused the issue.

---

## Solution 3 — Distributed tracing

A trace follows one operation through multiple components using a shared trace or correlation ID.

```text
Browser/API client
      │ trace: abc123
      ▼
API service
      │
      ├── database query
      ├── payment service call
      └── queue publish
      ▼
Worker processes job
```

Each timed operation is a **span**. Together, spans show where time was spent and where an error occurred.

### Pros

- Shows end-to-end request flow.
- Helps isolate slow dependencies.
- Connects logs, metrics, and individual requests.
- Valuable for distributed systems and asynchronous workflows.

### Cons

- Adds instrumentation and collector infrastructure.
- Trace storage can become expensive.
- Sampling may omit low-frequency events unless error traces are retained.
- Sensitive attributes must be excluded or redacted.

### Remaining limitation

Traces explain operational flow, but they do not tell load balancers whether an instance is ready to receive traffic.

---

## Solution 4 — Health checks and safe error contracts

Use health checks for orchestration, deployments, and monitoring.

```text
Load balancer / orchestrator
          │
          ├── Liveness: is the process running?
          ├── Readiness: can it safely receive traffic?
          └── Dependency checks: are critical dependencies available?
```

Use safe error handling for callers:

```text
Expected validation error → specific safe 4xx response
Unauthorized action       → safe 401/403/404 response
Unexpected internal error → generic 5xx response + protected diagnostics
```

### Pros

- Prevents unhealthy instances from receiving traffic.
- Supports safe rolling deployments and automatic recovery.
- Gives clients predictable error behavior.
- Avoids exposing stack traces or infrastructure details.

### Cons

- Overly strict readiness checks can remove all instances during a dependency outage.
- Dependency checks can overload dependencies if they run too often.
- Generic errors can make client troubleshooting harder without documented error codes.

### Remaining limitation

Observability detects and investigates failures, but it does not prevent them. Teams still need secure coding, tests, capacity management, and incident response practices.

---

## Decision guide

| Need | Choose |
|---|---|
| Investigate a specific failure | Structured logs |
| Alert on rising latency or error rate | Metrics |
| Diagnose a request across services | Distributed tracing |
| Keep unhealthy instances out of traffic | Readiness check |
| Detect a stuck or crashed process | Liveness check |
| Return invalid input feedback | Safe, specific 4xx error |
| Handle an unexpected fault | Generic 5xx response, structured log, trace correlation |
| Audit sensitive action | Minimal, access-controlled audit event |

**Recommended default:** emit structured logs with request IDs, collect a small set of service metrics, return safe error responses, and provide liveness/readiness checks. Add tracing when requests cross service or queue boundaries.

---

## Practical TypeScript example — structured request logging with safe errors

This framework-neutral example wraps an asynchronous request operation. It records safe operational fields and returns a generic internal error to the caller.

```typescript name=request-observability.ts
import { randomUUID } from "node:crypto";

type Logger = {
  info(event: string, fields: Record<string, unknown>): void;
  error(event: string, fields: Record<string, unknown>): void;
};

type HttpResponse = {
  status: number;
  body: Record<string, string>;
  headers: Record<string, string>;
};

function toSafeErrorName(error: unknown): string {
  return error instanceof Error ? error.name : "UnknownError";
}

export async function executeRequest(
  route: string,
  handler: (requestId: string) => Promise<HttpResponse>,
  logger: Logger,
): Promise<HttpResponse> {
  const requestId = randomUUID();
  const startedAt = performance.now();

  try {
    const response = await handler(requestId);
    const durationMs = Math.round(performance.now() - startedAt);

    logger.info("http.request.completed", {
      requestId,
      route,
      statusCode: response.status,
      durationMs,
    });

    return {
      ...response,
      headers: {
        ...response.headers,
        "x-request-id": requestId,
      },
    };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);

    logger.error("http.request.failed", {
      requestId,
      route,
      durationMs,
      errorName: toSafeErrorName(error),
      // Do not log request bodies, credentials, tokens, or raw database errors.
    });

    return {
      status: 500,
      body: {
        message: "An unexpected error occurred. Please try again later.",
      },
      headers: {
        "x-request-id": requestId,
      },
    };
  }
}
```

### Why this is useful

```text
Request
  │
  ├── Generate request ID
  ├── Execute handler
  ├── Record duration + status
  └── Return request ID to caller
             │
             ▼
Caller can supply the ID when reporting a problem.
```

- Logs are structured around an event name and named fields.
- The request ID connects client reports, logs, and traces.
- Duration supports latency analysis.
- The caller receives no internal exception, stack trace, query, or secret.
- Sensitive request data is intentionally excluded.

### Important limitation

Do not log every unique user ID, email address, URL query string, raw route parameter, or request ID as a **metric label**. These values have high cardinality and can significantly increase monitoring cost. They may be appropriate in protected logs if necessary and appropriately redacted, but they should be minimized.

---

## Error handling guide

| Error type | Server behavior | Client response |
|---|---|---|
| Invalid input | Log only if useful for abuse detection; return validation details | `400 Bad Request` with safe field errors |
| Unauthenticated | Record security event if appropriate | `401 Unauthorized` |
| Authenticated but forbidden | Record authorization denial | `403 Forbidden` or `404 Not Found` where resource concealment is required |
| Missing resource | Optional low-severity log | `404 Not Found` |
| Rate limit exceeded | Metric and security signal | `429 Too Many Requests` with retry guidance |
| Dependency timeout | Structured error, metric, trace span | Safe `503` or `504` response |
| Unexpected exception | Error log, trace, alert when threshold exceeded | Generic `500` response |

Avoid using exceptions for normal validation flow where an explicit result is clearer.

---

## Validation

### Security and privacy

- Do not log secrets, passwords, access tokens, session IDs, API keys, authorization headers, or cryptographic material.
- Minimize or redact personal data, especially email addresses, addresses, phone numbers, payment data, and full request bodies.
- Restrict log and trace access through least-privilege roles.
- Encrypt observability data in transit and at rest.
- Set retention periods appropriate to operational and legal requirements.
- Protect log ingestion endpoints against unauthorized writes.
- Ensure error responses never expose stack traces, internal hostnames, SQL statements, filesystem paths, or dependency credentials.
- Record security-relevant events: authentication failures, lockouts, privilege changes, denied access, administrative actions, and configuration changes.

### Metrics and alerts

Start with a small, actionable set:

```text
Request rate
Error rate by route category
Latency percentiles (p50, p95, p99)
Active requests
Database/query latency
Queue depth and failed jobs
Memory, CPU, and event-loop delay
Dependency timeout/error rate
```

Alert on user impact, not every individual error. For example:

```text
Error rate above threshold for a sustained period
p95 latency exceeds service objective
Readiness failures across multiple instances
Queue depth grows continuously
Authentication failure spike
```

### Reliability and scalability

- Use asynchronous, bounded log transport where available; logging must not block request handling.
- Apply sampling to high-volume successful traces while retaining errors and slow requests.
- Set timeouts for external calls and record timeout outcomes separately.
- Avoid health checks that make expensive database queries on every probe.
- Make readiness checks reflect whether the instance can handle normal traffic.
- Monitor queue retries and dead-letter messages; unresolved retries can silently create backlog.

### Accessibility

Operational errors influence frontend accessibility:

- Return stable error codes and clear, safe messages so the frontend can announce failures correctly.
- Preserve correlation IDs in error responses for accessible support workflows; do not require users to copy inaccessible visual-only diagnostics.
- Do not expose technical internals to users merely to aid debugging.

### Testing

Test operational behavior, not only business outcomes:

```text
Successful request                  → completion log with request ID and duration
Validation failure                  → safe 4xx response; no sensitive data logged
Unexpected handler failure          → generic 500 + structured error log
Dependency timeout                  → bounded request duration and observable timeout
Liveness endpoint                   → succeeds when process is running
Readiness endpoint                  → fails safely when critical startup dependency is unavailable
High log volume                     → does not significantly block request processing
Trace propagation                   → same trace context reaches downstream service
```

---

# 3.10 Configuration and secrets

## Problem

Applications become insecure and unreliable when configuration is hardcoded, environments drift, or secrets are stored in source control.

Common failures:

- Database URLs, API keys, or credentials are committed to Git.
- Development, test, staging, and production use different undocumented settings.
- A deployment accidentally uses development endpoints or debug mode.
- Feature behavior changes without an audit trail.
- Secrets appear in logs, error messages, or build artifacts.
- Configuration is loaded late, so failures happen under user traffic.

```text
Hardcoded configuration
       │
       ▼
Different values in code, deployment scripts, and local machines
       │
       ▼
Secret exposure, deployment mistakes, and inconsistent behavior
```

Configuration is non-secret operational behavior—such as a port, enabled integration, or log level.  
A secret is sensitive information—such as a password, signing key, token, or database credential.

---

## Solution 1 — Hardcoded configuration

A small prototype might place configuration directly in source code.

```text
Application code
  ├── API base URL
  ├── feature enabled flag
  └── database credentials
```

### Pros

- Fast for a throwaway experiment.
- No deployment configuration required.

### Cons

- Requires a code change and redeployment for every environment difference.
- Easily exposes secrets in source control and code review.
- Makes environment-specific behavior difficult to audit.
- Encourages unsafe copying between projects.
- Cannot safely support different credentials per environment.

### Remaining limitation

Hardcoding creates operational and security risk. Configuration must be separated from application code.

---

## Solution 2 — Environment variables with startup validation

Pass configuration through environment variables and validate it when the application starts.

```text
Deployment environment
       │
       ▼
Environment variables
       │
       ▼
Startup validation
       │
       ▼
Typed application configuration
```

Examples:

```text
PORT=3000
NODE_ENV=production
DATABASE_URL=...
PAYMENTS_ENABLED=false
```

### Pros

- Keeps environment-specific values out of application code.
- Works across containers, CI/CD systems, and cloud platforms.
- Supports different values per environment.
- Fails early when required configuration is missing or invalid.

### Cons

- Environment variables can be visible to processes, diagnostics, or misconfigured logs.
- Large or structured configuration becomes difficult to manage.
- Manual environment-variable management can drift over time.
- Environment variables alone do not provide secret rotation, access auditing, or fine-grained policy.

### Remaining limitation

Environment variables separate configuration from code, but sensitive values still need secure storage, controlled access, and rotation.

---

## Solution 3 — Managed secret storage

Use a managed secret store or vault for production secrets.

```text
Deployment identity
       │ least-privilege authentication
       ▼
Secret manager / vault
       │
       ▼
Application receives only permitted secrets
```

Typical secrets:

- Database credentials.
- Third-party API tokens.
- Encryption keys.
- OAuth client secrets.
- Webhook signing secrets.
- Certificate private keys.

### Pros

- Keeps secrets out of source control and deployment manifests.
- Supports access control, auditing, rotation, and expiration.
- Reduces the risk of broad secret sharing.
- Can use workload identity instead of static cloud credentials.

### Cons

- Adds platform setup and operational dependency.
- Requires a safe fallback plan if the vault is temporarily unavailable.
- Secret rotation must be supported by the application and dependent services.
- Developers still need a safe local-development workflow.

### Remaining limitation

Secure secret storage does not solve controlled rollout of non-secret behavior changes, such as enabling a new feature for a subset of users.

---

## Solution 4 — Feature flags for controlled behavior changes

A feature flag controls whether a deployed capability is active.

```text
Code deployed
    │
    ▼
Feature flag evaluates context
    │
    ├── Enabled for internal users
    ├── Enabled for 10% of traffic
    └── Disabled for everyone else
```

### Pros

- Separates deployment from release.
- Supports gradual rollout and fast rollback.
- Reduces risk for large or uncertain changes.
- Enables controlled experiments where appropriate.
- Can target environments, tenants, or authorized users.

### Cons

- Adds runtime complexity.
- Stale flags create dead code and unclear behavior.
- Incorrect targeting can expose unfinished functionality.
- Flags are not authorization controls.
- Sensitive flag rules may expose business information if evaluated on the client.

### Remaining limitation

Feature flags need governance: ownership, expiration dates, testing of both states, and removal after rollout.

---

## Decision guide

| Need | Choose |
|---|---|
| Non-sensitive value that differs by environment | Environment variable |
| Required startup value | Environment variable plus strict startup validation |
| Password, API key, private key, signing key, or credential | Managed secret store |
| Local development placeholder | Uncommitted `.env` file, based on `.env.example` |
| Gradual rollout, experiment, or fast disable switch | Feature flag |
| Access-control decision | Backend authorization policy—not a feature flag |
| Dynamic configuration with audit and targeting | Managed configuration/flag service |
| Small static setting shared across all environments | Source-controlled non-secret configuration, if it is truly environment-independent |

**Recommended default:** use environment variables for configuration, validate them at startup, use a managed secret store for production secrets, and use feature flags only for temporary, governed rollout control.

---

## Practical TypeScript example — validated configuration with secret-safe logging

This example loads configuration once during startup, validates allowed values, and avoids including secrets in errors or logs.

```typescript name=app-config.ts
type Environment = "development" | "test" | "production";

type AppConfig = Readonly<{
  environment: Environment;
  port: number;
  databaseUrl: string;
  paymentsEnabled: boolean;
}>;

const allowedEnvironments = new Set<Environment>([
  "development",
  "test",
  "production",
]);

function requireValue(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required configuration: ${name}`);
  }

  return value;
}

function parseEnvironment(value: string): Environment {
  if (!allowedEnvironments.has(value as Environment)) {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  return value as Environment;
}

function parsePort(value: string): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function parseBoolean(value: string, name: string): boolean {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`${name} must be true or false.`);
}

function parseDatabaseUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("DATABASE_URL must be a valid URL.");
  }

  if (!["postgres:", "mysql:"].includes(url.protocol)) {
    throw new Error("DATABASE_URL must use a supported database protocol.");
  }

  return value;
}

export function loadConfig(): AppConfig {
  const environment = parseEnvironment(process.env.NODE_ENV ?? "development");
  const databaseUrl = parseDatabaseUrl(requireValue("DATABASE_URL"));

  return {
    environment,
    port: parsePort(process.env.PORT ?? "3000"),
    databaseUrl,
    paymentsEnabled: parseBoolean(
      process.env.PAYMENTS_ENABLED ?? "false",
      "PAYMENTS_ENABLED",
    ),
  };
}
```

Safe startup usage:

```typescript name=server.ts
import { loadConfig } from "./app-config.js";

try {
  const config = loadConfig();

  console.info("Application configuration loaded", {
    environment: config.environment,
    port: config.port,
    paymentsEnabled: config.paymentsEnabled,
    // Never log config.databaseUrl or other secret-bearing values.
  });
} catch (error) {
  console.error("Application startup failed", {
    message: error instanceof Error ? error.message : "Unknown configuration error",
  });

  process.exitCode = 1;
}
```

### Why this is safer

```text
Environment input
      │
      ▼
Validate presence, type, range, and allow-listed protocol
      │
      ▼
Create immutable typed config
      │
      ▼
Application starts—or fails before serving traffic
```

- Configuration is loaded once, rather than scattered through the codebase.
- Missing or malformed configuration stops startup safely.
- The port and feature flag use strict parsing.
- The database URL format and protocol are checked.
- Logs include safe operational values, not secret-bearing URLs.

### Important limitation

Validating the URL does not make database credentials safe. The database URL must still come from a protected secret source, use TLS where supported, and have least-privilege database permissions.

---

## Feature flag lifecycle

Every flag should have an owner and removal plan.

```text
1. Create flag with purpose and expiry date
       │
       ▼
2. Test enabled and disabled states
       │
       ▼
3. Roll out gradually and monitor
       │
       ▼
4. Make final decision
       │
       ▼
5. Remove flag and obsolete code
```

Example flag metadata:

| Field | Example |
|---|---|
| Name | `payments.newCheckout.enabled` |
| Owner | Payments team |
| Purpose | Gradually enable new checkout flow |
| Default | Disabled |
| Targeting | Internal users, then 5%, then 100% |
| Expiry | Remove after stable full rollout |
| Rollback | Disable flag immediately |

Do not use flags as permanent substitutes for product decisions or authorization.

---

## Validation

### Security

- Never commit real secrets, credentials, private keys, `.env` files, or production configuration to Git.
- Commit an `.env.example` file containing placeholders only.
- Use secret scanning and push protection.
- Treat a committed secret as exposed: revoke or rotate it immediately.
- Prefer workload identity, managed identity, or short-lived credentials over long-lived static access keys.
- Apply least privilege to secret-store access and database credentials.
- Encrypt secrets in transit and at rest.
- Do not expose secrets through logs, error reporting, debugging endpoints, container inspection, or client-side bundles.
- Keep all privileged secrets server-side; frontend applications must not contain secrets.

### Environment management

Maintain a documented configuration contract:

```text
Variable name       Required?   Secret?   Validation       Owner
DATABASE_URL        Yes         Yes       Supported URL    Platform team
PORT                No          No        1–65535          Service team
PAYMENTS_ENABLED    No          No        true / false     Payments team
```

Use the same variable names across environments, while allowing values to differ.

```text
Development → local database, non-production credentials
Test        → isolated test database, disposable data
Staging     → production-like integration settings
Production  → restricted credentials, real monitoring
```

Never point development or test systems at production data unless a tightly controlled, approved process exists.

### Testing

Test startup and flag behavior:

```text
Missing required secret/configuration     → startup fails before serving traffic
Malformed port                            → startup fails
Unsupported database protocol             → startup fails
Feature flag disabled                     → existing behavior remains
Feature flag enabled                      → new behavior works
Flag service unavailable                  → documented safe default is used
Secret rotation                           → application reconnects or rolls safely
```

### Performance and scalability

- Load static configuration once at startup.
- Cache secret retrieval according to rotation requirements; avoid fetching a vault on every request.
- Use bounded timeouts and retries for secret/configuration providers.
- Ensure a secret-store outage does not create an uncontrolled retry storm.
- Roll out configuration changes gradually where they can affect traffic or dependencies.
- Monitor configuration-load failures, secret access denials, flag-evaluation errors, and unexpected flag distributions.

### Accessibility

Configuration does not directly affect accessibility, but feature flags can create inconsistent interfaces:

- Test enabled and disabled states for keyboard navigation, focus order, labels, and screen-reader behavior.
- Avoid releasing partially implemented UI flows to users who depend on assistive technology.
- Ensure error messages caused by disabled integrations are clear and actionable.

---

# 3.11 Code review and standards

## Problem

Without shared code standards and review, a codebase becomes inconsistent, defects reach production, and security decisions vary between developers.

Common failures:

- Formatting and naming differ across files.
- Reviewers spend time discussing whitespace instead of correctness.
- Security-sensitive changes receive insufficient scrutiny.
- Large pull requests are difficult to understand and test.
- Regressions are merged because automated checks are inconsistent or optional.
- Review feedback becomes personal rather than focused on the code.

```text
Code change
   │
   ▼
No common standards or required checks
   │
   ▼
Inconsistent code, missed defects, and slow reviews
```

---

## Solution 1 — Documented style guide

A style guide defines agreed conventions for naming, file organization, error handling, testing, and API design.

Examples:

```text
- Use TypeScript strict mode.
- Validate untrusted input at system boundaries.
- Prefer explicit return types for public APIs where useful.
- Do not use `any` for external data.
- Use parameterized database queries.
- Do not log secrets or sensitive request bodies.
- Use descriptive names based on the business domain.
```

### Pros

- Creates a shared definition of acceptable code.
- Helps new contributors make compatible changes.
- Reduces subjective review comments.
- Documents security and quality expectations.

### Cons

- A document alone is easy to ignore or become outdated.
- Too many rules create friction.
- Manually enforcing formatting is wasteful.

### Remaining limitation

Written standards do not consistently enforce themselves. Teams need automated checks for objective rules.

---

## Solution 2 — Linters, formatters, and type checks

Use automated tools to enforce mechanical standards before review.

```text
Developer writes code
       │
       ▼
Formatter → consistent layout
       │
       ▼
Linter → suspicious patterns and rule violations
       │
       ▼
Type checker → incompatible TypeScript contracts
       │
       ▼
Tests → expected behavior
```

Typical responsibilities:

| Tool type | Purpose |
|---|---|
| Formatter | Consistent spacing, line breaks, quoting, layout |
| Linter | Detect suspicious, unsafe, or inconsistent code |
| Type checker | Verify TypeScript contracts |
| Test runner | Verify behavior |
| Security scanner | Identify known vulnerable dependencies, secrets, and unsafe patterns |

### Pros

- Eliminates repeated style discussion during review.
- Finds common issues early.
- Makes standards repeatable locally and in CI.
- Allows reviewers to focus on correctness, security, and maintainability.

### Cons

- Rules can create noise if poorly chosen.
- Strict rules may require incremental adoption in legacy code.
- Tooling does not understand all business requirements.

### Remaining limitation

Automated tools catch many mechanical problems, but they cannot reliably determine whether a change meets product, security, or operational requirements.

---

## Solution 3 — Focused pull-request review

Use pull requests for human review of changes before merging.

A good PR should be:

- Focused on one purpose.
- Small enough to review carefully.
- Accompanied by tests or a clear reason tests are not needed.
- Clear about security, migration, rollout, and operational impact.
- Validated by required automated checks.

```text
Focused change
     │
     ▼
Pull request
     ├── Automated checks
     ├── Reviewer examines intent and risk
     ├── Author responds and updates
     └── Approved merge into protected branch
```

### Pros

- Catches business-logic, security, and design issues.
- Shares knowledge across the team.
- Creates an auditable explanation of decisions.
- Improves consistency and maintainability.

### Cons

- Large PRs are slow and error-prone to review.
- Review queues can delay delivery.
- Reviewers may approve superficially if expectations are unclear.
- Unconstructive feedback can damage team collaboration.

### Remaining limitation

Review quality depends on clear expectations, appropriate ownership, and protected integration rules.

---

## Solution 4 — Protected branches and required CI

Protect the primary branch so changes merge only after required checks and review approvals succeed.

```text
Feature branch
      │
      ▼
Pull request
      │
      ├── Type check
      ├── Lint and format check
      ├── Tests
      ├── Build
      ├── Dependency / secret / static scans
      └── Required review
              │
              ▼
       Protected primary branch
```

### Pros

- Prevents bypassing baseline quality checks.
- Enforces a consistent merge process.
- Reduces the chance of broken primary branches.
- Provides evidence that changes passed expected validation.

### Cons

- Slow or unreliable CI blocks delivery.
- Too many required checks can create unnecessary delay.
- Branch protection cannot replace high-quality tests or reviews.
- Emergency processes require careful access control and auditability.

### Remaining limitation

Protected branches improve integration safety, but teams must maintain fast feedback, useful rules, and a healthy review culture.

---

## Decision guide

| Need | Choose |
|---|---|
| Align naming, architecture, and security expectations | Concise style guide |
| Enforce formatting mechanically | Formatter |
| Detect suspicious or unsafe patterns | Linter |
| Verify TypeScript contracts | Strict type checking |
| Verify behavior | Automated tests |
| Review business logic, design, and security impact | Pull-request review |
| Prevent unvalidated direct changes to primary branch | Branch protection and required CI |
| Improve a legacy codebase | Add rules gradually; avoid a disruptive all-at-once rewrite |

**Recommended default:** use a short documented standard, automated formatting and linting, strict TypeScript checks, required tests and security scans in CI, and focused PR review before merging into a protected primary branch.

---

## Review checklist

A reviewer should focus on risk and intent—not formatting that tools can enforce.

```text
Purpose
[ ] Is the change focused and understandable?
[ ] Does the PR description explain why the change is needed?

Correctness
[ ] Does the implementation satisfy the intended behavior?
[ ] Are edge cases and failure paths handled?
[ ] Are types accurate without unsafe assertions?

Security
[ ] Is untrusted input validated?
[ ] Is authorization enforced server-side where needed?
[ ] Are database calls parameterized?
[ ] Are URLs, paths, and external calls restricted safely?
[ ] Are secrets and sensitive data excluded from code and logs?

Testing
[ ] Do tests cover normal, invalid, and failure cases?
[ ] Are relevant integration or end-to-end tests included?
[ ] Does CI pass?

Operations
[ ] Does this affect configuration, migrations, monitoring, or deployment?
[ ] Is rollout or rollback needed?
[ ] Is logging useful and privacy-safe?

Accessibility
[ ] For UI changes, are semantics, keyboard behavior, focus, and errors tested?
```

---

## Practical TypeScript example — lintable, reviewable input handling

### Before

This code accepts unknown input as a trusted shape and uses unclear names. It may fail at runtime and makes review harder.

```typescript name=create-task-before.ts
export async function createTask(x: any, db: any) {
  if (x.title) {
    return db.tasks.insert({
      title: x.title,
      u: x.user,
    });
  }
}
```

Problems:

```text
- `any` removes type safety.
- Request input is not validated.
- No maximum length or whitespace handling.
- `u` does not communicate meaning.
- Missing-title behavior is unclear.
- Persistence contract is unspecified.
```

### After

```typescript name=create-task.ts
type CreateTaskInput = Readonly<{
  title: string;
}>;

type CreateTaskResult =
  | Readonly<{ ok: true; taskId: string }>
  | Readonly<{ ok: false; message: string }>;

interface TaskRepository {
  create(input: {
    ownerId: string;
    title: string;
  }): Promise<{ id: string }>;
}

function parseCreateTaskInput(value: unknown): CreateTaskInput | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const title = (value as Record<string, unknown>).title;

  if (typeof title !== "string") {
    return null;
  }

  const normalizedTitle = title.trim();

  if (normalizedTitle.length === 0 || normalizedTitle.length > 200) {
    return null;
  }

  return { title: normalizedTitle };
}

export async function createTask(
  authenticatedUserId: string,
  untrustedBody: unknown,
  tasks: TaskRepository,
): Promise<CreateTaskResult> {
  const input = parseCreateTaskInput(untrustedBody);

  if (!input) {
    return {
      ok: false,
      message: "Enter a task title between 1 and 200 characters.",
    };
  }

  const task = await tasks.create({
    ownerId: authenticatedUserId,
    title: input.title,
  });

  return {
    ok: true,
    taskId: task.id,
  };
}
```

### Why this is easier to review

```text
Untrusted body
      │
      ▼
Explicit runtime validation
      │
      ▼
Typed, normalized input
      │
      ▼
Repository receives only required fields
```

- `unknown` requires validation before use.
- Names describe the data and responsibility.
- Input limits prevent oversized values.
- The authenticated user ID comes from trusted authentication middleware, not request data.
- The repository contract is explicit.
- The return type makes expected outcomes clear.

> The repository implementation must still use parameterized queries or ORM parameter binding, and authorization must be applied for operations involving existing resources.

---

## Validation

### Standards and tooling

Use these checks locally and in CI:

```text
Format check
→ Lint check
→ TypeScript type check
→ Unit tests
→ Integration tests where relevant
→ Production build
→ Dependency vulnerability scan
→ Secret scan
→ Static application security testing
```

Keep tool versions pinned through the lockfile and update them deliberately.

### Security

- Require review from appropriate code owners for authentication, authorization, cryptography, payment, infrastructure, and deployment changes.
- Prevent direct pushes to protected primary and release branches.
- Restrict who can dismiss reviews or bypass required checks.
- Ensure CI uses least-privilege credentials.
- Do not expose secrets in CI logs, test snapshots, or PR comments.
- Treat scanner findings according to severity, exploitability, and reachability; document accepted risk with an owner and expiration date.
- Review dependency additions for necessity, maintenance status, licensing, and known vulnerabilities.

### Performance and scalability

Review for:

```text
Unbounded list queries or payloads
Nested loops over potentially large collections
Repeated database/network calls inside loops
Missing pagination or maximum limits
Missing database indexes for new access patterns
Long transactions
Unbounded retries or concurrent external requests
```

Do not require speculative optimization. Require limits and measurements where input size or traffic can grow.

### Accessibility

For UI PRs, validate:

```text
Semantic HTML before custom ARIA
Keyboard access and visible focus
Accessible labels and names
Associated and announced form errors
Logical focus management after dynamic updates
Usability at zoom and narrow viewports
Color-independent status communication
```

Automated accessibility checks help, but keyboard and screen-reader testing remain necessary for important flows.

### Review etiquette

Constructive reviews focus on the code and its impact:

```text
Prefer:
"Could we validate `projectId` before the repository call? This endpoint
accepts a route parameter, and validating it first limits invalid database work."

Avoid:
"This is wrong."
```

Classify feedback when useful:

```text
Blocking — must be resolved before merge; explain the concrete risk.
Suggestion — optional improvement; explain benefit.
Question — request clarification before judging.
Nit — minor non-blocking preference; avoid if tooling can enforce it.
```

### Operational considerations

- Keep PRs focused; separate refactoring from behavior changes where practical.
- Require a rollout plan for risky changes, migrations, flags, or external integrations.
- Link release artifacts and deployments to commit SHAs.
- Monitor post-deployment error rate, latency, and security signals.
- Use a documented emergency change process with minimal, audited bypass access.

---

# 3.12 Build, CI/CD, and packaging

## Problem

Without a repeatable build and deployment process, software may work locally but fail in test or production environments.

Common failures:

- Different developers build different outputs.
- Dependencies change unexpectedly.
- Tests or security checks are skipped before deployment.
- A broken artifact is deployed.
- Rollback is slow because the previous artifact is unavailable.
- Containers run as root, include unnecessary tools, or contain known vulnerabilities.
- CI credentials are overly privileged.

```text
Developer machine
      │
      ▼
Manual build and deployment
      │
      ▼
Different environment or missed validation
      │
      ▼
Production failure or security exposure
```

---

## Solution 1 — Manual local build and deployment

A developer runs tests, builds the application, and deploys it manually.

```text
Code change
   │
   ▼
Developer runs build locally
   │
   ▼
Manual upload or deployment
```

### Pros

- Simple for experiments.
- Minimal initial setup.
- Fast for a single developer and non-critical prototype.

### Cons

- Results differ between machines.
- Checks can be skipped accidentally.
- No reliable audit trail.
- Deployment depends on individual knowledge and access.
- Rollback is often unclear.
- Secrets may be handled unsafely during deployment.

### Remaining limitation

Manual deployment does not provide a consistent, verified, or traceable path from source code to production.

---

## Solution 2 — Repeatable build scripts and immutable artifacts

Define one build process that produces a versioned artifact.

An artifact might be:

- A compiled TypeScript application.
- A package archive.
- A container image.
- A static frontend bundle.

```text
Source commit
    │
    ▼
Install locked dependencies
    │
    ▼
Type check + test + build
    │
    ▼
Versioned immutable artifact
```

### Pros

- Produces consistent output.
- Makes debugging and rollback easier.
- Enables the same artifact to move through environments.
- Reduces “it was rebuilt differently in production” failures.

### Cons

- Build scripts need maintenance.
- The artifact must be stored securely.
- A repeatable build still does not ensure every change is validated automatically.

### Remaining limitation

A repeatable build is valuable, but it relies on developers remembering to run it. Automated CI is needed for consistent enforcement.

---

## Solution 3 — Continuous integration

Continuous integration (CI) automatically validates every pull request and protected-branch change.

```text
Pull request
    │
    ▼
CI pipeline
    ├── Install locked dependencies
    ├── Format and lint checks
    ├── TypeScript type check
    ├── Unit / integration tests
    ├── Build artifact
    ├── SAST / secret scanning
    └── Dependency vulnerability scan
```

### Pros

- Enforces baseline checks consistently.
- Finds failures before merge.
- Prevents broken or untested changes from reaching the primary branch.
- Creates auditable build results.
- Supports branch-protection requirements.

### Cons

- Slow or unreliable pipelines delay developers.
- CI configuration requires maintenance.
- Scanners can create noisy findings if not tuned.
- CI does not guarantee safe deployment configuration.

### Remaining limitation

CI verifies changes and produces artifacts, but it does not automatically deploy them safely or manage release risk.

---

## Solution 4 — Continuous delivery with staged deployment

Continuous delivery automatically deploys validated artifacts to controlled environments, usually progressing from test to staging to production.

```text
Validated artifact
      │
      ▼
Test environment
      │
      ▼
Staging environment
      │
      ▼
Production rollout
      ├── Monitor
      ├── Continue rollout
      └── Roll back if unhealthy
```

### Pros

- Reduces manual deployment mistakes.
- Delivers changes faster and more consistently.
- Supports auditable promotion through environments.
- Enables automated rollback or quick redeployment of a known-good artifact.
- Encourages smaller, lower-risk releases.

### Cons

- Requires reliable tests, environment configuration, and monitoring.
- Infrastructure and release rules require investment.
- Poorly designed automatic deployment can spread defects quickly.
- Database migrations and external dependencies need explicit rollout planning.

### Remaining limitation

A deployment pipeline is only as safe as its artifact security, credentials, runtime configuration, and monitoring.

---

## Solution 5 — Secure container packaging

A container packages the application and its runtime dependencies into an immutable image.

```text
Build stage
  ├── Install dependencies
  ├── Compile TypeScript
  └── Run checks
        │
        ▼
Runtime stage
  ├── Production dependencies only
  ├── Non-root user
  ├── Minimal runtime image
  └── Compiled application
```

### Pros

- Improves environment consistency.
- Simplifies deployment to container platforms.
- Makes runtime dependencies explicit.
- Supports artifact signing, scanning, and promotion.
- Reduces host-machine dependency differences.

### Cons

- Images can become large or vulnerable if poorly designed.
- Containers do not automatically make an application secure.
- Networking, secrets, storage, and identity still require platform configuration.
- Image base versions must be maintained.

### Remaining limitation

Containers standardize packaging, but secure deployment still requires least-privilege identity, secrets management, network policy, runtime monitoring, and vulnerability management.

---

## Decision guide

| Need | Choose |
|---|---|
| Prototype for one developer | Repeatable local build script |
| Shared repository | CI on every pull request |
| Deploy the same verified output across environments | Versioned immutable artifacts |
| Frequent production releases | Continuous delivery with staged rollout |
| Consistent runtime across platforms | Container image |
| Security-sensitive deployment | CI security scanning, signed artifacts, least-privilege deployment identity |
| Risky user-facing change | Feature flag plus monitored staged rollout |
| Database schema change | Backward-compatible migration with explicit rollout and rollback plan |

**Recommended default:** build a versioned artifact in CI, require checks before merge, deploy the same artifact through environments, scan dependencies and containers, and use staged production rollout with monitoring and a documented rollback path.

---

## Practical TypeScript example — production build scripts

This `package.json` structure keeps validation separate from build output and makes CI commands explicit.

```json name=package.json
{
  "name": "project-service",
  "private": true,
  "type": "module",
  "scripts": {
    "clean": "node --eval \"import('node:fs/promises').then(fs => fs.rm('dist', { recursive: true, force: true }))\"",
    "typecheck": "tsc --noEmit",
    "build": "npm run clean && tsc --project tsconfig.build.json",
    "test": "node --test",
    "lint": "eslint . --max-warnings=0",
    "format:check": "prettier --check .",
    "validate": "npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build",
    "start": "node dist/server.js"
  },
  "engines": {
    "node": ">=22 <23"
  }
}
```

### Why this helps

```text
npm run validate
      │
      ├── Formatting is checked
      ├── Lint warnings fail the build
      ├── Types are checked
      ├── Tests run
      └── Production output is built
```

- CI can run one deterministic validation command.
- The production build is separate from development execution.
- The runtime version is declared.
- Build output is created only after validation succeeds.
- The lockfile should be committed and CI should use a lockfile-respecting install, such as `npm ci`.

> Verify the selected Node.js version against the project’s supported LTS policy and deployment platform. Keep it updated through a deliberate maintenance process.

---

## Secure container example

This multi-stage Dockerfile builds TypeScript in one stage and runs only the required output in the final image.

```dockerfile name=Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN npm run validate

FROM node:22-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system app \
    && adduser --system --ingroup app app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=build /app/dist ./dist

USER app

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Why this is safer

```text
Build image                     Runtime image
───────────                     ─────────────
TypeScript source               Compiled output only
Development dependencies        Production dependencies only
Build tooling                   Minimal runtime
Root during image setup         Non-root application user
```

- Uses a multi-stage build to exclude source and build tooling from the final image.
- Installs dependencies from the committed lockfile.
- Runs validation before producing runtime output.
- Omits development dependencies in the runtime image.
- Runs the application as a non-root user.
- Uses exec-form `CMD`, avoiding shell parsing.

### Important limitations

- Pin base images by immutable digest for stronger supply-chain reproducibility.
- Scan the final image for known vulnerabilities.
- Do not put secrets in `Dockerfile` instructions, image layers, build arguments, or copied `.env` files.
- Use a `.dockerignore` file to prevent `.git`, `.env`, coverage, test artifacts, and local dependencies from entering the build context.
- Containers should use read-only filesystems and minimal runtime permissions where supported by the deployment platform.

---

## CI/CD pipeline flow

```text
Pull request
    │
    ▼
CI validation
    ├── Locked dependency install
    ├── Format / lint / type check
    ├── Tests
    ├── SAST and secret scanning
    ├── Dependency vulnerability scan
    ├── Build artifact / container
    └── Container scan
    │
    ▼
Merge to protected primary branch
    │
    ▼
Build once, assign commit SHA/version
    │
    ▼
Publish immutable artifact
    │
    ▼
Deploy to staging
    ├── Smoke test
    ├── Health check
    └── Monitor
    │
    ▼
Staged production rollout
    ├── Monitor errors and latency
    └── Roll back if thresholds fail
```

---

## Validation

### Build reproducibility

- Commit the lockfile.
- Use lockfile-respecting installation in CI, such as `npm ci`.
- Pin build-tool and runtime versions.
- Build once and promote the same artifact between environments.
- Version artifacts using the source commit SHA and, where applicable, a release version.
- Store artifact metadata: commit SHA, build time, dependency scan result, and deployment target.

### Security

- Run secret scanning, dependency vulnerability scanning, static analysis, and container scanning in CI.
- Review new dependencies before adoption.
- Use least-privilege CI and deployment credentials.
- Prefer short-lived workload identity over long-lived access keys.
- Protect production deployment environments with approvals where risk requires them.
- Restrict who can alter CI configuration and deployment workflows.
- Sign or attest release artifacts where the platform supports it.
- Do not expose secrets in build logs, package registries, image layers, or test reports.
- Use a software bill of materials (SBOM) for production artifacts where required by policy or regulation.

### Deployment and rollback

- Use health checks before sending production traffic to a new version.
- Monitor error rate, latency, resource use, and dependency failures during rollout.
- Keep the previous known-good artifact available.
- Prefer rollback by redeploying the prior artifact rather than rebuilding it.
- Make database migrations backward-compatible:

```text
1. Add compatible schema change
2. Deploy code that supports old and new schema
3. Backfill data if needed
4. Switch reads/writes
5. Remove old schema only after verification
```

- Avoid destructive schema changes in the same deployment as application code that still depends on old data.
- Back up and test restoration procedures before destructive data operations.

### Performance and scalability

- Cache dependencies safely in CI using lockfile-based cache keys.
- Keep build contexts and container images small.
- Parallelize independent CI checks where this does not obscure failures.
- Set timeouts for jobs and deployment operations.
- Use deployment concurrency limits to avoid overwhelming databases or external dependencies.
- Load-test major performance-sensitive releases in a production-like environment.

### Accessibility

CI can help prevent accessibility regressions:

```text
Component tests
→ automated accessibility checks
→ keyboard interaction tests for key flows
→ manual screen-reader verification for high-impact changes
```

Automated checks are valuable but do not replace manual validation of focus management, dynamic content announcements, and complex widgets.

### Operational considerations

Monitor the pipeline itself:

```text
Build duration
CI failure rate
Flaky-test rate
Deployment duration
Rollback frequency
Post-deployment error rate
Vulnerability remediation time
```

A pipeline that is slow or unreliable will be bypassed. Treat CI/CD reliability as a product capability, not only infrastructure maintenance.

---

# 3.13 Documentation

## Problem

Software becomes difficult to use, operate, and change when essential knowledge exists only in people’s memory, chat messages, or source code.

Common failures:

- New developers cannot run the project locally.
- API consumers guess request formats and error behavior.
- Production incidents take longer because recovery steps are undocumented.
- Security-sensitive operations are performed inconsistently.
- Code comments describe outdated implementation details.
- Teams repeat the same onboarding and support questions.

```text
Knowledge lives in individuals
          │
          ▼
People are unavailable or leave
          │
          ▼
Slow onboarding, risky operations, repeated mistakes
```

Documentation should help a specific audience complete a task safely. It is not valuable merely because it exists.

---

## Solution 1 — README for project entry points

A README is the first place contributors and users look. It should explain what the project does and how to use it safely.

```text
Repository
   │
   ▼
README
   ├── Purpose
   ├── Prerequisites
   ├── Local setup
   ├── Validation commands
   ├── Configuration reference
   └── Links to deeper documentation
```

### Pros

- Provides a single starting point.
- Improves onboarding.
- Makes common commands discoverable.
- Encourages consistent local setup.

### Cons

- A README can become too long if it tries to contain every detail.
- It may become outdated if changes are not included in normal development work.
- It is not enough for detailed operational procedures or API contracts.

### Remaining limitation

A README explains how to begin, but API consumers and operators need task-specific documentation.

---

## Solution 2 — API documentation and examples

Document the API contract: authentication expectations, request and response shapes, status codes, validation errors, pagination, and rate limits.

```text
API consumer
    │
    ▼
Contract documentation
    ├── Endpoint purpose
    ├── Authentication
    ├── Request validation
    ├── Response schema
    ├── Error behavior
    └── Examples
```

### Pros

- Reduces incorrect integrations.
- Makes client implementation faster.
- Clarifies compatibility and breaking changes.
- Encourages stable error and validation contracts.

### Cons

- Manual endpoint documentation can drift from implementation.
- Overly detailed internal information can create security risk.
- Examples may accidentally contain real secrets or personal data.

### Remaining limitation

API documentation explains intended behavior, but it does not help operators recover a failed deployment or service incident.

---

## Solution 3 — Runbooks for operations and incidents

A runbook provides step-by-step instructions for a recurring operational task or incident.

Examples:

- Roll back a deployment.
- Rotate an API credential.
- Respond to a queue backlog.
- Restore a database backup.
- Investigate elevated error rates.
- Disable a feature flag safely.

```text
Alert fires
    │
    ▼
Runbook
    ├── Verify impact
    ├── Gather safe diagnostics
    ├── Mitigate
    ├── Escalate when needed
    └── Validate recovery
```

### Pros

- Reduces incident response time.
- Makes operations less dependent on specific individuals.
- Encourages safe, repeatable recovery steps.
- Supports auditability and training.

### Cons

- Requires regular testing and maintenance.
- A runbook cannot cover every novel incident.
- Unsafe instructions can amplify an outage if permissions and preconditions are unclear.

### Remaining limitation

Runbooks help operate deployed software, but maintainers still need code-level context for complex behavior and decisions.

---

## Solution 4 — Intent-focused inline documentation

Use comments and documentation near code to explain **why** a non-obvious decision exists, not to restate obvious code.

```text
Code answers:      What does this do?
Types answer:      What shape does data have?
Tests answer:      What behavior is expected?
Comments answer:   Why was this decision necessary?
```

### Pros

- Preserves important design context near the implementation.
- Helps future maintainers avoid reversing deliberate decisions.
- Useful for security, performance, compatibility, and workaround explanations.

### Cons

- Comments drift if not updated with code.
- Excessive comments obscure the important ones.
- Comments do not replace clear names, types, tests, or architecture documentation.

### Remaining limitation

Inline documentation helps maintainers, but it must be supported by a process that keeps all documentation current and discoverable.

---

## Decision guide

| Need | Choose |
|---|---|
| Explain the project and local setup | `README.md` |
| Explain an endpoint contract | API documentation |
| Explain a deployment, rollback, or incident procedure | Runbook |
| Explain a non-obvious design or security decision | Inline code comment |
| Explain a cross-service design decision | Architecture decision record (ADR) |
| Explain how to contribute | `CONTRIBUTING.md` |
| Explain configuration values | Configuration reference / `.env.example` |
| Explain a user-facing workflow | Product or user documentation |

**Recommended default:** maintain a concise README, document public and internal API contracts, create tested runbooks for operationally important tasks, and add code comments only when they explain non-obvious intent.

---

## Practical TypeScript example — document a security decision near the code

This example validates a redirect target after authentication. The comment explains why only local paths are accepted.

```typescript name=safe-redirect.ts
const allowedRedirectPathPattern = /^\/[a-zA-Z0-9/_-]*$/;

export function getSafeRedirectPath(value: unknown): string {
  if (typeof value !== "string") {
    return "/";
  }

  /**
   * Accept local, application-relative paths only.
   *
   * This prevents open-redirect attacks such as:
   * - https://attacker.example
   * - //attacker.example
   * - javascript:...
   *
   * If external redirects become a product requirement, introduce an explicit
   * host and path allow-list rather than relaxing this validation.
   */
  if (!allowedRedirectPathPattern.test(value)) {
    return "/";
  }

  return value;
}
```

### Why this documentation adds value

```text
Without comment:
"Why not allow a complete URL?"

With comment:
"Complete URLs create open-redirect risk; use an explicit allow-list if needed."
```

The code is already readable. The comment preserves the security reason behind the restriction and warns future maintainers not to weaken it casually.

### Limitation

This simple pattern intentionally permits only a narrow subset of local paths. If the application needs query strings, internationalized paths, or more complex route formats, define and test a stricter parser that still rejects:

```text
Absolute URLs
Protocol-relative URLs
Backslash-based bypasses
Control characters
Unexpected schemes
```

---

## README structure

A useful README should be concise and task-oriented.

````markdown name=README.md
# Project Service

Short description of the service and its primary responsibility.

## Prerequisites

- Supported Node.js version
- Container runtime, if required
- Access to approved development secrets or local substitutes

## Local development

```bash
npm ci
cp .env.example .env
npm run validate
npm run start
```

Do not commit `.env`. Use placeholders or approved local-development credentials only.

## Configuration

See `.env.example` and [Configuration reference](docs/configuration.md).

## Validation

```bash
npm run validate
```

This runs formatting, linting, TypeScript checks, tests, and the production build.

## Documentation

- [API documentation](docs/api.md)
- [Operational runbooks](docs/runbooks/)
- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
````

### README guidance

Include:

```text
What the project does
Who owns or maintains it
Supported runtime and prerequisites
Safe local setup
Required validation commands
Configuration documentation
Links to API, runbook, contribution, and security documentation
```

Avoid including:

```text
Real credentials
Production URLs containing secrets
Private keys
Large copied API specifications
Long troubleshooting guides better suited to runbooks
Undocumented manual deployment instructions
```

---

## API documentation guide

For each endpoint, document:

| Section | Purpose |
|---|---|
| Purpose | What business capability the endpoint provides |
| Authentication | Required identity and permissions |
| Request | Method, path, headers, body, limits |
| Validation | Required fields, allowed values, size constraints |
| Response | Success response and field meanings |
| Errors | Status codes and stable error format |
| Pagination | Limits, cursors, ordering guarantees |
| Rate limits | Relevant constraints and retry guidance |
| Example | Safe, non-secret request and response |

Use examples with fictional identifiers:

```text
Good:  project_123, user_example
Avoid: production emails, tokens, customer IDs, real addresses
```

For APIs with machine-readable contracts, generate or validate documentation from the API schema when practical. This reduces drift between the implementation and published contract.

---

## Runbook structure

A runbook must be actionable under pressure.

```text
Title
Purpose and scope
Prerequisites and required access
When to use / when not to use
Impact and risks
Step-by-step procedure
Validation of successful recovery
Rollback or recovery path
Escalation contacts or ownership
Related dashboards, alerts, and logs
Last tested date
```

Example flow:

```text
Incident: queue backlog is growing
        │
        ▼
1. Confirm alert and user impact
        │
        ▼
2. Check worker health, error rate, and dependency status
        │
        ▼
3. Scale or restart only if preconditions are met
        │
        ▼
4. Monitor backlog reduction and failed-job rate
        │
        ▼
5. Escalate if backlog or failures continue
```

Do not include secrets in runbooks. Link to approved secret-management and access-request processes instead.

---

## Validation

### Security

- Never document real secrets, private keys, access tokens, session identifiers, customer data, or production credentials.
- Use fictional values in examples and screenshots.
- Document security-sensitive procedures with required permissions and approval boundaries.
- Explain when an operator must stop and escalate rather than continue.
- Keep security documentation access-controlled when it would expose meaningful attack details.
- Ensure external API documentation does not reveal internal hostnames, infrastructure topology, or implementation details unnecessarily.
- Review documentation changes alongside code changes that alter authentication, authorization, configuration, or operational behavior.

### Accuracy and maintainability

Treat documentation as part of the feature:

```text
Code change
   │
   ├── Does setup change?        → Update README
   ├── Does API change?          → Update API contract/docs
   ├── Does config change?       → Update configuration reference
   ├── Does deployment change?   → Update runbook
   └── Does a decision matter?   → Add/update ADR or inline comment
```

Keep documentation maintainable:

- Prefer short, task-focused documents.
- Link to canonical sources instead of duplicating them.
- Keep commands copyable and tested.
- Use automated checks for broken links, stale generated API documentation, and example validation where practical.
- Add ownership and review expectations for high-risk runbooks.

### Testing

Validate documentation through use:

```text
New contributor follows README     → can set up and validate the project
API example is executed            → matches actual contract
Runbook tabletop exercise          → operators can follow it safely
Rollback runbook                   → tested in non-production environment
Secret rotation runbook            → validated before a real incident
Configuration reference            → matches startup validation
```

### Accessibility

Documentation is part of the user experience:

- Use descriptive headings in a logical hierarchy.
- Use meaningful link text instead of “click here.”
- Provide text alternatives for diagrams and screenshots.
- Use accessible tables; do not convey meaning only through color.
- Keep code examples selectable as text, not only images.
- Use clear language and define unavoidable acronyms.
- Ensure generated API documentation is keyboard navigable and screen-reader usable.

### Performance and scalability

Documentation supports scalable operations:

- Document limits, pagination behavior, rate limits, timeouts, and retry expectations.
- Document expected resource usage and capacity signals for operational components.
- Include dashboards and metrics in runbooks for high-traffic services.
- Explain safe bulk-operation limits to avoid accidental load spikes.
- Update operational guidance after performance incidents and post-incident reviews.


---

---

---

---

---

---

---

---

