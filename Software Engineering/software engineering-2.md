# 2.1 Architecture Fundamentals

Architecture is the set of **important technical decisions** that shape how a system is built, operated, changed, and secured over time.

It is not only “which folders exist” or “which framework we use.” It answers questions such as:

- Can the system handle 10 users or 10 million?
- Can a team safely change one feature without breaking others?
- Is customer data protected?
- How quickly can the system recover from a failure?
- Can new developers understand the system?

---

## Problem: Building Without Architecture

Without intentional architecture, teams often start by putting all logic wherever it is convenient.

```text
User
  |
  v
One large application
  |- UI logic
  |- business rules
  |- database queries
  |- authentication
  |- email sending
  |- external API calls
```

This may work at first. As features and developers are added, common problems appear:

- A change in one area unexpectedly breaks another.
- The app becomes slow under load.
- Security checks are inconsistent.
- Deployments become risky.
- Nobody knows why a decision was made.
- New developers need a long time to understand the system.

The core issue is that the system has no agreed structure or documented priorities.

---

## Solution 1: Identify Quality Attributes

A **quality attribute** describes how well the system must work, rather than what it must do.

For example:

- “Users can place an order” is a **functional requirement**.
- “Order placement must usually finish in under two seconds” is a **performance quality attribute**.

### Common quality attributes

| Attribute | Meaning | Example question |
|---|---|---|
| Performance | Speed and resource efficiency | How quickly does a search return? |
| Scalability | Ability to handle growth | Can traffic grow 10× without redesigning everything? |
| Reliability | Correct operation over time | Does an order remain correct after a transient failure? |
| Availability | Time the service is usable | Can customers use it during a server outage? |
| Security | Protection from unauthorized access or data loss | Can one customer access another customer’s records? |
| Maintainability | Ease of changing the system | Can a developer add a payment method safely? |
| Testability | Ease of verifying behavior | Can business rules be tested without a real database? |
| Usability | Ease and accessibility of use | Can keyboard-only and screen-reader users complete checkout? |
| Observability | Ability to understand the running system | Can operators diagnose a failed request? |

### Make quality attributes measurable

A vague statement is hard to design and test against.

| Too vague | Better quality-attribute scenario |
|---|---|
| “The system must be fast.” | “Product search returns within 500 ms for 95% of requests at 200 requests/second.” |
| “The system must be secure.” | “All write operations require authenticated users with explicit authorization; tenant data is isolated server-side.” |
| “The system must be reliable.” | “After a retryable payment-provider failure, no order is charged more than once.” |
| “The UI must be accessible.” | “Checkout can be completed using only a keyboard and meets WCAG 2.2 AA requirements.” |

### Pros

- Makes priorities explicit.
- Gives the team measurable design targets.
- Helps test whether the architecture is successful.
- Prevents “fast,” “secure,” or “scalable” from becoming empty labels.

### Cons

- Quality attributes can conflict.
- Measuring them requires effort and realistic testing.
- A long unprioritized list is still not useful.

### Problem left behind: trade-offs

You cannot maximize every quality attribute at the same time.

For example, keeping every response in memory might improve performance, but it increases memory use and can make correctness harder when data changes. Requiring additional authentication checks improves security, but may add latency and user friction.

That leads to the next solution.

---

## Solution 2: Make Trade-offs Explicit

An architectural **trade-off** is a deliberate choice: improve one quality attribute while accepting a cost elsewhere.

### Example: Product catalog updates

Suppose an online shop needs very fast product searches.

**Option A: Read directly from the primary database**

```text
User -> API -> Primary database
```

- **Pros:** always reads current data; simpler consistency model.
- **Cons:** database can become a bottleneck as read traffic grows.

**Option B: Add a cache**

```text
User -> API -> Cache -> Primary database
                 |
          Fast common reads
```

- **Pros:** much faster and cheaper repeated reads; reduces database load.
- **Cons:** cached data can become temporarily stale; adds operational complexity.

The decision is not “cache is good” or “cache is bad.” It depends on whether a short delay in showing updated product details is acceptable.

### A practical prioritization method

For each important quality attribute, define:

1. **Priority** — how important is it?
2. **Target** — how will success be measured?
3. **Cost** — what complexity or expense does it introduce?
4. **Failure impact** — what happens if it is not achieved?

Example:

| Attribute | Priority | Target | Accepted trade-off |
|---|---:|---|---|
| Security | Critical | Authorization on every resource access | More implementation and test effort |
| Availability | High | 99.9% monthly availability | Redundant infrastructure cost |
| Performance | High | p95 API response below 500 ms | Caching complexity |
| Consistency | High for payments | No duplicate charges | Slower, carefully coordinated workflows |
| Maintainability | High | Isolated business logic with automated tests | More project structure |

### Security-first trade-off example

For sensitive actions, prioritize security over convenience:

```text
Request to download invoice
       |
       v
Authenticate user
       |
       v
Authorize access to this specific invoice
       |
       +--> Deny by default if ownership/permission is not proven
       |
       v
Return document
```

Checking only that a user is logged in is insufficient. The system must authorize access to the **specific resource**. This adds code and database checks, but protects against insecure direct object references.

### Pros

- Makes costs visible before implementation.
- Stops accidental architecture decisions.
- Aligns technical decisions with business risk.
- Helps teams explain why complexity exists.

### Cons

- Decisions can be forgotten after meetings.
- New team members may repeat old discussions.
- Decisions can become outdated as requirements change.

### Problem left behind: undocumented decisions

A team may agree to use a cache, modular monolith, or OAuth/OIDC—but six months later nobody remembers:

- What alternatives were considered?
- Why was this chosen?
- Which trade-offs were accepted?
- When should the decision be revisited?

This leads to Architecture Decision Records.

---

## Solution 3: Record Important Decisions with ADRs

An **Architecture Decision Record (ADR)** is a short document that records a significant architectural decision and its reasoning.

ADRs should be lightweight. Their job is not to create paperwork; their job is to preserve context.

### Typical ADR lifecycle

```text
Proposed -> Accepted -> Superseded / Deprecated
```

- **Proposed**: being discussed.
- **Accepted**: active decision.
- **Superseded**: replaced by a later ADR.
- **Deprecated**: no longer recommended, but not necessarily directly replaced.

### Example ADR

```markdown name=docs/adr/0001-use-oidc-for-user-authentication.md
# ADR 0001: Use OpenID Connect for user authentication

## Status
Accepted

## Context
The application needs secure user authentication without storing user passwords.
We need support for multi-factor authentication and centralized identity management.

## Decision
Use OpenID Connect (OIDC) with a managed identity provider.
The application will validate issuer, audience, signature, expiration, and nonce/state
where applicable. Authorization decisions remain enforced by this application.

## Consequences
- We avoid implementing password storage and recovery ourselves.
- Users may use centralized sign-in and MFA.
- The system depends on identity-provider availability.
- The application must securely validate tokens and apply least-privilege authorization.
- Secrets and signing configuration must be stored in managed secret storage, never source code.

## Alternatives considered
- Local username/password authentication: rejected because it increases credential-storage,
  password-reset, MFA, monitoring, and breach-response responsibilities.
```

### What belongs in an ADR?

Create one when a decision is expensive to reverse or affects multiple parts of the system:

- Architecture style: modular monolith vs. microservices.
- Authentication and authorization strategy.
- Database choice.
- API style or versioning policy.
- Cloud provider or deployment approach.
- Event delivery guarantees.
- Tenant isolation strategy.
- Logging and observability standards.

Do **not** create one for small local implementation choices, such as a variable name or a one-file refactor.

### Pros

- Preserves context and reasoning.
- Reduces repeated debates.
- Makes onboarding easier.
- Provides an auditable record for security and compliance-related decisions.
- Makes it easier to identify decisions that need review.

### Cons

- ADRs can become stale.
- Excessively detailed ADRs are unlikely to be maintained.
- They explain decisions, but do not show the whole system structure visually.

### Problem left behind: no shared visual model

ADRs explain individual decisions. They do not necessarily tell a new developer:

- Which users use the system?
- Which external services does it depend on?
- Which applications and databases exist?
- Where does a request flow?

This leads to the C4 model.

---

## Solution 4: Communicate Structure with the C4 Model

The **C4 model** is a simple way to draw software architecture at increasing levels of detail.

“C4” represents:

1. **Context**
2. **Containers**
3. **Components**
4. **Code**

Most teams benefit most from the first two levels. Use the deeper levels only when they answer a real question.

---

### Level 1: System Context

Shows the system, its users, and external dependencies.

```text
+-------------------+       uses        +------------------------+
| Customer          | ----------------> | Online Store System    |
+-------------------+                   +------------------------+
                                                  |
                                                  | processes payments
                                                  v
                                         +------------------------+
                                         | Payment Provider       |
                                         +------------------------+
```

Use it to answer: **What is our system, who uses it, and what does it integrate with?**

---

### Level 2: Container Diagram

A **container** is a separately deployable or separately running unit, such as a web app, API, worker, database, or mobile application. It does **not** mean only a Docker container.

```text
Customer
   |
   v
+--------------------+
| Web application    |
| TypeScript UI      |
+--------------------+
   | HTTPS
   v
+--------------------+        +---------------------+
| Store API          | -----> | PostgreSQL          |
| TypeScript service |        | orders, products    |
+--------------------+        +---------------------+
   |
   | HTTPS
   v
+--------------------+
| Payment provider   |
+--------------------+
```

Use it to answer: **What runs in the system and how do parts communicate?**

Security details should be shown where important:

- HTTPS/TLS for network communication.
- Authentication boundary between browser and API.
- Which system owns sensitive data.
- External dependencies and trust boundaries.
- No direct browser-to-database access.

---

### Level 3: Component Diagram

Shows major internal responsibilities inside one container.

```text
+--------------------------------------------------+
| Store API                                        |
|                                                  |
|  Order Controller                                |
|       |                                          |
|       v                                          |
|  Order Service -----> Payment Gateway Adapter    |
|       |                                          |
|       v                                          |
|  Order Repository ---> PostgreSQL                |
+--------------------------------------------------+
```

Use it to answer: **Where should a new feature or business rule go?**

Avoid drawing every class. Focus on meaningful boundaries and responsibilities.

---

### Level 4: Code Diagram

Shows code-level relationships, such as classes or modules. This is often generated by IDEs or inferred directly from the source code.

Use it only for complex areas where it improves understanding. For ordinary code, clear module boundaries, names, and tests are usually more useful.

### Pros

- Gives technical and non-technical stakeholders a shared language.
- Starts simple and adds detail only when needed.
- Makes system boundaries and dependencies visible.
- Helps identify risky coupling and security trust boundaries.

### Cons

- Diagrams become misleading if not updated.
- Over-detailed diagrams are difficult to read.
- A diagram shows intended design, not proof that the deployed system behaves that way.

### Remaining responsibility: keep architecture alive

Architecture is not a one-time diagram. Keep it current through:

- ADRs for meaningful decisions.
- Diagrams updated alongside major structural changes.
- Automated tests for important quality targets.
- Load, security, resilience, and accessibility validation.
- Monitoring that verifies production behavior.

---

## When to Choose Which

| Need | Choose |
|---|---|
| Define what “good” means for the system | **Quality attributes** |
| Decide between conflicting goals | **Trade-off analysis** |
| Preserve the reason behind a major choice | **ADR** |
| Explain the system to a new developer or stakeholder | **C4 context/container diagrams** |
| Explain responsibilities within a complicated service | **C4 component diagram** |
| Understand a particularly complex implementation area | **Code-level diagram**, sparingly |

In practice, use them together:

```text
Quality attributes
        |
        v
Trade-off decision
        |
        v
Record it in an ADR
        |
        v
Reflect the result in C4 diagrams
        |
        v
Validate it with tests, monitoring, and reviews
```

---

## Key Takeaways

- Architecture is about the decisions that are costly to change and strongly affect system quality.
- Start with measurable quality attributes—not technology preferences.
- Every architecture choice has trade-offs.
- Use ADRs to preserve decision context.
- Use C4 diagrams to communicate system boundaries and structure.
- Security should be a non-negotiable quality attribute: authenticate users, authorize every sensitive action, enforce least privilege, and document trust boundaries.

**Next topic: 2.2 Architecture styles** — how monoliths, modular monoliths, layered architecture, hexagonal architecture, microservices, event-driven systems, serverless, CQRS, and event sourcing solve different structural problems.

---
# 2.2 Architecture Styles

An **architecture style** is a common way to organize a system’s code, data, communication, and deployment.

There is no universally best style. The correct choice depends on team size, domain complexity, traffic, deployment needs, and operational maturity.

A good default is:

> Start with a **modular monolith**. Move to distributed services only when a clear problem justifies their operational cost.

---

## Problem: An Unstructured Application

A small application often begins with everything mixed together:

```text
HTTP request
    |
    v
route handler
    |- validates input
    |- checks permissions
    |- calculates business rules
    |- queries database
    |- calls payment provider
    |- sends email
```

This is quick to create, but it becomes difficult to change safely.

### Problems

- Business rules are duplicated across handlers.
- Database access, HTTP details, and domain logic are tightly coupled.
- Testing requires a real database or external services.
- A small change can affect unrelated features.
- Security checks may be inconsistent.
- The application becomes difficult for multiple developers to work on.

---

# Solution 1: Monolith

A **monolith** is one deployable application. Its modules run in the same process and usually share one database.

```text
+--------------------------------------+
| Application                          |
|                                      |
| Users | Products | Orders | Payments |
+--------------------------------------+
                 |
                 v
           +-----------+
           | Database  |
           +-----------+
```

A monolith is not automatically bad. Many successful systems are monoliths.

### Pros

- Simple to build, debug, and deploy.
- One codebase and usually one deployment pipeline.
- Calls between modules are fast in-process function calls.
- Transactions across features are simpler.
- Lower infrastructure and observability cost.
- Good choice for small teams, new products, and early learning.

### Cons

- Modules can become tangled without clear boundaries.
- Every deployment releases the whole application.
- One module’s resource problem can affect all modules.
- Scaling one feature means scaling the full application.
- Large teams may create merge conflicts and accidental coupling.

### Problem left behind

The monolith is simple operationally, but without internal structure it can become a **big ball of mud**: one large codebase where everything depends on everything else.

The next style keeps monolith simplicity while creating strong internal boundaries.

---

# Solution 2: Modular Monolith

A **modular monolith** is still one deployable application, but its business areas are organized into explicit modules.

```text
+-------------------------------------------------------+
| Modular Monolith                                      |
|                                                       |
| +-----------+  +------------+  +-------------------+  |
| | Identity  |  | Catalog    |  | Orders            |  |
| +-----------+  +------------+  +-------------------+  |
|       |              |                  |              |
|       +--------------+------------------+              |
|                      |                                 |
|                +-----------+                           |
|                | Database  |                           |
|                +-----------+                           |
+-------------------------------------------------------+
```

Each module owns a clear responsibility. For example:

| Module | Responsibility |
|---|---|
| Identity | Users, roles, authentication-related identity data |
| Catalog | Products, prices, categories |
| Orders | Order lifecycle and business rules |
| Payments | Payment-provider integration and payment state |
| Notifications | Email, SMS, and push-message delivery |

### Important rule: modules should not reach into each other’s internals

Bad:

```text
Orders module directly reads Payments tables
```

Better:

```text
Orders module -> Payments public API / published event -> Payments module
```

This means a module exposes only deliberate interfaces, such as functions, commands, queries, or domain events.

### TypeScript example: module boundary with explicit authorization

This example keeps order rules inside the Orders module. The caller cannot access another customer’s order merely by supplying an ID.

```typescript name=src/orders/application/get-order.ts
export type UserContext = Readonly<{
  userId: string;
  roles: readonly string[];
}>;

export type Order = Readonly<{
  id: string;
  customerId: string;
  status: "pending" | "paid" | "shipped";
  totalCents: number;
}>;

export interface OrderRepository {
  findById(orderId: string): Promise<Order | null>;
}

export class OrderNotFoundError extends Error {
  constructor() {
    super("Order not found.");
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You do not have permission to access this order.");
  }
}

export async function getOrder(
  actor: UserContext,
  orderId: string,
  orders: OrderRepository,
): Promise<Order> {
  const order = await orders.findById(orderId);

  // Avoid treating missing data as an allowed path.
  if (order === null) {
    throw new OrderNotFoundError();
  }

  const isAdministrator = actor.roles.includes("orders:read:any");
  const isOwner = order.customerId === actor.userId;

  // Deny by default. Authentication alone does not authorize resource access.
  if (!isAdministrator && !isOwner) {
    throw new ForbiddenError();
  }

  return order;
}
```

This protects against **insecure direct object reference (IDOR)** attacks, where an authenticated user changes an order ID in a URL or request to retrieve someone else’s data.

### Pros

- Keeps monolith deployment simplicity.
- Clear business boundaries reduce accidental coupling.
- Easier testing and ownership by teams.
- Modules can often later be extracted into services if genuinely needed.
- A strong default for most business applications.

### Cons

- Requires discipline: developers must respect module APIs.
- Shared database schemas can still create hidden coupling.
- Independent scaling and deployment are still unavailable.
- Very large organizations may eventually need stronger runtime isolation.

### Problem left behind

A modular monolith still deploys and scales as one unit. If one module needs independent release cycles, a different programming language, or vastly more compute, the team may consider separate services.

Before splitting, first understand another way to structure modules internally: **layered architecture**.

---

# Solution 3: Layered Architecture

**Layered architecture** separates code by technical responsibility.

A common form has these layers:

```text
+--------------------------+
| Presentation             |  HTTP routes, controllers, UI
+--------------------------+
| Application              |  use cases, workflows
+--------------------------+
| Domain                   |  business rules
+--------------------------+
| Infrastructure           |  database, queues, external APIs
+--------------------------+
```

Typical request flow:

```text
HTTP Request
    |
    v
Controller
    |
    v
Application service
    |
    v
Domain logic
    |
    v
Repository / external provider
```

### Example

For “place order”:

- **Presentation:** reads and validates the HTTP request.
- **Application:** coordinates placing an order.
- **Domain:** verifies order rules, such as stock and permitted state changes.
- **Infrastructure:** saves data and calls external systems.

### Pros

- Familiar and easy for new developers to understand.
- Separates HTTP and database code from business rules.
- Works well in modular monoliths.
- Easier to test the domain and application layers than an unstructured application.

### Cons

- Teams can put business logic into controllers or repositories by mistake.
- Dependencies often point downward toward infrastructure.
- Domain logic may become coupled to database frameworks or external SDKs.
- Cross-cutting concerns can be repeated across layers.

### Problem left behind

When domain logic directly depends on databases, HTTP frameworks, queues, or payment SDKs, it is still hard to test and change.

For example:

```text
Order rules -> PostgreSQL library
Order rules -> Payment provider SDK
Order rules -> HTTP framework types
```

This creates a dependency direction problem. The business rules—the most valuable part—depend on volatile technical details.

---

# Solution 4: Hexagonal / Clean Architecture

**Hexagonal architecture**, also called **ports and adapters**, organizes a system so that business logic does not depend directly on external technology.

**Clean architecture** has the same key idea: dependencies point inward toward stable business rules.

```text
             External world

  HTTP API       Database       Payment Provider
     |               |                |
     v               v                v
+------------------------------------------------+
| Adapters                                       |
| Controllers | SQL Repository | Payment Client  |
+------------------------+-----------------------+
                         |
                         v
+------------------------------------------------+
| Ports                                          |
| OrderRepository | PaymentGateway               |
+------------------------+-----------------------+
                         |
                         v
+------------------------------------------------+
| Application and Domain                          |
| Place order | pricing rules | order state       |
+------------------------------------------------+
```

### Key terms

| Term | Meaning |
|---|---|
| Core | The domain and application logic |
| Port | An interface the core needs or provides |
| Adapter | Code that connects a port to a technology |
| Driving adapter | Starts work, such as an HTTP controller or queue consumer |
| Driven adapter | Used by the core, such as a database repository or payment client |

### Example dependency direction

```text
HTTP controller
      |
      v
PlaceOrder use case
      |
      v
PaymentGateway interface (port)
      ^
      |
Payment provider adapter
```

The use case depends on the `PaymentGateway` interface, not on a specific payment provider SDK. This makes the business flow testable with a safe fake implementation.

### Security benefit

Security-sensitive checks belong close to the application/domain boundary:

```text
Request -> Authentication -> Authorization -> Use case -> Adapter
```

Do not assume a controller is the only entry point. The same use case could later be triggered by:

- An HTTP API,
- A queue message,
- A scheduled job,
- An administrative tool.

Authorization must be applied consistently at the appropriate boundary for each entry point.

### Pros

- Business logic is isolated from frameworks and vendors.
- Easier unit testing without databases or network calls.
- External providers can be replaced with lower impact.
- Strong fit for complex business domains.
- Encourages explicit boundaries and dependency inversion.

### Cons

- More interfaces, files, and indirection.
- Can be excessive for a simple CRUD application.
- Poor naming can make navigation difficult.
- Does not remove the operational cost of a single deployable monolith.

### Problem left behind

A clean modular application may still have requirements that cannot be met effectively in one deployment:

- Catalog traffic is 100 times greater than order traffic.
- Payment changes need a separate release process.
- Different teams need independent deployment ownership.
- A failure in notifications must not affect checkout.

This is where **microservices** may be considered.

---

# Solution 5: Microservices

A **microservices architecture** splits a system into independently deployable services aligned with business capabilities.

```text
                 +----------------+
                 | Web / Mobile   |
                 +----------------+
                    |         |
       +------------+         +------------+
       v                                   v
+--------------+                    +--------------+
| Catalog      |                    | Orders       |
| Service      |                    | Service      |
+--------------+                    +--------------+
       |                                   |
       v                                   v
+--------------+                    +--------------+
| Catalog DB   |                    | Orders DB    |
+--------------+                    +--------------+
                                            |
                                            v
                                     +--------------+
                                     | Payments     |
                                     | Service      |
                                     +--------------+
                                            |
                                            v
                                     +--------------+
                                     | Payments DB  |
                                     +--------------+
```

### Key rule: each service owns its data

Avoid this:

```text
Orders service -> writes directly to Payments database
```

Prefer this:

```text
Orders service -> authenticated API or event -> Payments service
```

Direct cross-service database access bypasses business rules, weakens service ownership, and makes independent change difficult.

### Pros

- Services can be deployed independently.
- Services can scale independently.
- Teams can own clear business capabilities.
- A failure can be isolated if designed carefully.
- Different services can use different technology when justified.

### Cons

- Network calls fail, time out, duplicate, and arrive out of order.
- Distributed data consistency is much harder.
- Requires strong observability: logs, traces, metrics, alerts.
- Requires secure service-to-service authentication and authorization.
- More CI/CD pipelines, infrastructure, deployment configuration, and incident response.
- Local development and testing become more complex.
- Usually costs more to run.

### Security requirements

Microservices expand the attack surface. Secure designs need:

```text
Service A
   |
   | mTLS / HTTPS + short-lived service identity
   v
Service B
   |
   +--> validates caller identity
   +--> authorizes requested operation
   +--> validates input
   +--> logs security-relevant events safely
```

At minimum:

- Encrypt all service traffic with TLS.
- Use workload identities and short-lived credentials; do not hardcode API keys.
- Authorize every service-to-service action.
- Restrict network access with deny-by-default rules.
- Never trust an internal network by default.
- Propagate correlation IDs for incident investigation, but do not put personal data or secrets in logs.

### When microservices are justified

Choose microservices only when there is a concrete benefit such as:

- Independent scaling is required.
- Independent deployments are a proven bottleneck.
- Teams have clear and stable domain ownership.
- One area requires distinct reliability or compliance isolation.
- The organization can operate distributed systems well.

### Problem left behind

Microservices turn in-process calls into unreliable network communication.

A synchronous chain can become fragile:

```text
Web -> Orders -> Inventory -> Payments -> Notifications
```

If Notifications is slow or unavailable, should placing an order fail? Usually, no.

This leads to event-driven architecture.

---

# Solution 6: Event-Driven Architecture

In an **event-driven architecture**, a component publishes an event after something meaningful happens. Other components react asynchronously.

```text
+----------------+
| Orders Service |
+----------------+
        |
        | OrderPlaced event
        v
+----------------+
| Message Broker |
+----------------+
   |          |
   v          v
Inventory   Notifications
Service      Service
```

An event describes a fact in the past:

```text
OrderPlaced
PaymentCaptured
ProductPriceChanged
```

A command asks for work:

```text
ReserveInventory
SendOrderConfirmation
CapturePayment
```

### Pros

- Reduces direct runtime coupling.
- Services can react independently.
- Better resilience when non-critical downstream work is delayed.
- Supports asynchronous workloads and integration.
- Enables audit-friendly event streams when designed carefully.

### Cons

- Data becomes **eventually consistent**.
- Messages can be duplicated, delayed, or delivered out of order.
- Debugging requires distributed tracing and good monitoring.
- Event schema changes need compatibility rules.
- Sensitive information can spread widely if event payloads are not minimized.

### Reliable event processing

Assume every message can be delivered more than once.

```text
Receive event
    |
    v
Validate schema and authorization context
    |
    v
Has event ID already been processed?
    |                    |
   Yes                  No
    |                    |
 Ignore             Process safely
                         |
                         v
                    Record event ID
```

Important practices:

- Include a unique event ID.
- Make consumers **idempotent**: safely process the same event multiple times.
- Validate event schemas.
- Minimize personal and sensitive data in events.
- Encrypt transport with TLS.
- Restrict topic permissions: publishers and consumers receive only needed access.
- Use a dead-letter queue for messages that repeatedly fail.
- Monitor consumer lag and failed-message rates.

### Problem left behind

Events help services react independently, but they do not automatically coordinate a multi-step business process.

Example order workflow:

```text
Order created
   -> reserve inventory
   -> charge payment
   -> arrange shipment
```

If payment fails after inventory is reserved, how should the system recover? This leads to **sagas**.

---

# Solution 7: Sagas for Distributed Workflows

A **saga** coordinates a business workflow across multiple services without using one database transaction across all of them.

```text
Create order
    |
    v
Reserve inventory
    |
    v
Capture payment
    |
    v
Create shipment
```

If a later step fails, the saga runs a **compensating action**.

```text
Reserve inventory -> Capture payment fails
        |
        v
Release reserved inventory
```

### Choreography

Services react to events without one central coordinator.

```text
OrderPlaced -> Inventory reserves stock
InventoryReserved -> Payments captures payment
PaymentCaptured -> Shipping creates shipment
```

- **Pros:** fewer central dependencies; simple for short flows.
- **Cons:** flow becomes difficult to understand when many services react.

### Orchestration

A workflow coordinator tells each service what to do.

```text
Order Saga Coordinator
      |
      +--> Reserve inventory
      +--> Capture payment
      +--> Create shipment
```

- **Pros:** workflow is explicit and easier to observe.
- **Cons:** coordinator becomes important infrastructure and must be reliable.

### Important limitation

A compensating action is not always a perfect undo.

For example, if a customer sees a confirmation email, “unsending” it may be impossible. Design workflows around clear states:

```text
pending -> inventory_reserved -> paid -> shipped
                     |
                     v
                  cancelled
```

### Problem left behind

Some systems need optimized read models or a complete history of state changes. Traditional CRUD models can become hard to scale or audit for those cases. This leads to CQRS and, sometimes, event sourcing.

---

# Solution 8: CQRS and Event Sourcing

## CQRS: Command Query Responsibility Segregation

**CQRS** separates operations that change data (**commands**) from operations that read data (**queries**).

```text
Command side                     Query side

PlaceOrder                       GetOrderHistory
    |                                  |
    v                                  v
Write model                      Read model
    |                                  |
    +-------- event/update ----------->+
```

### Pros

- Read models can be optimized for screens and reports.
- Complex business write rules remain separate from read concerns.
- Can scale reads independently from writes.

### Cons

- More moving parts.
- Read data can be temporarily stale.
- More difficult for simple CRUD applications.
- Requires careful authorization on both read and write paths.

## Event Sourcing

**Event sourcing** stores state changes as immutable events rather than only storing current state.

Instead of:

```text
Order:
status = "paid"
total = 4999
```

Store:

```text
OrderCreated
ItemAdded
PaymentAuthorized
PaymentCaptured
```

Current order state is rebuilt by replaying events.

```text
OrderCreated -> ItemAdded -> PaymentCaptured -> Current state: paid
```

### Pros

- Complete history and audit trail.
- Can recreate past state.
- Supports event-driven integrations naturally.
- Useful where history is central to the business domain.

### Cons

- Harder data evolution and event-versioning requirements.
- Event replay and projections add complexity.
- Sensitive data retention and deletion become challenging.
- Not appropriate merely because “events are modern.”

### Security and privacy warning

Do not put secrets, payment card information, or unnecessary personal data in immutable events. Events may be copied to backups, brokers, analytics systems, and multiple consumers.

For privacy requirements, store minimal references and use carefully designed deletion/redaction processes where legally required.

---

# Solution 9: Serverless

**Serverless** uses managed execution environments such as functions triggered by HTTP requests, schedules, queues, or storage events.

```text
HTTP Request -> API Gateway -> Function -> Managed Database
                                |
Queue Message ------------------+
```

### Pros

- Low infrastructure-management effort.
- Automatically scales for many short-lived workloads.
- Pay-per-use can be cost-effective for unpredictable or low traffic.
- Good for event handlers, scheduled jobs, file processing, and lightweight APIs.

### Cons

- Vendor-specific deployment and operational model.
- Cold starts may affect latency.
- Execution-time and resource limits.
- Local testing can differ from production.
- Complex workflows can become fragmented across many functions.

### When to use it

Good fit:

- Image/file processing.
- Scheduled cleanup or reporting jobs.
- Queue consumers.
- Webhooks.
- Small event-driven automation.

Less suitable:

- Long-running workloads.
- Systems requiring consistently low latency.
- Large, strongly connected business domains where functions would become scattered.

---

# Architecture Style Decision Guide

| Situation | Recommended starting point |
|---|---|
| Small product, small team, early stage | **Monolith** |
| Most business applications | **Modular monolith** |
| Need clearer separation inside an application | **Layered architecture** |
| Complex business rules, external integrations, strong testability needs | **Hexagonal / clean architecture** |
| Independent deployment and scaling are proven requirements | **Microservices** |
| Components need to react independently to business changes | **Event-driven architecture** |
| Multiple services coordinate a long-running business process | **Saga** |
| Read and write workloads have very different needs | **CQRS** |
| Complete, auditable state history is core to the domain | **Event sourcing**, selectively |
| Short, event-triggered workloads with variable traffic | **Serverless** |

---

# Recommended Progression

Avoid choosing the most complex style first.

```text
Unstructured application
        |
        v
Modular monolith
        |
        v
Layered + hexagonal boundaries where useful
        |
        v
Events for asynchronous work
        |
        v
Extract a service only when a specific boundary needs it
```

This progression preserves simplicity while leaving room for growth.

---

# Key Takeaways

- A monolith is a valid architecture, not a failure.
- A **modular monolith** is the best default for many systems.
- **Layered architecture** separates technical responsibilities.
- **Hexagonal/clean architecture** isolates business rules from infrastructure.
- **Microservices** solve independent scaling and deployment problems, but introduce distributed-systems complexity.
- **Events** improve decoupling but require idempotency, schema discipline, and observability.
- **CQRS**, **event sourcing**, and **serverless** solve specialized problems; do not adopt them by default.
- Security must be enforced at every boundary: validate input, authenticate callers, authorize each action and resource, encrypt traffic, apply least privilege, and avoid secrets or sensitive data in logs and events.

**Next topic: 2.3 Design principles** — SOLID, DRY, KISS, YAGNI, separation of concerns, coupling, and cohesion.

---
# 2.3 Design Principles

Design principles help keep code understandable, testable, secure, and easy to change.

They are not strict laws. Use them to make code simpler—not to add unnecessary abstractions.

---

## Problem: Code Becomes Hard to Change

Without design principles, code often grows like this:

```text
One function
  ├─ validates request
  ├─ checks permissions
  ├─ calculates price
  ├─ saves data
  ├─ sends email
  └─ calls external APIs
```

Problems appear over time:

- Changing one feature breaks another.
- Logic is duplicated.
- Tests need databases, networks, and many setup steps.
- Security checks are inconsistent.
- Developers avoid changing risky code.
- New requirements create increasingly large functions and classes.

Design principles reduce these risks by making responsibilities and dependencies explicit.

---

# Solution 1: Separation of Concerns

**Separation of concerns** means each part of the system focuses on one kind of responsibility.

For example:

```text
HTTP layer        → request parsing and HTTP responses
Application layer → coordinates a use case
Domain layer      → business rules
Data layer        → persistence
Infrastructure    → email, payment, queues, external APIs
```

```text
HTTP Request
    |
    v
Controller ──> Place Order Use Case ──> Order Repository
                       |
                       └──────────────> Payment Gateway
```

The controller should not contain pricing rules. The repository should not decide whether an order is valid. The payment adapter should not decide who is authorized to place an order.

### Pros

- Easier to understand where code belongs.
- Easier to test business rules independently.
- Reduces duplicated behavior.
- Helps enforce security consistently at boundaries.
- Makes replacing infrastructure safer.

### Cons

- More files and structure.
- Can become excessive in a tiny application.
- Teams may disagree about where a responsibility belongs.

### Problem left behind

Even with separate concerns, one class may still handle too many responsibilities within its own layer.

This leads to the **Single Responsibility Principle**.

---

# Solution 2: SOLID Principles

SOLID is a group of five object-oriented design principles. They are useful in TypeScript when applied pragmatically.

---

## S — Single Responsibility Principle (SRP)

A module should have **one reason to change**.

Bad example:

```text
OrderService
  ├─ calculates totals
  ├─ saves orders
  ├─ sends confirmation emails
  └─ creates PDF invoices
```

This class changes when pricing changes, database behavior changes, email templates change, or invoice requirements change.

Better:

```text
OrderPricing       → calculates totals
OrderRepository    → persists orders
OrderConfirmation  → sends messages
InvoiceGenerator   → creates invoices
```

### Pros

- Smaller, clearer units.
- Safer changes.
- Easier unit testing.
- Reduces accidental security regressions in unrelated code.

### Cons

- Too much splitting can make navigation difficult.
- “One responsibility” is about a cohesive reason to change, not one method per class.

### Weakness left behind

Separate classes still need to collaborate. If they directly depend on specific implementations, changes remain difficult.

This leads to dependency-focused principles.

---

## O — Open/Closed Principle (OCP)

Code should be **open for extension, closed for modification** where change is expected.

For example, a shipping-cost calculation should support new delivery methods without repeatedly editing a growing `if` statement.

```text
Before:
calculateShipping(method)
  ├─ if standard
  ├─ if express
  ├─ if pickup
  └─ if international
```

Better:

```text
ShippingCalculator interface
  ├─ StandardShippingCalculator
  ├─ ExpressShippingCalculator
  └─ PickupShippingCalculator
```

### Pros

- New behavior can be added with less risk to existing behavior.
- Reduces large conditional blocks in areas that change often.
- Supports focused tests.

### Cons

- Adding interfaces for every possible future change is overengineering.
- More abstractions can obscure simple logic.

### Use it when

Use OCP when variations are real and likely to grow: payment methods, notification channels, file-storage providers, or tax policies.

Do not use it for a one-time two-line condition with no realistic expected extension.

---

## L — Liskov Substitution Principle (LSP)

A replacement implementation must preserve the expectations of the abstraction.

If code accepts a `PaymentGateway`, every implementation must behave like a valid payment gateway.

Bad substitution:

```text
PaymentGateway
  ├─ CardPaymentGateway: captures payment
  └─ DisabledPaymentGateway: silently reports success without recording anything
```

The second implementation violates caller expectations. An order may become “paid” without a payment being recorded.

A safe replacement must preserve the contract:

```text
PaymentGateway
  ├─ CardPaymentGateway
  └─ TestPaymentGateway
```

Both should return a clear success or failure result and preserve idempotency expectations.

### Pros

- Prevents surprising implementations.
- Makes interfaces safer and easier to use.
- Improves reliability of tests and adapters.

### Cons

- Contracts must be documented clearly.
- TypeScript’s structural typing checks shape, not behavioral correctness.

### Security relevance

Never substitute a security control with a weaker implementation in production. For example, a fake authorization service must only be available in test environments, never selected through user-controlled configuration.

---

## I — Interface Segregation Principle (ISP)

Clients should not depend on methods they do not need.

Bad:

```text
UserRepository
  ├─ findById()
  ├─ create()
  ├─ delete()
  ├─ resetPassword()
  ├─ exportAllUsers()
  └─ impersonateUser()
```

A read-only reporting feature should not receive an interface that includes destructive or privileged operations.

Better:

```text
UserReader
  └─ findById()

UserWriter
  └─ create()

UserAdministration
  └─ delete()
  └─ exportAllUsers()
```

### Pros

- Smaller, clearer dependencies.
- Supports least privilege.
- Reduces accidental misuse of powerful capabilities.
- Makes mocks and tests smaller.

### Cons

- Too many tiny interfaces can become noisy.
- Interfaces should represent real caller needs, not arbitrary method grouping.

### Security relevance

Interface segregation supports **least privilege**. A component that only reads orders should not have access to refund, delete, or export operations.

---

## D — Dependency Inversion Principle (DIP)

High-level business rules should depend on abstractions, not low-level technical details.

Bad:

```text
PlaceOrderUseCase
       |
       v
PostgresOrderRepository
       |
       v
PostgreSQL
```

Better:

```text
PlaceOrderUseCase
       |
       v
OrderRepository interface
       ^
       |
PostgresOrderRepository
       |
       v
PostgreSQL
```

The core application depends on an interface. Infrastructure implements it.

### Pros

- Easier testing without databases or networks.
- Infrastructure can be replaced with lower impact.
- Business logic remains focused on business rules.
- Enables clean or hexagonal architecture.

### Cons

- Adds indirection.
- An abstraction is not useful if only one simple implementation will ever exist.
- Poorly designed interfaces can leak database or framework details.

---

## One TypeScript Example: Focused Responsibilities and Least Privilege

```typescript name=src/orders/application/place-order.ts
export type AuthenticatedUser = Readonly<{
  userId: string;
  permissions: readonly string[];
}>;

export type PlaceOrderInput = Readonly<{
  productId: string;
  quantity: number;
}>;

export type Order = Readonly<{
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  totalCents: number;
  status: "pending";
}>;

// ISP + DIP: the use case needs only this minimal capability.
export interface ProductCatalog {
  getPurchasableProduct(productId: string): Promise<{
    id: string;
    unitPriceCents: number;
    availableQuantity: number;
  } | null>;
}

export interface OrderWriter {
  create(order: Order): Promise<void>;
}

export interface IdGenerator {
  create(): string;
}

export class ValidationError extends Error {}
export class ForbiddenError extends Error {}
export class ProductUnavailableError extends Error {}

export class PlaceOrder {
  public constructor(
    private readonly products: ProductCatalog,
    private readonly orders: OrderWriter,
    private readonly ids: IdGenerator,
  ) {}

  public async execute(
    actor: AuthenticatedUser,
    input: PlaceOrderInput,
  ): Promise<Order> {
    // Authorization: deny by default.
    if (!actor.permissions.includes("orders:create")) {
      throw new ForbiddenError("You are not allowed to create orders.");
    }

    // Validation: never trust incoming data.
    if (
      !Number.isSafeInteger(input.quantity) ||
      input.quantity < 1 ||
      input.quantity > 100
    ) {
      throw new ValidationError("Quantity must be an integer between 1 and 100.");
    }

    const product = await this.products.getPurchasableProduct(input.productId);

    if (product === null || product.availableQuantity < input.quantity) {
      // Avoid exposing internal inventory details unnecessarily.
      throw new ProductUnavailableError("The requested product is unavailable.");
    }

    const order: Order = {
      id: this.ids.create(),
      customerId: actor.userId,
      productId: product.id,
      quantity: input.quantity,
      totalCents: product.unitPriceCents * input.quantity,
      status: "pending",
    };

    await this.orders.create(order);
    return order;
  }
}
```

This example applies several principles:

- **SRP:** `PlaceOrder` coordinates only the order-placement use case.
- **Separation of concerns:** HTTP, database, and payment-provider details are absent.
- **ISP:** it uses narrow interfaces: `ProductCatalog`, `OrderWriter`, and `IdGenerator`.
- **DIP:** business logic depends on interfaces, not PostgreSQL or a framework.
- **Security:** it validates input and requires explicit `orders:create` permission.

---

# Solution 3: DRY — Don’t Repeat Yourself

**DRY** means each important piece of knowledge should have one authoritative representation.

Bad:

```text
Discount formula exists in:
  ├─ checkout page
  ├─ order API
  ├─ invoice generator
  └─ reporting job
```

When a discount rule changes, one location may be forgotten.

Better:

```text
Pricing policy
   |
   +--> checkout
   +--> order creation
   +--> invoice generation
```

### Pros

- Fewer inconsistent rules.
- Smaller maintenance cost.
- Security fixes are less likely to be missed.
- Better test coverage around shared rules.

### Cons

- Forced reuse creates unhealthy coupling.
- Similar code is not always duplicated knowledge.
- A shared utility can become a vague “common” dumping ground.

### Important distinction

Do not combine code merely because it looks similar.

```text
Similar syntax ≠ same business rule
```

For example, “customer address validation” and “supplier address validation” may look alike today but can have different rules later. Share only stable, genuinely common concepts.

### Problem left behind

Avoiding duplication can cause overly abstract shared code. This is often more difficult to understand than small duplication.

That leads to KISS.

---

# Solution 4: KISS — Keep It Simple

**KISS** means choose the simplest design that correctly meets today’s requirements.

Simple does not mean careless. It means avoiding unnecessary layers, patterns, services, configuration, and abstractions.

Bad:

```text
Simple internal settings page
    |
    v
Microservices + event sourcing + CQRS + 12 abstractions
```

Better:

```text
Simple internal settings page
    |
    v
One protected API endpoint + validated database update
```

### Pros

- Faster development.
- Easier onboarding.
- Fewer operational risks.
- Lower cost.
- Smaller attack surface.
- Easier debugging and testing.

### Cons

- A too-simple design may become insufficient as requirements grow.
- “Simple” must not mean skipping validation, authorization, logging, backups, or tests.

### Security note

Security controls are not optional complexity. For example, authorization checks and secure secret handling are necessary even in a small system.

```text
Simple securely designed system
≠
System with security features removed
```

### Problem left behind

Teams may still build abstractions for hypothetical future needs, even when the current design is simple.

That leads to YAGNI.

---

# Solution 5: YAGNI — You Aren’t Gonna Need It

**YAGNI** means do not build functionality until there is a real requirement.

Examples of premature work:

- Supporting five payment providers before the first customer exists.
- Creating plugin systems with no plugin requirement.
- Building multi-region deployment for an internal tool used by one office.
- Introducing microservices “for future scale.”
- Adding dozens of configuration options without users who need them.

### Pros

- Reduces wasted code.
- Keeps the codebase smaller.
- Avoids speculative abstractions.
- Reduces security and maintenance burden.
- Allows decisions to be based on real usage.

### Cons

- Requires willingness to implement a new capability later.
- Can be misused to reject legitimate near-term requirements.
- Requires good modular boundaries so future change remains possible.

### Balanced approach

YAGNI does **not** mean writing code that cannot evolve.

Good approach:

```text
Build only the required feature,
but keep clear module boundaries and tests
so future changes are safe.
```

For example, do not build five payment integrations now. But isolate the one payment integration behind a clear boundary if changing it later would otherwise be expensive.

---

# Coupling and Cohesion

These are two of the most useful ways to evaluate design quality.

## Coupling: How much modules depend on each other

**High coupling** means one module knows too much about another.

```text
Orders module
   |
   +--> Reads Payments tables
   +--> Uses Payment provider SDK directly
   +--> Depends on Notification email templates
```

This makes changes risky.

**Low coupling** means modules interact through small, stable contracts.

```text
Orders module
   |
   +--> PaymentGateway interface
   +--> OrderPlaced event
```

### Prefer low coupling

Benefits:

- Safer independent changes.
- Easier testing.
- Fewer cascading failures.
- Better security boundaries.
- Easier eventual extraction into services, if needed.

---

## Cohesion: How closely related a module’s responsibilities are

**High cohesion** means a module contains responsibilities that belong together.

```text
Orders module
  ├─ create order
  ├─ validate allowed order-state transitions
  └─ calculate order total
```

**Low cohesion** means unrelated work is mixed together.

```text
Utility module
  ├─ calculate order total
  ├─ upload profile photo
  ├─ send password-reset email
  └─ parse CSV import
```

### Prefer high cohesion

```text
Good design = high cohesion + low coupling
```

```text
+-------------------+       small, explicit contract       +-------------------+
| Orders module     | -----------------------------------> | Payments module   |
| related order     |                                      | related payment   |
| responsibilities  |                                      | responsibilities  |
+-------------------+                                      +-------------------+
```

---

# When to Choose Which

| Problem | Principle to apply |
|---|---|
| A class or function does unrelated jobs | **SRP** and **separation of concerns** |
| A feature has real variations that will grow | **OCP** |
| An implementation breaks caller expectations | **LSP** |
| A dependency has excessive permissions or methods | **ISP** |
| Business rules depend directly on frameworks or databases | **DIP** |
| One business rule exists in multiple places | **DRY** |
| The design has unnecessary layers or technology | **KISS** |
| Code is being built for hypothetical requirements | **YAGNI** |
| Modules are tightly interconnected | Reduce **coupling** |
| A module mixes unrelated responsibilities | Increase **cohesion** |

---

# Practical Decision Order

When designing or reviewing code, ask these questions in order:

```text
1. What single responsibility does this module have?
2. Does it depend only on the capabilities it truly needs?
3. Are permissions and trust boundaries explicit?
4. Is business knowledge duplicated?
5. Is this abstraction solving a real current problem?
6. Could the design be simpler without weakening security or correctness?
7. Can this change be tested without unnecessary infrastructure?
```

---

# Key Takeaways

- **Separation of concerns** places each responsibility in the right area.
- **SOLID** helps keep modules focused, replaceable, and testable.
- **DRY** prevents duplicated business knowledge, not every repeated line.
- **KISS** reduces complexity and attack surface.
- **YAGNI** prevents speculative features and abstractions.
- Prefer **high cohesion** inside modules and **low coupling** between them.
- Apply security as a core design concern: validate inputs, deny access by default, keep dependencies least-privileged, and do not weaken production security for convenience.

**Next topic: 2.4 Design patterns** — creational, structural, behavioral, GoF patterns, and enterprise patterns..

---
# 2.4 Design Patterns

**Design patterns** are reusable solutions to common software-design problems.

They are not copy-paste code and not rules. A pattern describes:

- A recurring problem.
- A proven structure to solve it.
- The benefits and trade-offs.
- When it is appropriate.

Use patterns only when they make the design clearer. A pattern that adds unnecessary classes or interfaces is worse than simple direct code.

---

## Problem: Repeating Common Design Mistakes

Applications frequently face similar problems:

- How can object creation vary without editing business logic?
- How can code work with different external providers?
- How can one change notify many parts of the system?
- How can a complex workflow be kept understandable?
- How can legacy and modern interfaces work together?

Without patterns, developers often use large `if` statements, tightly coupled dependencies, or large classes that control everything.

```text
Checkout service
  ├─ decides which payment provider to use
  ├─ calls provider-specific APIs
  ├─ formats provider-specific errors
  ├─ sends notifications
  └─ updates inventory
```

This works initially, but each new payment method or downstream action makes the class riskier to change.

---

# Solution 1: Creational Patterns

**Creational patterns** manage how objects are created.

They help when creating an object requires logic, configuration, validation, or selecting among implementations.

```text
Application
    |
    v
Object creation strategy
    |
    +--> correct implementation
```

---

## Factory

A **factory** creates an object without making the caller depend on its exact class.

```text
Payment method
    |
    +--> Card gateway
    +--> Bank transfer gateway
    +--> Invoice gateway
```

Instead of this:

```text
Checkout -> new SpecificPaymentProviderSdk(...)
```

Use this idea:

```text
Checkout -> PaymentGatewayFactory -> PaymentGateway
```

### Pros

- Keeps creation logic in one place.
- Reduces dependency on concrete implementations.
- Supports adding real variations more safely.
- Makes configuration and validation easier to centralize.

### Cons

- Adds indirection.
- Unnecessary if there is only one implementation and no expected variation.
- A factory with a large unvalidated `switch` can become another source of errors.

### Security note

Never allow a client request to choose arbitrary implementation names or classes. Keep provider selection server-controlled and allow-listed.

---

## Builder

A **builder** constructs complex objects step by step.

Useful when an object has many optional fields or requires validation before it becomes valid.

```text
Order draft
   |
   +--> add item
   +--> add shipping address
   +--> select payment method
   |
   v
Validated order
```

### Pros

- Improves readability for complex construction.
- Can validate required fields before producing an object.
- Avoids constructors with many positional arguments.

### Cons

- Too much ceremony for small objects.
- Can hide validation if the final `build()` step is not carefully designed.

### Problem left behind

Factories and builders solve creation problems. They do not help when existing components have incompatible interfaces.

That leads to structural patterns.

---

# Solution 2: Structural Patterns

**Structural patterns** describe how classes or modules are connected.

They help combine existing code while keeping dependencies understandable.

```text
Application
    |
    v
Structure between components
    |
    +--> adapters
    +--> wrappers
    +--> composed services
```

---

## Adapter

An **adapter** translates one interface into another.

This is especially useful for external APIs and legacy code.

```text
Application expects:         External provider offers:

PaymentGateway              VendorPaymentSdk
capturePayment()            submitCharge()
```

```text
Application
    |
    v
PaymentGateway interface
    |
    v
Provider adapter
    |
    v
Vendor SDK
```

The application stays independent from provider-specific method names and response formats.

### Pros

- Isolates third-party and legacy dependencies.
- Makes provider replacement easier.
- Centralizes response mapping, error handling, timeouts, and logging.
- Improves testability.

### Cons

- Does not remove limitations of the external system.
- Poor adapters can leak provider-specific details into the application.
- Requires maintenance when the provider API changes.

### Security note

An adapter is a good place to enforce safe outbound behavior:

- Use HTTPS.
- Apply strict request timeouts.
- Avoid logging access tokens, card data, or full customer details.
- Validate provider responses before trusting them.
- Use idempotency keys for payment-like operations.

---

## Facade

A **facade** provides a simpler interface over a complicated subsystem.

```text
Before:

Checkout
  ├─ inventory reservation
  ├─ payment authorization
  ├─ tax calculation
  ├─ order persistence
  └─ confirmation notification
```

```text
After:

Checkout
    |
    v
OrderPlacementFacade
    |
    +--> Inventory
    +--> Payments
    +--> Tax
    +--> Orders
    +--> Notifications
```

### Pros

- Gives callers a simple, focused entry point.
- Reduces knowledge of internal details.
- Makes workflows easier to discover and use.

### Cons

- A facade can become a large “god object.”
- It should coordinate work, not contain every business rule.
- It may hide failures that callers need to handle explicitly.

---

## Decorator

A **decorator** adds behavior around an existing component without changing the component itself.

```text
Base service
    |
    +--> Logging decorator
            |
            +--> Caching decorator
                    |
                    +--> Actual implementation
```

Typical uses:

- Logging
- Metrics
- Caching
- Retry behavior
- Authorization checks

### Pros

- Adds cross-cutting behavior without modifying core code.
- Behaviors can be composed.
- Supports separation of concerns.

### Cons

- Too many decorators make execution flow difficult to follow.
- Ordering matters: caching before authorization can be a serious security bug.
- Error handling can become inconsistent if each decorator behaves differently.

### Security note

Authorization must happen **before** returning cached sensitive data. Cache entries must also be scoped to the authorized user, tenant, and permission context where applicable.

### Problem left behind

Structural patterns organize collaboration, but they do not define how components communicate as behavior changes over time.

That leads to behavioral patterns.

---

# Solution 3: Behavioral Patterns

**Behavioral patterns** organize communication and responsibilities between components.

They are useful when business behavior changes depending on state, rules, events, or algorithms.

```text
Business event or request
         |
         v
Behavior selected or notified
         |
         v
Relevant components act
```

---

## Strategy

A **strategy** represents interchangeable behavior behind a shared interface.

Example:

```text
Shipping calculation
    |
    +--> Standard shipping strategy
    +--> Express shipping strategy
    +--> Pickup strategy
```

The checkout flow uses a shipping-calculation contract. It does not need to know the details of every shipping method.

### Pros

- Removes growing conditional logic.
- Keeps each variation focused.
- Easy to test individual algorithms.
- Works well when variations are real and stable.

### Cons

- Adds types and files.
- Not useful for a simple condition with no expected growth.
- Strategy selection still needs safe, explicit rules.

### When to use

Use it for genuine variations such as:

- Pricing rules
- Tax calculations
- Export formats
- Notification channels
- Authentication methods

---

## Observer / Publish-Subscribe

The **observer pattern** allows one component to notify others that something happened.

```text
Order placed
    |
    v
OrderPlaced event
    |
    +--> notify customer
    +--> update analytics
    +--> reserve inventory
```

In a single application, this can be an in-memory event handler. In distributed systems, it often becomes a message broker topic.

### Pros

- Reduces direct dependency between the sender and recipients.
- New reactions can be added without modifying the publisher.
- Useful for non-blocking or secondary work.

### Cons

- Execution flow becomes less obvious.
- Handlers can fail, run twice, or run later.
- Too many event handlers make behavior hard to trace.
- Event payloads can accidentally expose sensitive data.

### Security and reliability rules

- Put only necessary data in events.
- Do not include passwords, secrets, access tokens, or payment card data.
- Authenticate and authorize publishers and consumers.
- Use unique event IDs and idempotent handlers.
- Log event IDs and correlation IDs, not sensitive payloads.
- Monitor failures and dead-letter queues.

---

## State

The **state pattern** represents valid behavior based on an object’s current state.

```text
Order state:

pending -> paid -> shipped
   |        |
   v        v
cancelled  refunded
```

Rather than allowing every action at every time, the system permits only valid transitions.

```text
pending order
  ├─ pay
  └─ cancel

shipped order
  └─ refund request
```

### Pros

- Makes valid transitions explicit.
- Prevents invalid operations.
- Easier to test business workflows.
- Useful for orders, invoices, support tickets, subscriptions, and approvals.

### Cons

- Can introduce many classes for a small workflow.
- A simple transition table may be clearer for basic cases.

### Problem left behind

Patterns make local code easier to manage, but enterprise applications also need patterns for larger concerns: data access, transactions, integration, and distributed workflows.

That leads to enterprise patterns.

---

# Solution 4: Enterprise Patterns

**Enterprise patterns** solve common application and integration problems at system scale.

---

## Repository

A **repository** provides a collection-like interface for loading and saving domain objects.

```text
Application use case
        |
        v
OrderRepository
        |
        v
Database implementation
```

### Pros

- Keeps database details outside business logic.
- Supports testing with controlled implementations.
- Centralizes persistence rules.

### Cons

- Can become a thin, unnecessary wrapper over an ORM for simple CRUD.
- Must not expose raw database queries everywhere.
- Avoid generic repositories that hide important domain queries.

---

## Unit of Work / Transaction Boundary

A **unit of work** groups related database changes so they either all succeed or all fail.

```text
Create order
    |
    +--> save order
    +--> reduce inventory
    +--> record audit entry
    |
    v
Commit transaction
```

If saving inventory fails, the order creation should normally also fail.

### Pros

- Maintains data consistency.
- Makes transaction boundaries explicit.
- Reduces partial writes.

### Cons

- Does not safely span independent services or external payment systems.
- Long transactions reduce throughput and can cause lock contention.

For cross-service workflows, use a **saga** and compensating actions instead of trying to create one distributed transaction.

---

## Circuit Breaker

A **circuit breaker** temporarily stops calls to an unhealthy external dependency.

```text
Orders API -> Payment provider fails repeatedly
                    |
                    v
             Circuit opens
                    |
                    v
     Fail quickly / use safe fallback
```

### Pros

- Prevents slow failures from exhausting application resources.
- Protects upstream services.
- Improves recovery when paired with timeouts and retries.

### Cons

- Requires careful tuning.
- Can reject requests while a dependency is recovering.
- A fallback must not weaken security or financial correctness.

For payments, a safe fallback is usually “payment pending; try later”—not “mark payment as successful.”

---

## Saga

A **saga** coordinates work across services when one database transaction is impossible.

```text
Create order
    |
    v
Reserve inventory
    |
    v
Capture payment
    |
    v
Create shipment
```

If payment capture fails:

```text
Release inventory reservation
```

### Pros

- Supports reliable multi-service workflows.
- Avoids distributed database transactions.
- Makes compensation logic explicit.

### Cons

- Eventual consistency.
- Compensation may not perfectly undo every action.
- Requires idempotency, monitoring, retries, and clear state handling.

---

# One TypeScript Example: Strategy + Adapter + Facade

This example uses:

- **Strategy** for shipping rules.
- **Adapter** to isolate an external payment provider.
- **Facade** to coordinate a checkout workflow.

```typescript name=src/checkout/application/checkout-facade.ts
export type CheckoutInput = Readonly<{
  customerId: string;
  productTotalCents: number;
  shippingMethod: "standard" | "express";
  paymentToken: string;
}>;

export type CheckoutResult = Readonly<{
  orderId: string;
  totalCents: number;
  paymentId: string;
}>;

export interface ShippingStrategy {
  readonly method: CheckoutInput["shippingMethod"];
  calculateCostCents(productTotalCents: number): number;
}

export class StandardShipping implements ShippingStrategy {
  public readonly method = "standard" as const;

  public calculateCostCents(): number {
    return 499;
  }
}

export class ExpressShipping implements ShippingStrategy {
  public readonly method = "express" as const;

  public calculateCostCents(productTotalCents: number): number {
    return productTotalCents >= 10_000 ? 0 : 1_499;
  }
}

// Adapter port: the checkout flow does not depend on a provider SDK.
export interface PaymentGateway {
  capture(input: {
    paymentToken: string;
    amountCents: number;
    idempotencyKey: string;
  }): Promise<{ paymentId: string }>;
}

export interface OrderWriter {
  create(input: {
    customerId: string;
    totalCents: number;
    paymentId: string;
  }): Promise<{ orderId: string }>;
}

export class ValidationError extends Error {}
export class PaymentError extends Error {}

export class CheckoutFacade {
  public constructor(
    private readonly shippingStrategies: readonly ShippingStrategy[],
    private readonly payments: PaymentGateway,
    private readonly orders: OrderWriter,
  ) {}

  public async checkout(input: CheckoutInput): Promise<CheckoutResult> {
    if (
      !Number.isSafeInteger(input.productTotalCents) ||
      input.productTotalCents < 0
    ) {
      throw new ValidationError("Product total must be a non-negative integer.");
    }

    // Payment tokens are sensitive: validate presence but never log their value.
    if (input.paymentToken.length < 10) {
      throw new ValidationError("A valid payment token is required.");
    }

    const shipping = this.shippingStrategies.find(
      (strategy) => strategy.method === input.shippingMethod,
    );

    // Allow-list supported server-side strategies.
    if (shipping === undefined) {
      throw new ValidationError("Unsupported shipping method.");
    }

    const totalCents =
      input.productTotalCents +
      shipping.calculateCostCents(input.productTotalCents);

    const idempotencyKey = crypto.randomUUID();

    try {
      const payment = await this.payments.capture({
        paymentToken: input.paymentToken,
        amountCents: totalCents,
        idempotencyKey,
      });

      const order = await this.orders.create({
        customerId: input.customerId,
        totalCents,
        paymentId: payment.paymentId,
      });

      return {
        orderId: order.orderId,
        totalCents,
        paymentId: payment.paymentId,
      };
    } catch (error) {
      // Return a safe, generic application error.
      // Log detailed diagnostics securely in infrastructure code.
      throw new PaymentError("Unable to complete checkout at this time.");
    }
  }
}
```

### Why this design is useful

```text
CheckoutFacade
    |
    +--> ShippingStrategy        (Strategy)
    |
    +--> PaymentGateway          (Adapter boundary)
    |
    +--> OrderWriter             (Repository-style boundary)
```

Security protections included:

- Validates monetary values as safe integers.
- Uses an allow-list for shipping methods.
- Does not log payment tokens.
- Uses an idempotency key to reduce duplicate payment risk.
- Returns a generic payment failure instead of exposing provider internals.
- Keeps the provider SDK outside application logic.

In production, the payment adapter should enforce HTTPS, timeouts, provider-response validation, and secure secret retrieval from a secret manager.

---

# When to Choose Which

| Problem | Pattern to consider |
|---|---|
| Object creation depends on configuration or selected provider | **Factory** |
| Creating an object needs several optional or validated steps | **Builder** |
| Existing or external interface does not match your application contract | **Adapter** |
| Callers need one simple entry point over a complicated workflow | **Facade** |
| Add logging, metrics, caching, or retries around a service | **Decorator** |
| Select among interchangeable business algorithms | **Strategy** |
| Notify independent components about something that happened | **Observer / pub-sub** |
| Business actions depend on lifecycle stage | **State** |
| Keep persistence details outside business logic | **Repository** |
| Keep related database writes consistent | **Unit of work / transaction** |
| Protect against repeatedly failing external dependencies | **Circuit breaker** |
| Coordinate a workflow across independent services | **Saga** |

---

# Pattern Selection Guide

Use this sequence:

```text
1. Is direct, simple code clear and sufficient?
       |
       +--> Yes: do not add a pattern.
       |
       +--> No
             |
             v
2. Is the problem about creating objects?
       |
       +--> Factory or Builder
       |
       v
3. Is it about connecting components?
       |
       +--> Adapter, Facade, or Decorator
       |
       v
4. Is it about changing behavior or workflow?
       |
       +--> Strategy, Observer, or State
       |
       v
5. Is it an application-wide data or integration concern?
       |
       +--> Repository, Transaction, Circuit Breaker, or Saga
```

---

# Key Takeaways

- Patterns solve recurring problems; they are not mandatory architecture.
- Start with simple code and introduce a pattern only when a real problem appears.
- **Creational patterns** manage object construction.
- **Structural patterns** organize how components connect.
- **Behavioral patterns** organize changing behavior and communication.
- **Enterprise patterns** solve persistence, resilience, and distributed-workflow concerns.
- Every pattern adds complexity, so apply **KISS** and **YAGNI**.
- Security belongs in pattern design: validate inputs, use allow-lists, apply least privilege, protect secrets, prevent duplicate operations, and avoid leaking internal details.

**Next topic: 2.5 Domain-Driven Design** — bounded contexts, aggregates, and ubiquitous language.

---
# 2.5 Domain-Driven Design (DDD)

**Domain-Driven Design** is an approach for building software around the real business problem—its rules, language, and boundaries.

DDD is most useful when the business rules are complex:

- Orders have many states.
- Pricing has exceptions.
- Payments need careful correctness.
- Inventory reservations expire.
- Different departments use the same words differently.

It is usually unnecessary for a simple CRUD application with few business rules.

---

## Problem: Technical Code Does Not Match the Business

Without a shared domain model, systems often grow around database tables and technical actions.

```text
orders table
    |
    v
OrderService
    |
    +--> updateStatus("paid")
    +--> updateStatus("shipped")
    +--> updateStatus("cancelled")
```

This creates problems:

- Business rules are hidden in controllers, SQL queries, and UI code.
- Different developers interpret terms differently.
- Invalid state changes become possible.
- The same concept is implemented differently across features.
- Business experts cannot easily validate the design.

For example, does “customer” mean:

- A person who registered?
- A person who placed an order?
- A company account?
- A billing contact?

The answer may differ across parts of the business.

---

# Solution 1: Ubiquitous Language

**Ubiquitous language** is a shared vocabulary used consistently by:

- Product owners
- Domain experts
- Designers
- Developers
- Testers
- Support teams

The language should appear in conversations, requirements, APIs, code, tests, and diagrams.

```text
Business language
       |
       v
Requirements, code, tests, APIs, dashboards
```

### Example

Avoid vague technical names:

```text
processData()
updateRecord()
handleRequest()
```

Prefer business-focused names:

```text
reserveInventory()
capturePayment()
cancelOrder()
releaseReservation()
```

A shared glossary might define:

| Term | Meaning |
|---|---|
| Order | A customer’s request to buy products |
| Reservation | Temporary hold on inventory for an order |
| Payment authorization | Approval to charge; money may not yet be captured |
| Payment capture | Final collection of authorized funds |
| Shipment | Physical delivery process after fulfillment |
| Cancellation | Ending an order before shipment |

### Pros

- Reduces misunderstandings.
- Makes code easier to read.
- Helps business stakeholders review behavior.
- Makes tests describe real business rules.
- Prevents vague “status” fields from hiding important meaning.

### Cons

- Requires ongoing discussion with domain experts.
- Terms can differ between departments.
- A single global vocabulary may become confusing in large systems.

### Problem left behind

The same word can validly mean different things in different parts of a business.

For example:

```text
"Customer"

Sales:       a potential buyer
Billing:     the legal entity that pays
Shipping:    delivery recipient
Support:     person opening a support ticket
```

Trying to force one meaning everywhere creates confusion. This leads to **bounded contexts**.

---

# Solution 2: Bounded Contexts

A **bounded context** is a clear boundary where a domain model and its language have one specific meaning.

```text
+-----------------------+
| Sales Context         |
| "Customer" = prospect |
+-----------------------+

+-----------------------+
| Billing Context       |
| "Customer" = payer    |
+-----------------------+

+-----------------------+
| Shipping Context      |
| "Customer" = recipient|
+-----------------------+
```

Within each context, the model should be internally consistent.

### Example: Order and payment contexts

```text
+--------------------+        +--------------------+
| Ordering Context   |        | Payments Context   |
|                    |        |                    |
| Order              |        | Payment            |
| OrderItem          | -----> | Authorization      |
| ShippingAddress    |        | Capture            |
+--------------------+        +--------------------+
```

The Ordering context knows an order needs payment confirmation. It does not need to understand the payment provider’s internal authorization codes, fraud checks, or settlement process.

### Context boundaries are not necessarily microservices

A bounded context can be:

- A module in a modular monolith.
- A separate service.
- A set of APIs.
- A defined ownership boundary in a larger application.

Start with a modular boundary unless independent deployment is a proven requirement.

```text
Modular monolith
   |
   +--> Orders module
   +--> Payments module
   +--> Inventory module
```

### Context mapping

A **context map** shows how bounded contexts interact.

```text
+-----------+    OrderPlaced event    +-----------+
| Orders    | ----------------------> | Inventory |
+-----------+                         +-----------+
      |
      | PaymentRequested command
      v
+-----------+
| Payments  |
+-----------+
```

Each context should communicate through explicit contracts:

- APIs
- Commands
- Events
- Versioned message schemas

Avoid direct database access across contexts:

```text
Bad:
Orders module -> reads Payments tables

Better:
Orders module -> Payments API or PaymentCaptured event
```

### Pros

- Reduces ambiguity.
- Creates clearer ownership.
- Prevents large, tangled domain models.
- Supports independent evolution.
- Strengthens security boundaries: each context can expose only necessary data and operations.

### Cons

- Requires careful contract design.
- Data may be duplicated across contexts.
- Cross-context reporting can be more complex.
- Over-splitting creates unnecessary communication overhead.

### Security note

Do not assume internal contexts are trusted by default. Every API or message boundary should:

- Authenticate the caller or workload identity.
- Authorize the requested action.
- Validate input schema and business constraints.
- Share only the minimum necessary data.
- Avoid including secrets, tokens, or unnecessary personal information in events.

### Problem left behind

Bounded contexts define where concepts belong, but they do not protect important business rules inside a context.

For example, an Order must not become “shipped” before it is paid. This leads to **aggregates**.

---

# Solution 3: Aggregates

An **aggregate** is a group of related domain objects treated as one consistency boundary.

Each aggregate has one main object called the **aggregate root**. Other code interacts with the aggregate only through that root.

```text
Order aggregate
   |
   +--> Order (aggregate root)
          |
          +--> Order items
          +--> Shipping address
          +--> Order status
```

The aggregate root protects important rules, called **invariants**.

### Example order invariants

An Order might enforce:

- Quantity must be positive.
- An order cannot contain duplicate product lines.
- A cancelled order cannot be paid.
- A shipped order cannot be cancelled.
- A payment can only be recorded once.
- Only the order owner or authorized staff can view or modify it.

```text
Order state

pending --> paid --> shipped
   |
   v
cancelled
```

Invalid transitions are rejected:

```text
cancelled -> paid      invalid
pending -> shipped     invalid
shipped -> cancel      invalid
```

### Aggregate boundaries should be small

A common mistake is putting too much inside one aggregate.

Bad:

```text
Store aggregate
  ├─ all customers
  ├─ all products
  ├─ all orders
  ├─ all payments
  └─ all inventory
```

This creates contention and makes updates slow.

Better:

```text
Customer aggregate
Product aggregate
Order aggregate
Payment aggregate
InventoryReservation aggregate
```

They can coordinate through identifiers and events:

```text
OrderPlaced
   |
   +--> Inventory reserves stock
   +--> Payments starts payment
```

### Pros

- Protects critical business invariants.
- Makes valid state transitions explicit.
- Improves testability.
- Creates natural transaction boundaries.
- Prevents unrelated code from changing internal state directly.

### Cons

- Choosing boundaries takes domain knowledge.
- Cross-aggregate workflows become eventually consistent.
- Large aggregates can create database locking and performance issues.
- Too many tiny aggregates can make workflows harder to follow.

### Problem left behind

Some business processes need coordination across several aggregates or contexts:

```text
Place order
   |
   +--> reserve inventory
   +--> capture payment
   +--> create shipment
```

One aggregate cannot safely own every part. This leads to **domain events** and application-level orchestration.

---

# Solution 4: Domain Events

A **domain event** describes something meaningful that happened in the domain.

Examples:

```text
OrderPlaced
InventoryReserved
PaymentCaptured
OrderCancelled
ShipmentCreated
```

Events help separate the action from its consequences.

```text
Order aggregate
    |
    | OrderPlaced
    v
Application / event handlers
    |
    +--> request inventory reservation
    +--> begin payment process
    +--> notify customer
```

### Domain event vs technical event

A domain event represents a business fact:

```text
PaymentCaptured
```

A technical event describes an implementation detail:

```text
DatabaseRowUpdated
```

Prefer domain events for business integration because they communicate meaning.

### Reliability requirement

An event must not be lost if the state change succeeds.

A common safe approach is the **outbox pattern**:

```text
Database transaction
   |
   +--> save Order
   +--> save OrderPlaced event to outbox
   |
   v
Commit
   |
   v
Background publisher sends event
```

This prevents the dangerous situation where an order is saved but the event is never published.

### Pros

- Reduces direct coupling between business areas.
- Supports asynchronous workflows.
- Makes domain changes visible.
- Enables reliable integration when paired with an outbox.
- Supports audit and observability.

### Cons

- Events may be delayed or delivered more than once.
- Consumers must be idempotent.
- Event schemas need versioning.
- Debugging requires correlation IDs and tracing.
- Eventual consistency must be communicated in the user experience.

---

# One TypeScript Example: Order Aggregate

This example uses an `Order` aggregate root to protect order-state rules.

```typescript name=src/orders/domain/order.ts
export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type OrderItem = Readonly<{
  productId: string;
  quantity: number;
  unitPriceCents: number;
}>;

export type DomainEvent =
  | Readonly<{
      type: "OrderPaid";
      orderId: string;
      occurredAt: string;
    }>
  | Readonly<{
      type: "OrderCancelled";
      orderId: string;
      occurredAt: string;
    }>;

export class DomainRuleError extends Error {}

export class Order {
  private status: OrderStatus = "pending";
  private paymentId: string | null = null;
  private readonly events: DomainEvent[] = [];

  public constructor(
    public readonly id: string,
    public readonly customerId: string,
    private readonly items: readonly OrderItem[],
  ) {
    if (id.length === 0 || customerId.length === 0) {
      throw new DomainRuleError("Order and customer identifiers are required.");
    }

    if (items.length === 0) {
      throw new DomainRuleError("An order must contain at least one item.");
    }

    for (const item of items) {
      if (
        item.productId.length === 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        !Number.isSafeInteger(item.unitPriceCents) ||
        item.unitPriceCents < 0
      ) {
        throw new DomainRuleError("Order contains an invalid item.");
      }
    }
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public getTotalCents(): number {
    return this.items.reduce(
      (total, item) => total + item.quantity * item.unitPriceCents,
      0,
    );
  }

  public recordPayment(paymentId: string): void {
    if (paymentId.length === 0) {
      throw new DomainRuleError("A payment identifier is required.");
    }

    if (this.status !== "pending") {
      throw new DomainRuleError("Only pending orders can be paid.");
    }

    if (this.paymentId !== null) {
      throw new DomainRuleError("Payment has already been recorded.");
    }

    this.paymentId = paymentId;
    this.status = "paid";

    this.events.push({
      type: "OrderPaid",
      orderId: this.id,
      occurredAt: new Date().toISOString(),
    });
  }

  public markShipped(): void {
    if (this.status !== "paid") {
      throw new DomainRuleError("Only paid orders can be shipped.");
    }

    this.status = "shipped";
  }

  public cancel(): void {
    if (this.status !== "pending") {
      throw new DomainRuleError("Only pending orders can be cancelled.");
    }

    this.status = "cancelled";

    this.events.push({
      type: "OrderCancelled",
      orderId: this.id,
      occurredAt: new Date().toISOString(),
    });
  }

  public pullEvents(): readonly DomainEvent[] {
    const pendingEvents = [...this.events];
    this.events.length = 0;
    return pendingEvents;
  }
}
```

### What this protects

```text
External caller
      |
      v
Order aggregate root
      |
      +--> validates item data
      +--> protects valid state transitions
      +--> prevents duplicate payment recording
      +--> publishes meaningful domain events
```

The aggregate does **not**:

- Trust client-provided prices without server-side verification.
- Perform authentication or authorization itself.
- Call a database, payment provider, or message broker directly.

Those responsibilities belong to application and infrastructure layers.

Before loading or modifying an order, the application layer must authorize the actor:

```text
Request -> authenticate -> authorize access to specific order -> load aggregate -> execute action
```

---

# When to Choose Which

| Problem | DDD practice |
|---|---|
| Business and technical teams use inconsistent terms | **Ubiquitous language** |
| A term has different valid meanings in different business areas | **Bounded contexts** |
| Related objects must always maintain rules together | **Aggregate** |
| A business action should trigger work elsewhere | **Domain event** |
| A state change and its event must be reliably coordinated | **Outbox pattern** |
| A workflow spans multiple aggregates or services | **Application service, saga, or process manager** |

---

# When Not to Use Full DDD

DDD adds modeling effort. Keep it simple when the system is mostly straightforward CRUD.

```text
Simple internal directory:
  create employee
  edit employee
  deactivate employee
```

A well-structured modular application with validation, authorization, and tests may be enough.

Use deeper DDD when business rules, vocabulary, workflows, or integration complexity are significant.

---

# Key Takeaways

- DDD models the business domain, not merely database tables.
- **Ubiquitous language** ensures people, requirements, code, and tests use the same terms.
- **Bounded contexts** allow terms to have precise local meanings.
- **Aggregates** protect important business rules and valid state transitions.
- **Domain events** communicate business facts without tightly coupling modules.
- Keep aggregates small and use events or workflows for cross-boundary coordination.
- Security remains outside and around the domain model: authenticate callers, authorize access to each resource, validate all input, protect sensitive data, and ensure events do not leak secrets or unnecessary personal data.

**Next topic: 2.6 Data design** — ER modeling, normalization, SQL vs. NoSQL, indexing, caching, and data migrations.

---

# 2.6 Data Design

**Data design** is how an application stores, organizes, retrieves, protects, and changes its data.

Good data design makes data:

- Correct
- Easy to query
- Fast enough
- Secure
- Recoverable
- Changeable over time

Poor data design causes duplicate records, slow pages, data loss, broken migrations, and security leaks.

---

## Problem: Storing Data Without a Clear Model

Imagine an online store stores orders like this:

```text
Order
 ├─ customerName: "Alex"
 ├─ customerEmail: "alex@example.com"
 ├─ productName: "Keyboard"
 ├─ productPrice: 80
 └─ quantity: 2
```

This seems simple, but problems quickly appear:

- A customer’s email exists in every order.
- A product price update may accidentally change old orders.
- One order cannot easily contain multiple products.
- Customer data can become inconsistent.
- Queries become slow as data grows.
- Sensitive fields may be exposed to users who should not see them.

Data design starts by modeling what the data means.

---

# Solution 1: Entity-Relationship (ER) Modeling

An **entity** is something the system stores information about.

Examples:

```text
Customer
Product
Order
Payment
```

A **relationship** describes how entities connect.

```text
Customer places Order
Order contains Product
Order has Payment
```

## Basic ER diagram

```text
+-------------+         +-------------+
| Customer    | 1     * | Order       |
|-------------|---------|-------------|
| id          |         | id          |
| email       |         | customerId  |
| name        |         | status      |
+-------------+         +-------------+
                              |
                              | 1
                              |
                              | *
                         +-------------+
                         | OrderItem   |
                         |-------------|
                         | orderId     |
                         | productId   |
                         | quantity    |
                         | unitPrice   |
                         +-------------+
                              |
                              | *
                              |
                              | 1
                         +-------------+
                         | Product     |
                         |-------------|
                         | id          |
                         | name        |
                         | currentPrice|
                         +-------------+
```

### Relationship types

| Relationship | Meaning | Example |
|---|---|---|
| One-to-one | One record matches one record | User → UserProfile |
| One-to-many | One record has many related records | Customer → Orders |
| Many-to-many | Many records connect to many records | Orders ↔ Products |

A many-to-many relationship usually needs a linking entity.

```text
Order <-> Product

becomes:

Order -> OrderItem <- Product
```

`OrderItem` stores information specific to that relationship, such as quantity and the price at the time of purchase.

### Important design decision: historical values

A product’s current price can change.

```text
Product:
  currentPrice = $100
```

But an old order must retain what the customer actually paid.

```text
OrderItem:
  unitPriceAtPurchase = $80
```

This is intentional duplication. It preserves historical correctness.

### Pros

- Makes business relationships visible before implementation.
- Helps avoid missing data and unclear ownership.
- Improves communication with product and domain experts.
- Supports correct database constraints.

### Cons

- Diagrams can become outdated.
- A model can become too detailed too early.
- ER diagrams do not decide how data should be normalized, indexed, or distributed.

### Problem left behind

A clear ER model can still duplicate the same facts in multiple places.

For example, storing customer name and email in every order creates inconsistency when details change.

This leads to normalization.

---

# Solution 2: Normalize Relational Data

**Normalization** organizes relational data to reduce accidental duplication and inconsistent updates.

A normalized design stores each fact in its appropriate place.

Instead of this:

```text
Orders table

orderId | customerName | customerEmail     | productName | quantity
--------|--------------|-------------------|-------------|---------
101     | Alex         | alex@example.com  | Keyboard    | 2
102     | Alex         | alex@example.com  | Mouse       | 1
```

Use separate related tables:

```text
Customers
customerId | name | email
-----------|------|------------------
1          | Alex | alex@example.com

Orders
orderId | customerId | status
--------|------------|--------
101     | 1          | paid
102     | 1          | pending

OrderItems
orderId | productId | quantity | unitPriceCents
--------|-----------|----------|---------------
101     | 10        | 2        | 8000
102     | 11        | 1        | 2500
```

## Why normalization matters

Without it, three common problems occur.

### 1. Update anomaly

A customer changes their email:

```text
alex@example.com -> alex.new@example.com
```

If the email exists in 100 orders, one missed update creates inconsistent data.

### 2. Insert anomaly

A new product cannot be created unless an order exists, because product details are stored only in order rows.

### 3. Delete anomaly

Deleting the last order for a product accidentally deletes the only stored product details.

## Practical normalization guideline

For most transactional SQL systems:

- Store each current business fact once.
- Use foreign keys for relationships.
- Use constraints to protect correctness.
- Duplicate data only deliberately and document why.

### Good deliberate duplication

| Duplicated field | Why it can be correct |
|---|---|
| `OrderItem.unitPriceCents` | Preserves the price paid at purchase time |
| `Invoice.billingAddress` | Preserves the legal billing address at invoice creation |
| Search index document | Optimizes search queries |
| Analytics warehouse copy | Keeps reporting separate from transactional workloads |

### Pros

- Reduces contradictory data.
- Makes updates safer.
- Improves data integrity.
- Works well for transactions and business systems.

### Cons

- Queries can require joins.
- Reporting queries may become more complex.
- Highly normalized schemas can be slower for read-heavy screens.

### Problem left behind

A normalized relational model is excellent for correct transactional data, but not every workload needs joins, strict schemas, or multi-row transactions.

This leads to choosing between SQL and NoSQL systems.

---

# Solution 3: Choose SQL or NoSQL Based on the Data Problem

The right database depends on access patterns and consistency needs—not on popularity.

---

## SQL Databases

SQL databases store structured data in related tables.

Common examples include PostgreSQL, SQL Server, MySQL, and SQLite.

```text
Orders table
    |
    +--> foreign key to Customers
    |
    +--> related OrderItems
```

### Best fit

Use SQL when you need:

- Strong data consistency.
- Transactions.
- Relationships and joins.
- Constraints such as unique values and foreign keys.
- Flexible reporting queries.
- Mature backup, auditing, and operational tooling.

Examples:

```text
Orders
Payments
Invoices
Inventory
User permissions
Financial records
```

### Pros

- Strong consistency and transaction support.
- Rich query language.
- Constraints protect data integrity.
- Excellent for related business data.
- Well understood by many teams.

### Cons

- Horizontal scaling can require planning.
- Schema changes need migrations.
- Deep joins and unindexed queries can become slow.
- Flexible or highly variable documents can be awkward.

---

## NoSQL Databases

**NoSQL** is a broad category. It includes document, key-value, graph, and wide-column databases.

### Document database example

A product catalog item may be stored as one document:

```text
Product
 ├─ id
 ├─ name
 ├─ description
 ├─ images[]
 ├─ attributes{}
 └─ variants[]
```

A document model can be useful when records have flexible attributes.

### Best fit

NoSQL can be useful for:

- Flexible catalog data.
- Session storage.
- Caching.
- High-volume event data.
- Content management.
- Graph-like relationships.
- Workloads with known access patterns that benefit from denormalization.

### Pros

- Flexible schema for changing document shapes.
- Can scale well for specific access patterns.
- Often fast for key-based lookups.
- Useful for specialized data models.

### Cons

- Consistency guarantees vary by database and configuration.
- Cross-record transactions may be limited or more expensive.
- Data duplication is common.
- Query capabilities may be more limited than SQL.
- Poor access-pattern design can be expensive to fix later.

---

## A practical default

```text
Business application with orders, users, payments, and permissions
    |
    v
Start with a relational SQL database
```

Use a specialized store only when it solves a proven problem:

```text
PostgreSQL for transactions
     |
     +--> Redis for short-lived cache/session data
     |
     +--> Search service for full-text search
     |
     +--> Object storage for uploaded files
```

This is called **polyglot persistence**: using different data stores for different needs.

Do not add multiple databases before there is a real requirement. Each new store increases backups, monitoring, access control, incident response, and operational cost.

### Problem left behind

Even a correct database becomes slow if the system repeatedly scans large tables to find a few records.

This leads to indexing.

---

# Solution 4: Add Indexes for Real Query Patterns

An **index** is a data structure that helps the database find rows faster.

Without an index:

```text
Find order with ID 123
    |
    v
Read many rows until it is found
```

With an index:

```text
Find order with ID 123
    |
    v
Use index to locate matching row quickly
```

## Example query patterns

```text
Find an order by ID:
WHERE id = ?

Find orders for a customer:
WHERE customer_id = ?

Find recent paid orders:
WHERE status = 'paid'
ORDER BY created_at DESC
```

These query patterns suggest indexes.

```text
Orders
  ├─ primary key index on id
  ├─ index on customer_id
  └─ composite index on (status, created_at)
```

## Composite indexes

A composite index supports queries using multiple columns.

```text
(status, created_at)
```

This can help:

```sql
WHERE status = 'paid'
ORDER BY created_at DESC
```

The column order matters. It should match real filter and sort patterns.

### Index trade-off

```text
More indexes
  ├─ faster reads
  └─ slower writes and more storage
```

Every insert, update, and delete may need to update relevant indexes.

### Good indexing process

```text
1. Measure slow query.
2. Understand its filter, join, and sort conditions.
3. Add or adjust the smallest useful index.
4. Verify query plan and performance.
5. Monitor write impact.
```

Do not add indexes only because a column “might be queried someday.”

### Security note

Indexes improve performance, but they do not enforce authorization.

This is unsafe:

```text
SELECT * FROM orders WHERE id = ?
```

if the application does not also verify the requesting user is allowed to access that order.

Prefer data access patterns that include tenant or ownership scope:

```text
SELECT * FROM orders
WHERE id = ?
  AND customer_id = ?
```

Then still perform explicit authorization in the application layer where required.

### Problem left behind

Indexes improve database reads, but repeated requests may still produce unnecessary database and network load.

This leads to caching.

---

# Solution 5: Cache Carefully

A **cache** stores a temporary copy of data so repeated reads are faster.

```text
Client
   |
   v
API
   |
   +--> Cache hit  -> return cached response
   |
   +--> Cache miss -> query database -> store result -> return response
```

## Good cache candidates

- Public product catalog data.
- Read-heavy reference data.
- Computed reports.
- Rate-limit counters.
- Short-lived sessions, where appropriate.
- Server-rendered page fragments.

## Poor cache candidates

- Highly sensitive data without strict isolation.
- Data that must always be current, such as available account balance.
- Authorization decisions unless designed and invalidated very carefully.
- Mutable shopping-cart state without a clear consistency strategy.

## Cache-aside pattern

A common approach:

```text
1. Read from cache.
2. If found, return it.
3. If not found, read database.
4. Put result in cache with an expiry.
5. Return result.
```

### Cache invalidation

The hard part is ensuring cached data does not remain incorrect too long.

```text
Product price changes
    |
    +--> update database
    +--> remove or update product cache entry
```

Common options:

| Strategy | Benefit | Risk |
|---|---|---|
| Time-to-live (TTL) | Simple | Data may be stale until expiry |
| Explicit invalidation | Fresher data | More implementation complexity |
| Write-through cache | Cache updates with database write | More write latency and complexity |
| Event-driven invalidation | Works across services | Requires reliable event delivery |

### Security rules for caching

- Include tenant and user identity in cache keys for private data.
- Do not cache responses containing secrets, tokens, or private information in shared caches.
- Set correct HTTP cache headers.
- Authorize **before** returning private cached data.
- Use short TTLs for permission-sensitive information.
- Clear or rotate sessions on logout and credential changes.

Bad cache key:

```text
order:123
```

Potentially safer private cache key:

```text
tenant:acme:user:42:order:123
```

The exact design depends on authorization rules, but the key must never allow one user or tenant to receive another’s cached response.

### Pros

- Reduces latency.
- Reduces database load.
- Improves capacity for read-heavy systems.

### Cons

- Can return stale data.
- Adds infrastructure and monitoring requirements.
- Incorrect keys or invalidation can create data leaks or correctness bugs.
- Cache outages must not cause uncontrolled database overload.

### Problem left behind

Data models evolve. Columns, constraints, tables, and indexes eventually need to change in production without losing data.

This leads to data migrations.

---

# Solution 6: Use Safe, Versioned Data Migrations

A **migration** is a controlled, versioned change to database structure or data.

Examples:

- Add a column.
- Create an index.
- Split one table into two.
- Add a constraint.
- Backfill missing values.
- Rename a field.

## Problematic migration

```text
Deploy new code that requires `orders.currency`
    |
    v
Column does not exist yet
    |
    v
Production errors
```

## Safer expand-contract migration

For breaking changes, use a gradual process.

```text
1. Expand: add compatible new schema.
2. Deploy: code supports old and new formats.
3. Backfill: migrate existing records safely.
4. Switch: read from and write to new format.
5. Contract: remove old schema after verification.
```

### Example: add required currency to orders

```text
Phase 1: Add nullable currency column.
Phase 2: Deploy code that writes currency for new orders.
Phase 3: Backfill old orders with known/default currency.
Phase 4: Validate no null values remain.
Phase 5: Add NOT NULL constraint.
Phase 6: Remove compatibility code later.
```

```text
Old application ── works ──> expanded schema
New application ── works ──> expanded schema

After migration and verification:
New application ──> final schema
```

## Migration safety checklist

- Back up data and test restoration.
- Run migrations in a staging environment using representative data volume.
- Make long backfills resumable and batch-based.
- Avoid locking large tables during peak traffic.
- Monitor errors, database load, replication lag, and query latency.
- Have a rollback or forward-fix plan.
- Deploy application code compatible with both schema versions during transition.
- Restrict migration permissions; do not run production migrations with broad credentials.
- Never include secrets in migration files or logs.

---

# One TypeScript Example: Parameterized Query and Tenant Isolation

This example retrieves an order only if it belongs to the authenticated customer.

```typescript name=src/orders/infrastructure/postgres-order-reader.ts
export type OrderSummary = Readonly<{
  id: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  totalCents: number;
  createdAt: Date;
}>;

export interface SqlClient {
  query<T>(
    sql: string,
    parameters: readonly unknown[],
  ): Promise<{ rows: readonly T[] }>;
}

export class OrderNotFoundError extends Error {
  constructor() {
    super("Order not found.");
  }
}

export async function findCustomerOrder(
  database: SqlClient,
  input: Readonly<{
    orderId: string;
    customerId: string;
  }>,
): Promise<OrderSummary> {
  if (input.orderId.length === 0 || input.customerId.length === 0) {
    throw new Error("Order and customer identifiers are required.");
  }

  const result = await database.query<OrderSummary>(
    `
      SELECT id, status, total_cents AS "totalCents", created_at AS "createdAt"
      FROM orders
      WHERE id = $1
        AND customer_id = $2
      LIMIT 1
    `,
    [input.orderId, input.customerId],
  );

  const order = result.rows[0];

  if (order === undefined) {
    // A generic response avoids revealing whether another customer's order exists.
    throw new OrderNotFoundError();
  }

  return order;
}
```

### What this protects

```text
Authenticated customer
        |
        v
Query includes both:
  order ID + customer ID
        |
        v
Only owned order can be returned
```

Security practices in this example:

- Uses **parameterized SQL**, preventing SQL injection.
- Includes customer ownership in the query, reducing accidental cross-customer access.
- Returns a generic “not found” error instead of revealing whether another order exists.
- Selects only required columns instead of using `SELECT *`.

Application-level authorization should still verify that the caller is authenticated and that their customer identity is trusted before this query is called.

---

# When to Choose Which

| Need | Choose |
|---|---|
| Understand entities and relationships | **ER modeling** |
| Reduce accidental duplication and inconsistent updates | **Normalization** |
| Transactions, relationships, reports, and strong consistency | **SQL database** |
| Flexible documents, key-value access, specialized high-scale workload | **NoSQL**, when justified |
| Improve a measured slow query | **Index** |
| Reduce repeat read latency and database load | **Cache**, with strict isolation and invalidation |
| Change production schema safely | **Versioned expand-contract migration** |
| Protect against SQL injection | **Parameterized queries** |
| Protect tenant/customer data | **Tenant and ownership scoping plus authorization** |

---

# Key Takeaways

- Start with an **ER model** so the data represents real business concepts.
- Use **normalization** to prevent accidental duplication and inconsistent updates.
- Prefer a relational **SQL database** for most transactional business systems.
- Use NoSQL or specialized stores only for a demonstrated access-pattern or scale need.
- Add **indexes** based on measured query patterns, not guesses.
- Use **caching** carefully: it improves speed but creates staleness and security risks.
- Treat migrations as production changes: version them, test them, monitor them, and make them reversible or safely forward-fixable.
- Protect data with parameterized queries, least-privilege database access, encryption in transit and at rest, backups, audit logging, and resource-level authorization.

**Next topic: 2.7 API design** — REST, GraphQL, gRPC, OpenAPI, versioning, idempotency, and pagination.

---

# 2.7 API Design

An **API** is a contract that lets software systems communicate.

Examples:

```text
Web app  -> API -> Database
Mobile   -> API -> Payment provider
Partner  -> API -> Business system
```

Good API design makes integrations predictable, secure, and easy to evolve.

---

## Problem: Inconsistent and Unsafe APIs

Without clear API design, endpoints often grow randomly:

```text
POST /getUser
GET /deleteOrder?id=123
POST /doPayment
GET /products?page=2&all=true
```

This causes problems:

- Clients cannot predict endpoint behavior.
- Unsafe actions may use the wrong HTTP method.
- Errors have inconsistent formats.
- Retries can create duplicate orders or charges.
- API changes break mobile apps and integrations.
- Large responses become slow and expensive.
- Authorization may be checked inconsistently.

---

# Solution 1: REST APIs

**REST** is a common HTTP-based style that models business resources.

Examples of resources:

```text
/users
/orders
/products
/payments
```

Use HTTP methods to describe the intended operation.

| Method | Meaning | Example |
|---|---|---|
| `GET` | Read data | `GET /orders/123` |
| `POST` | Create resource or perform command | `POST /orders` |
| `PUT` | Replace resource | `PUT /users/42` |
| `PATCH` | Partially update resource | `PATCH /orders/123` |
| `DELETE` | Remove resource | `DELETE /saved-addresses/7` |

## Example REST design

```text
GET    /orders                 List the current user's orders
POST   /orders                 Create an order
GET    /orders/{orderId}       Get one order
POST   /orders/{orderId}/cancel Cancel an order
```

The cancel endpoint is a command because cancellation is a business action, not merely a field update.

```text
POST /orders/123/cancel
```

## Status codes

Use meaningful HTTP status codes consistently.

| Status | Meaning | Typical use |
|---:|---|---|
| `200 OK` | Request succeeded | Read or update succeeded |
| `201 Created` | Resource created | Order created |
| `202 Accepted` | Work accepted but not finished | Async report generation |
| `204 No Content` | Success with no response body | Successful deletion |
| `400 Bad Request` | Invalid request format or values | Invalid JSON or invalid field |
| `401 Unauthorized` | Not authenticated | Missing or invalid access token |
| `403 Forbidden` | Authenticated but not allowed | User cannot refund an order |
| `404 Not Found` | Resource is unavailable to caller | Order does not exist or is not accessible |
| `409 Conflict` | Request conflicts with current state | Cancelling an already shipped order |
| `422 Unprocessable Content` | Well-formed but business-invalid request | Quantity exceeds allowed maximum |
| `429 Too Many Requests` | Rate limit exceeded | Excessive login attempts |
| `500 Internal Server Error` | Unexpected server problem | Never expose internal details |

### Pros

- Uses standard HTTP concepts.
- Easy for browsers, mobile apps, partners, and tools to use.
- Works well for common CRUD-style resources.
- Caching support is well understood.
- Broad ecosystem and documentation support.

### Cons

- Nested and complex data can require multiple requests.
- Under-fetching and over-fetching may occur.
- Resource-based endpoints can be awkward for complex reporting.
- API design needs discipline to stay consistent.

### Security requirements

```text
Request
   |
   v
Authenticate caller
   |
   v
Authorize action on specific resource
   |
   v
Validate request input
   |
   v
Perform operation
```

Authentication alone is insufficient.

For example, this is unsafe:

```text
GET /orders/123
```

if the API checks only whether the caller is logged in.

The API must verify whether the caller is authorized to read **order 123**.

### Problem left behind

REST is simple for resource-based operations, but some clients need many connected pieces of data in one request—for example, a product page with product details, reviews, stock availability, and recommendations.

This leads to GraphQL.

---

# Solution 2: GraphQL

**GraphQL** lets a client request exactly the fields it needs.

Instead of multiple REST calls:

```text
GET /products/123
GET /products/123/reviews
GET /products/123/availability
```

A client can request related data together:

```text
Client
   |
   v
GraphQL query
   |
   v
Product + reviews + availability
```

## Pros

- Clients request only required fields.
- Useful for complex screens with connected data.
- Strong typed schema.
- Can reduce client-side orchestration.
- Useful when web and mobile clients have different data needs.

## Cons

- Caching is more complex than standard REST caching.
- Queries can be expensive without limits.
- Authorization must be enforced at every resolver or data boundary.
- Schema design requires care.
- Error handling and observability can be harder.

## Security risks

A client-controlled query can request expensive nested data:

```text
product
  -> reviews
      -> authors
          -> orders
              -> items
```

Protect GraphQL APIs with:

- Maximum query depth.
- Query complexity or cost limits.
- Request size limits.
- Rate limiting.
- Persisted or allow-listed queries for public clients where appropriate.
- Per-field and per-resource authorization.
- Data-loader patterns to avoid inefficient repeated database queries.

### When to choose GraphQL

Choose GraphQL when:

- Clients need different combinations of related data.
- Multiple front ends have significantly different data requirements.
- The team can operate and secure a schema-driven query layer.

Do not choose it merely to avoid designing REST endpoints.

### Problem left behind

REST and GraphQL are often ideal for browser and public APIs, but internal service-to-service calls may need stricter contracts and lower overhead.

This leads to gRPC.

---

# Solution 3: gRPC

**gRPC** is a remote procedure call framework often used for internal service-to-service communication.

It commonly uses Protocol Buffers (Protobuf) for strongly typed messages.

```text
Orders Service
      |
      | gRPC
      v
Inventory Service
```

Unlike REST, gRPC is usually action-oriented:

```text
ReserveInventory
ReleaseReservation
GetAvailableStock
```

## Pros

- Strong contract and code generation.
- Efficient binary messages.
- Supports streaming.
- Good for internal services with controlled clients.
- Useful for low-latency communication.

## Cons

- Less convenient for direct browser use.
- Harder to inspect manually than JSON/HTTP APIs.
- Requires schema and compatibility discipline.
- Does not remove distributed-system failures such as timeouts or retries.

## Security requirements

For internal gRPC services:

- Use TLS, including mutual TLS where appropriate.
- Use short-lived workload identities.
- Authenticate and authorize every service call.
- Set deadlines/timeouts.
- Restrict network access with deny-by-default rules.
- Validate every message despite typed schemas.
- Avoid logging sensitive request data.

### When to choose gRPC

Use gRPC when:

```text
Trusted internal systems
   +
High call volume or low latency needs
   +
Strong typed contracts
```

For public browser APIs, REST is usually simpler. GraphQL may be better for flexible client data needs.

### Problem left behind

Regardless of API style, clients need reliable documentation and a machine-readable contract.

This leads to API specifications.

---

# Solution 4: Define Contracts with OpenAPI

**OpenAPI** is a standard format for describing HTTP APIs.

An OpenAPI contract documents:

- Endpoints and methods.
- Request fields.
- Response fields.
- Authentication requirements.
- Error responses.
- Validation rules.
- API versions.

```text
OpenAPI contract
      |
      +--> API documentation
      +--> Client generation
      +--> Request validation
      +--> Contract tests
      +--> Mock server
```

## Why contract-first design helps

Instead of implementing endpoints first and documenting later:

```text
Design contract
      |
      v
Review with consumers
      |
      v
Implement API
      |
      v
Validate implementation against contract
```

This catches misunderstanding early.

### Pros

- Clear source of truth for clients and servers.
- Supports interactive documentation.
- Enables generated clients and validation.
- Helps contract testing and mock servers.
- Makes breaking changes easier to identify.

### Cons

- The specification can become outdated if not validated in CI.
- Generated code may need review and customization.
- A complete contract does not guarantee good business behavior or authorization.

### Security requirements for API contracts

Document:

- Required authentication mechanism.
- Required permissions or scopes per operation.
- Input validation constraints.
- Rate-limit behavior.
- Allowed content types.
- Error format without internal stack traces.
- Sensitive fields that must never be returned.

Do not put secrets, real tokens, production URLs containing credentials, or real personal data in examples.

### Problem left behind

Clients may depend on your API for years. Changing a field or endpoint carelessly can break them.

This leads to versioning and compatibility.

---

# Solution 5: Version APIs Carefully

An API is a contract. Changes must be classified as compatible or breaking.

## Usually compatible changes

```text
Add an optional response field.
Add a new endpoint.
Add a new optional request field.
Add a new enum value, if clients are designed to tolerate it.
```

## Usually breaking changes

```text
Remove or rename a field.
Change a field type.
Make an optional field required.
Change authorization behavior unexpectedly.
Change pagination behavior.
Change error formats clients depend on.
```

## Common versioning approaches

### 1. URL versioning

```text
/v1/orders
/v2/orders
```

**Pros:** visible and easy to route.  
**Cons:** versions can multiply and become long-lived.

### 2. Header versioning

```text
Accept: application/vnd.example.orders.v2+json
```

**Pros:** keeps URLs resource-focused.  
**Cons:** harder to test and discover manually.

### 3. Compatibility-first evolution

```text
/orders
```

Keep one version and make additive, backward-compatible changes.

**Pros:** fewer long-lived versions.  
**Cons:** requires strong compatibility discipline.

## Practical recommendation

For many public APIs:

```text
Use a stable version such as /v1,
prefer additive changes,
deprecate before removing,
and publish a migration deadline.
```

```text
v1 active
  |
  +--> announce deprecation
  |
  +--> provide migration guide
  |
  +--> monitor remaining v1 usage
  |
  +--> retire after agreed notice period
```

### Problem left behind

Clients, networks, and load balancers can retry requests. Retrying a create operation can accidentally create duplicate records or charges.

This leads to idempotency.

---

# Solution 6: Make Critical Operations Idempotent

An operation is **idempotent** if repeating it has the same intended effect as doing it once.

Examples:

```text
GET /orders/123
```

Reading repeatedly has no side effect.

```text
DELETE /saved-addresses/5
```

Deleting an already deleted resource should not create a new harmful result.

The difficult case is creation:

```text
POST /orders
```

A client may send the request, lose the response due to a network failure, and retry.

```text
Client -> create order -> API creates order
Client <- response lost
Client -> retries create order
```

Without protection:

```text
Two orders created
Two payments attempted
```

## Idempotency key

The client sends a unique key with a request:

```text
Idempotency-Key: 1d1a0b77-2a9d-4ee8-8da3-9ab88cda03d9
```

The server stores the key and response result.

```text
Request with key
      |
      v
Has this key already completed?
      |
   +--+--+
   |     |
  Yes    No
   |     |
Return   Process request once
saved       |
result      v
        Save result for key
```

## Idempotency requirements

- Scope the key to the authenticated user or tenant.
- Store a request fingerprint with the key.
- Reject reuse of the same key with different request data.
- Set an expiry appropriate for the business risk.
- Use database uniqueness constraints or transactional logic to handle concurrent duplicate requests.
- Do not treat a random client request ID as authorization.

### Pros

- Prevents duplicate orders, payments, and account changes.
- Makes client retries safe.
- Improves reliability during network failures.

### Cons

- Requires temporary storage and cleanup.
- Requires careful concurrent-request handling.
- Does not replace domain-level duplicate prevention.

### Problem left behind

Listing all records in one response becomes slow and expensive as the dataset grows.

This leads to pagination.

---

# Solution 7: Paginate Collection Endpoints

Never return an unbounded list.

Unsafe:

```text
GET /orders
```

This could eventually return millions of records.

Use pagination:

```text
GET /orders?limit=20&cursor=...
```

## Offset pagination

```text
GET /orders?offset=40&limit=20
```

### Pros

- Easy to understand.
- Supports “page 3” interfaces.
- Useful for small, stable datasets.

### Cons

- Slow for large offsets.
- Records added or removed during navigation can cause duplicates or gaps.
- May reveal total dataset size unnecessarily.

## Cursor pagination

```text
GET /orders?limit=20&cursor=eyJjcmVhdGVkQXQiOi...
```

The cursor represents a stable position, often based on a sorted field and unique ID.

```text
First request
   |
   v
Items 1–20 + nextCursor
   |
   v
Next request with cursor
   |
   v
Items 21–40 + nextCursor
```

### Pros

- Performs better on large datasets.
- More stable while new records are added.
- Good for feeds, audit logs, and transaction history.

### Cons

- Cannot easily jump to an arbitrary numbered page.
- Cursor design must match stable sorting.
- Cursors must be validated and protected from tampering.

### Security requirements

- Apply authorization and tenant filtering before pagination.
- Use a server-signed or opaque cursor; do not trust client-supplied sort position.
- Allow-list sortable fields; never place raw client field names into SQL.
- Enforce a maximum page size.

```text
Requested limit: 10,000
       |
       v
Server clamps to maximum: 100
```

---

# One TypeScript Example: Secure, Idempotent Order Creation

This example demonstrates validation, authorization, idempotency, and safe error handling.

```typescript name=src/orders/api/create-order-handler.ts
export type AuthenticatedActor = Readonly<{
  userId: string;
  tenantId: string;
  permissions: readonly string[];
}>;

export type CreateOrderRequest = Readonly<{
  productId: string;
  quantity: number;
}>;

export type CreateOrderResponse = Readonly<{
  orderId: string;
  status: "pending";
}>;

export interface IdempotencyStore {
  find(
    tenantId: string,
    userId: string,
    key: string,
  ): Promise<Readonly<{
    requestHash: string;
    response: CreateOrderResponse;
  }> | null>;

  save(
    tenantId: string,
    userId: string,
    key: string,
    requestHash: string,
    response: CreateOrderResponse,
  ): Promise<void>;
}

export interface OrderService {
  create(
    input: Readonly<{
      tenantId: string;
      customerId: string;
      productId: string;
      quantity: number;
    }>,
  ): Promise<CreateOrderResponse>;
}

export class ApiError extends Error {
  public constructor(
    public readonly statusCode: 400 | 403 | 409 | 422,
    message: string,
  ) {
    super(message);
  }
}

export async function createOrder(
  actor: AuthenticatedActor,
  idempotencyKey: string | undefined,
  request: CreateOrderRequest,
  idempotency: IdempotencyStore,
  orders: OrderService,
): Promise<CreateOrderResponse> {
  if (!actor.permissions.includes("orders:create")) {
    throw new ApiError(403, "You are not allowed to create orders.");
  }

  if (
    idempotencyKey === undefined ||
    !/^[a-zA-Z0-9-]{16,128}$/.test(idempotencyKey)
  ) {
    throw new ApiError(400, "A valid Idempotency-Key header is required.");
  }

  if (
    request.productId.length === 0 ||
    !Number.isSafeInteger(request.quantity) ||
    request.quantity < 1 ||
    request.quantity > 100
  ) {
    throw new ApiError(422, "The order request is invalid.");
  }

  // This example uses a simple deterministic fingerprint.
  // In production, use a cryptographic hash of canonical request content.
  const requestHash = `${request.productId}:${request.quantity}`;

  const existing = await idempotency.find(
    actor.tenantId,
    actor.userId,
    idempotencyKey,
  );

  if (existing !== null) {
    if (existing.requestHash !== requestHash) {
      throw new ApiError(
        409,
        "This idempotency key was already used for a different request.",
      );
    }

    return existing.response;
  }

  const response = await orders.create({
    tenantId: actor.tenantId,
    customerId: actor.userId,
    productId: request.productId,
    quantity: request.quantity,
  });

  await idempotency.save(
    actor.tenantId,
    actor.userId,
    idempotencyKey,
    requestHash,
    response,
  );

  return response;
}
```

### What this protects

```text
Client request
   |
   +--> requires explicit permission
   +--> validates idempotency key
   +--> validates input
   +--> scopes key to user and tenant
   +--> rejects same key with changed request
   +--> returns original result for safe retries
```

For production reliability, the order creation and idempotency record should be stored atomically in the same database transaction, with a unique database constraint to protect against concurrent duplicate requests.

---

# When to Choose Which

| Need | Choose |
|---|---|
| Standard web, mobile, or partner API | **REST** |
| Clients need flexible, connected data in one request | **GraphQL** |
| Typed, efficient internal service communication | **gRPC** |
| Document and validate HTTP API contracts | **OpenAPI** |
| Avoid breaking existing clients | **Backward-compatible changes and explicit versioning** |
| Safely retry creates, payments, or other commands | **Idempotency keys** |
| Return large collections safely | **Pagination** |
| Large and changing datasets | **Cursor pagination** |
| Small stable datasets with numbered pages | **Offset pagination** |

---

# Key Takeaways

- Design APIs as stable contracts, not just routes.
- Use **REST** as the common default for public HTTP APIs.
- Use **GraphQL** for flexible client-driven data needs and **gRPC** for controlled internal service calls.
- Define HTTP APIs with **OpenAPI** and validate the implementation against the contract.
- Prefer backward-compatible changes; version intentionally when breaking changes are unavoidable.
- Use **idempotency keys** for operations where retries could create duplicates.
- Paginate every potentially large collection.
- Secure every endpoint: authenticate callers, authorize each action and resource, validate inputs, rate-limit abuse-prone operations, use HTTPS, and avoid exposing internal errors or sensitive data.

**Next topic: 2.8 Communication and integration** — synchronous vs. asynchronous communication, queues, pub/sub, sagas, and consistency/CAP.

---

# 2.8 Communication and Integration

Systems often need to communicate with other parts of the same application, other services, or external providers.

Examples:

```text
Order placed
   |
   +--> Reserve inventory
   +--> Take payment
   +--> Send confirmation email
   +--> Update analytics
```

The main design choice is:

> Should the sender wait for an immediate answer, or should it send work to be handled later?

---

## Problem: Direct Dependencies Make Systems Fragile

A simple implementation may call every dependency directly:

```text
Customer
   |
   v
Orders API
   |
   +--> Inventory API
   +--> Payment API
   +--> Email API
```

This looks simple, but it creates risks:

- If the email service is down, should order creation fail?
- A slow dependency makes the whole request slow.
- A temporary network failure may cause duplicate requests.
- One service outage can cascade into many failures.
- The Orders service must know too much about other systems.

---

# Solution 1: Synchronous Communication

**Synchronous communication** means the caller waits for a response before continuing.

Common protocols:

- HTTP/REST
- GraphQL
- gRPC

```text
Orders Service                Inventory Service

Reserve stock request  ---------------->
                      <----------------  Stock reserved response
Continue order process
```

## Example use cases

Use synchronous calls when the caller needs an immediate answer:

- Checking whether a product is in stock before checkout.
- Verifying a payment authorization.
- Fetching a customer profile.
- Validating an address.
- Requesting a small internal calculation.

## Pros

- Simple request-response mental model.
- Immediate success or failure feedback.
- Easier to trace for small workflows.
- Good for user-facing operations that need an answer now.

## Cons

- The caller is blocked while waiting.
- A slow dependency increases response time.
- A failed dependency can fail the entire request.
- Long dependency chains are fragile.
- Retries can cause duplicate side effects.

```text
Web -> Orders -> Inventory -> Payments -> Notifications
```

If each call takes only a little time, the total delay grows. If any service fails, the request may fail.

## Security requirements

For every synchronous service call:

- Use HTTPS/TLS.
- Set short connection and request timeouts.
- Authenticate the calling service using short-lived identities.
- Authorize the requested operation.
- Validate responses—never trust a response only because it came from an internal network.
- Do not put secrets or personal data in URLs.
- Use correlation IDs for tracing, but never use them as credentials.

## Problem left behind

Synchronous communication is poor for work that does not need to complete before responding to the user.

For example, a customer should usually receive an order confirmation even if analytics processing is temporarily unavailable.

This leads to asynchronous communication.

---

# Solution 2: Asynchronous Communication

**Asynchronous communication** means the sender submits work and does not wait for the receiver to finish.

```text
Orders Service
    |
    | "Send confirmation email"
    v
Queue
    |
    v
Notification Worker
```

The sender can respond quickly:

```text
Customer places order
       |
       v
Order is saved
       |
       v
Response: "Order received"
       |
       v
Email is sent later
```

## Pros

- Faster response for the original request.
- The sender and receiver are less tightly coupled.
- Work can be retried later.
- Receivers can process messages at their own speed.
- Better for background tasks and workload spikes.

## Cons

- Results are not immediate.
- Data can be temporarily inconsistent.
- Messages may be delayed, duplicated, or arrive out of order.
- Debugging requires better observability.
- Users need clear status messages.

Example user experience:

```text
Good:
"Your order was received. We will email confirmation shortly."

Risky:
"Your order is complete."
```

The second statement may be false if payment or inventory processing is still pending.

## When to choose asynchronous communication

Use it for:

- Sending emails and notifications.
- Generating reports.
- Resizing uploaded images.
- Updating search indexes.
- Analytics processing.
- Background imports.
- Non-critical integration updates.
- Long-running workflows.

## Problem left behind

Asynchronous work needs a reliable place to wait until a consumer can process it.

This leads to queues.

---

# Solution 3: Queues

A **queue** stores messages until one consumer processes each message.

```text
Orders Service
      |
      v
+----------------+
| Order Queue    |
+----------------+
      |
      v
Order Worker
```

Usually, each message is handled by one consumer.

```text
Message: SendOrderConfirmation
       |
       v
Queue
       |
       v
One notification worker processes it
```

## Example

```text
Order placed
   |
   v
Queue: SendOrderConfirmation
   |
   v
Notification worker
   |
   v
Email provider
```

## Pros

- Smooths sudden traffic spikes.
- Separates sender speed from worker speed.
- Supports retrying temporary failures.
- Helps prevent a slow dependency from blocking the main request.
- Consumers can scale independently.

## Cons

- A queue does not guarantee business correctness by itself.
- Messages may be delivered more than once.
- Poison messages can repeatedly fail.
- Long queues create processing delays.
- Message ordering may not be guaranteed.

## Reliable queue processing

Assume a message can be processed more than once.

```text
Receive message
      |
      v
Validate message
      |
      v
Has message ID already been handled?
      |
   +--+--+
   |     |
 Yes     No
   |      |
Skip    Process safely
          |
          v
       Mark completed
```

This is called **idempotent message handling**.

### Dead-letter queues

A message that repeatedly fails should not block processing forever.

```text
Main queue
   |
   | fails after retry limit
   v
Dead-letter queue
   |
   v
Alert + investigate + repair or replay
```

Do not silently discard failed messages.

## Security requirements

- Encrypt queue traffic with TLS.
- Apply least-privilege permissions:
  - Producers can publish only to required queues.
  - Consumers can read only required queues.
- Validate every message schema.
- Include a message ID and correlation ID.
- Avoid secrets, access tokens, and unnecessary personal data in messages.
- Restrict dead-letter queue access because it may contain failed sensitive work.
- Monitor failed messages and queue length.

## Problem left behind

A queue sends a message to one worker. Sometimes multiple systems need to react independently to the same business event.

This leads to publish-subscribe.

---

# Solution 4: Publish-Subscribe (Pub/Sub)

In **publish-subscribe**, a publisher emits an event and multiple subscribers can receive it.

```text
Orders Service
      |
      | OrderPlaced
      v
+---------------------+
| Event Topic         |
+---------------------+
   |          |          |
   v          v          v
Inventory  Notifications Analytics
```

The publisher does not need to know which consumers exist.

## Queue vs. Pub/Sub

| Question | Queue | Pub/Sub |
|---|---|---|
| Who processes a message? | Usually one consumer | Multiple subscribers |
| Main purpose | Assign work | Announce an event |
| Example message | `GenerateInvoice` | `OrderPlaced` |
| Receiver knowledge | Sender targets a queue | Publisher does not know subscribers |

A simple rule:

```text
"Please do this work"  -> Queue command
"This business fact happened" -> Published event
```

Examples:

```text
Queue command:
ReserveInventory

Published event:
InventoryReserved
```

## Pros

- Publisher is loosely coupled to subscribers.
- New subscribers can be added without changing the publisher.
- Good for integration and event-driven workflows.
- Useful for analytics, search updates, notifications, and audit processing.

## Cons

- Behavior becomes distributed and harder to trace.
- Event versioning is necessary.
- Subscribers can interpret events differently.
- Sensitive data can spread to many systems.
- Exactly-once delivery is difficult; consumers must be idempotent.

## Event contract design

Keep events focused and minimal.

Better:

```text
OrderPlaced
  - eventId
  - orderId
  - tenantId
  - occurredAt
```

Risky:

```text
OrderPlaced
  - customer full profile
  - payment token
  - full address history
  - internal fraud details
```

A consumer that needs more authorized data can retrieve it through a protected API.

## Problem left behind

Queues and pub/sub improve reliability and decoupling, but workflows spanning multiple services can still partially succeed.

Example:

```text
1. Reserve inventory succeeds.
2. Charge payment fails.
3. Inventory remains reserved incorrectly.
```

This leads to sagas.

---

# Solution 5: Sagas

A **saga** coordinates a business process that spans multiple services or data stores.

Unlike a database transaction, it does not lock all systems until everything succeeds. Instead, it performs steps and uses compensating actions if a later step fails.

```text
Create Order
    |
    v
Reserve Inventory
    |
    v
Capture Payment
    |
    v
Create Shipment
```

If payment fails:

```text
Reserve Inventory
    |
    v
Capture Payment fails
    |
    v
Release Inventory Reservation
```

## Why not use one transaction?

A normal database transaction works inside one database:

```text
Save order + reduce stock + write audit log
             |
             v
      One database transaction
```

But it cannot safely include independent external systems:

```text
Database + payment provider + shipping provider
```

Holding a transaction open while waiting on networks causes poor performance and still cannot guarantee external providers will roll back.

## Saga styles

### Choreography

Each service responds to events.

```text
OrderPlaced
   |
   v
Inventory reserves stock
   |
   v
InventoryReserved
   |
   v
Payments captures payment
```

**Pros**

- No central coordinator.
- Works well for short, simple workflows.

**Cons**

- The full flow is difficult to discover.
- Too many event reactions become confusing.

### Orchestration

A coordinator explicitly directs each step.

```text
Order Saga Coordinator
   |
   +--> Reserve inventory
   +--> Capture payment
   +--> Create shipment
```

**Pros**

- Workflow is visible in one place.
- Easier to monitor and reason about complex processes.

**Cons**

- The coordinator is important infrastructure.
- It must be reliable, secure, and observable.

## Saga state model

```text
pending
   |
   v
inventory_reserved
   |
   v
payment_captured
   |
   v
shipment_created
```

Failure states should also be explicit:

```text
payment_failed
inventory_released
cancelled
```

## Important limitation: compensation is not a perfect undo

Some actions cannot be fully reversed.

```text
Confirmation email sent
```

You cannot reliably “unsend” an email. Instead, send a corrective message if needed.

For payments, a refund may be a separate financial action with its own rules and timing—not a perfect reversal.

## Problem left behind

Distributed communication means services may briefly disagree about the latest state.

This leads to consistency choices and the CAP concept.

---

# Solution 6: Consistency and CAP

## Strong consistency

With **strong consistency**, after a successful write, all reads immediately see the latest value.

```text
Payment captured
      |
      v
Every reader immediately sees: paid
```

This is useful when incorrect data is unacceptable:

- Payment state.
- Inventory reservation limits.
- Account balances.
- Access-control changes.

## Eventual consistency

With **eventual consistency**, different parts of the system may temporarily show different states, but they converge later.

```text
Order Service:       paid
Email Service:       processing
Analytics Service:   not updated yet
```

This is common in asynchronous and distributed systems.

It can be acceptable for:

- Analytics.
- Search indexes.
- Recommendation systems.
- Email notifications.
- Non-critical dashboards.

It is usually dangerous for:

- Charging money twice.
- Granting unauthorized access.
- Enforcing hard inventory limits.
- Recording legal or financial state.

## CAP theorem, simply explained

CAP applies when a distributed system experiences a network partition: systems cannot communicate reliably.

It says a distributed system cannot always guarantee all three:

| Letter | Meaning |
|---|---|
| **C** | Consistency: every read gets the latest write |
| **A** | Availability: every request gets a non-error response |
| **P** | Partition tolerance: system continues despite network failures between nodes |

In a real distributed system, network failures can happen, so partition tolerance is not optional.

During a partition, the design must choose between:

```text
Prefer consistency:
Reject or delay requests instead of returning uncertain data.

Prefer availability:
Return a response, possibly with stale data.
```

## Example: inventory

```text
Inventory database is unreachable
```

For a checkout stock reservation:

```text
Prefer consistency:
Do not confirm stock availability until it can be verified.
```

For a product catalog page:

```text
Prefer availability:
Show recently cached availability with a clear final check at checkout.
```

CAP is not a general rule that every application must label itself “CP” or “AP.” It is a way to reason about behavior during network failures.

---

# One TypeScript Example: Idempotent Event Consumer

This consumer processes an `OrderPlaced` event safely even when the queue delivers it more than once.

```typescript name=src/notifications/application/handle-order-placed.ts
export type OrderPlacedEvent = Readonly<{
  eventId: string;
  eventType: "OrderPlaced";
  occurredAt: string;
  tenantId: string;
  orderId: string;
  customerId: string;
}>;

export interface ProcessedEventStore {
  hasProcessed(eventId: string): Promise<boolean>;
  markProcessed(eventId: string): Promise<void>;
}

export interface OrderReader {
  getNotificationDetails(
    tenantId: string,
    orderId: string,
    customerId: string,
  ): Promise<Readonly<{
    emailAddress: string;
    orderReference: string;
  }> | null>;
}

export interface EmailSender {
  sendOrderConfirmation(input: Readonly<{
    to: string;
    orderReference: string;
  }>): Promise<void>;
}

export class InvalidEventError extends Error {}
export class OrderNotFoundError extends Error {}

export async function handleOrderPlaced(
  event: OrderPlacedEvent,
  processedEvents: ProcessedEventStore,
  orders: OrderReader,
  email: EmailSender,
): Promise<void> {
  if (
    event.eventType !== "OrderPlaced" ||
    !isUuid(event.eventId) ||
    !isUuid(event.orderId) ||
    !isUuid(event.customerId) ||
    event.tenantId.length === 0
  ) {
    throw new InvalidEventError("Received an invalid OrderPlaced event.");
  }

  // Queue and pub/sub systems can redeliver messages.
  // Do not send a second email for an already completed event.
  if (await processedEvents.hasProcessed(event.eventId)) {
    return;
  }

  const details = await orders.getNotificationDetails(
    event.tenantId,
    event.orderId,
    event.customerId,
  );

  if (details === null) {
    throw new OrderNotFoundError("Order notification details are unavailable.");
  }

  await email.sendOrderConfirmation({
    to: details.emailAddress,
    orderReference: details.orderReference,
  });

  await processedEvents.markProcessed(event.eventId);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
```

## What this example demonstrates

```text
OrderPlaced event
      |
      v
Validate minimal event data
      |
      v
Check event ID was not already handled
      |
      v
Retrieve only necessary authorized details
      |
      v
Send email
      |
      v
Record event as processed
```

Security and reliability practices:

- Validates event structure before processing.
- Uses a unique event ID for idempotency.
- Retrieves customer contact data through a scoped API instead of including it in the event.
- Keeps sensitive personal data out of logs and message payloads.
- Requires tenant context, reducing cross-tenant data access risk.

In production, checking and marking an event should use an atomic database operation with a unique constraint on `eventId`. For strong delivery guarantees, use an outbox/inbox pattern and monitor retry and dead-letter queues.

---

# When to Choose Which

| Need | Choose |
|---|---|
| The caller needs an immediate answer | **Synchronous HTTP, GraphQL, or gRPC** |
| Work can happen after the user receives a response | **Asynchronous messaging** |
| One worker should process one task | **Queue** |
| Multiple systems should react to a business fact | **Pub/Sub** |
| A workflow spans multiple services and needs recovery actions | **Saga** |
| Incorrect temporary data is acceptable | **Eventual consistency** |
| Incorrect data could cause financial, inventory, or authorization harm | **Strong consistency or fail safely** |
| An external dependency repeatedly fails | **Timeouts, retries with backoff, and circuit breakers** |

---

# Practical Decision Guide

```text
Does the user need the answer now?
   |
   +--> Yes: use synchronous communication.
   |
   +--> No
         |
         v
Should exactly one worker handle the task?
   |
   +--> Yes: use a queue.
   |
   +--> No: publish an event through pub/sub.
```

Then ask:

```text
Does the workflow span several services?
   |
   +--> Yes: model states and use a saga.
   |
   +--> No: use a normal local database transaction where possible.
```

---

# Key Takeaways

- **Synchronous communication** is simple but creates runtime dependency and latency.
- **Asynchronous communication** improves decoupling and resilience but introduces delayed results and eventual consistency.
- Use a **queue** to assign work to one consumer.
- Use **pub/sub** to announce facts to many independent consumers.
- Assume messages can be duplicated, delayed, or arrive out of order; make consumers idempotent.
- Use **sagas** for workflows spanning independent services.
- Choose consistency deliberately: fail safely for payments, authorization, and hard inventory limits; accept eventual consistency for non-critical derived data.
- Secure all integration boundaries with TLS, authentication, authorization, input validation, least-privilege topic/queue access, timeout limits, safe logging, and monitoring.

**Next topic: 2.9 Scalability, resilience and performance design** — load balancing, caching, retries, circuit breakers, and capacity planning.

---

# 2.9 Scalability, Resilience, and Performance Design

This topic answers three related questions:

- **Performance:** How fast does the system respond?
- **Scalability:** Can it handle more users and work?
- **Resilience:** Can it continue or recover when parts fail?

A system can be fast but fragile. It can also survive failures but be too slow. Good design balances all three.

---

## Problem: One Server Handles Everything

A basic system may look like this:

```text
Users
  |
  v
+-------------------+
| One API server    |
+-------------------+
  |
  v
+-------------------+
| One database      |
+-------------------+
```

This works for a small number of users. Problems appear as traffic grows:

- Requests become slow.
- One server failure takes down the application.
- The database becomes overloaded.
- External API delays block user requests.
- Retrying failed calls creates extra load or duplicate actions.
- No one knows the system’s actual limits.

---

# Solution 1: Measure Performance First

Do not optimize based only on guesses.

Measure the system using meaningful indicators.

| Metric | Meaning | Example target |
|---|---|---|
| Latency | How long one request takes | 95% of product requests under 300 ms |
| Throughput | Requests or jobs processed per time | 500 requests/second |
| Error rate | Percentage of failed requests | Less than 0.1% server errors |
| Saturation | Resource usage near its limit | Database CPU below 70% normally |
| Availability | Percentage of time usable | 99.9% monthly availability |

## Percentiles matter

Average response time can hide poor user experiences.

```text
Request times: 100 ms, 100 ms, 100 ms, 100 ms, 5,000 ms

Average: 1,080 ms
```

Most users had a fast response, but one waited five seconds.

Use percentiles:

```text
p50: typical request time
p95: 95% of requests are faster than this
p99: 99% of requests are faster than this
```

Example:

```text
Target: p95 checkout response time below 800 ms
```

### Pros

- Finds real bottlenecks.
- Prevents unnecessary complexity.
- Creates measurable engineering goals.
- Helps detect regressions after releases.

### Cons

- Requires monitoring and load testing.
- Metrics alone do not fix the problem.
- Measuring only application response time can miss database or dependency issues.

### Problem left behind

After measuring, the system may show that one server cannot handle the workload or is a single point of failure.

This leads to load balancing and horizontal scaling.

---

# Solution 2: Load Balancing and Horizontal Scaling

A **load balancer** distributes incoming requests across multiple application instances.

```text
Users
  |
  v
+--------------------+
| Load Balancer      |
+--------------------+
   |        |        |
   v        v        v
+------+ +------+ +------+
| API  | | API  | | API  |
| #1   | | #2   | | #3   |
+------+ +------+ +------+
```

If one API instance fails:

```text
Load Balancer
   |
   +--> API #1 healthy
   +--> API #2 unhealthy  -> do not send traffic
   +--> API #3 healthy
```

## Horizontal vs. vertical scaling

### Vertical scaling

Give one server more resources.

```text
API server:
2 CPU / 4 GB RAM
      |
      v
8 CPU / 32 GB RAM
```

- **Pros:** simple; no application changes in many cases.
- **Cons:** has a maximum limit; does not remove single-server failure risk.

### Horizontal scaling

Run more application instances.

```text
1 API server
      |
      v
Many API servers behind a load balancer
```

- **Pros:** improves capacity and availability; instances can be replaced safely.
- **Cons:** requires stateless application design and more operational setup.

## Stateless application design

For horizontal scaling, do not keep important user state only in one server’s memory.

Unsafe:

```text
User logs in
   |
   v
API #1 memory stores session
   |
Next request goes to API #2
   |
   v
Session is missing
```

Better:

```text
User request
   |
   v
Any API instance
   |
   v
Shared secure session store / signed secure token
```

Session data must be protected:

- Use secure, HttpOnly, `SameSite=Strict` cookies where appropriate.
- Use TLS for all traffic.
- Store sessions in a shared protected store if server-side sessions are required.
- Rotate session IDs after login.
- Do not store access tokens or secrets in application logs.

### Pros

- Supports increased traffic.
- Removes a single API-server failure point.
- Enables rolling deployments.
- Allows automatic scaling where infrastructure supports it.

### Cons

- Does not automatically scale the database.
- Shared state becomes more visible and must be designed carefully.
- More instances can overload downstream services faster.

### Problem left behind

Adding API instances may simply send more requests to an already overloaded database.

This leads to caching.

---

# Solution 3: Caching

A **cache** stores temporary copies of frequently used data.

```text
User
  |
  v
API
  |
  +--> Cache hit  -> return quickly
  |
  +--> Cache miss -> database -> store result -> return
```

Example: public product details may be read thousands of times but change only occasionally.

```text
Without cache:
Every product request -> database

With cache:
Most product requests -> cache
```

## Cache-aside pattern

A common process:

```text
1. Read cache.
2. If data exists, return it.
3. If not, query the database.
4. Store result with an expiry.
5. Return result.
```

## Good candidates for caching

- Public product catalog information.
- Read-heavy reference data.
- Expensive computed reports.
- Frequently reused configuration.
- Static assets through a CDN.

## Poor candidates for caching

- Payment balances.
- Authorization decisions without strict invalidation.
- Private data in shared caches.
- Data requiring immediate consistency.

### Pros

- Reduces latency.
- Reduces database load.
- Increases capacity for read-heavy workloads.
- Can reduce external API usage and cost.

### Cons

- Data can become stale.
- Incorrect cache keys can leak data between users or tenants.
- Cache outages may suddenly overload the database.
- Invalidating cached values is difficult.

## Security rules

```text
Private data cache key:
tenant:{tenantId}:user:{userId}:resource:{resourceId}
```

Never use a generic shared key for user-specific content:

```text
Unsafe:
profile:123
```

Also:

- Authorize before returning private cached data.
- Do not cache passwords, tokens, payment details, or secrets.
- Use short expiration for permission-sensitive data.
- Set correct HTTP cache-control headers.
- Treat cache access as privileged infrastructure access.

### Problem left behind

Caching reduces normal load, but external dependencies can still become slow or unavailable.

This leads to timeouts, retries, and circuit breakers.

---

# Solution 4: Timeouts and Retries

Network calls can fail because of temporary problems:

- Brief network interruption.
- Dependency overload.
- DNS failure.
- Connection reset.
- Short service restart.

## Timeouts

A request should not wait forever.

```text
Orders API -> Payment Provider
                  |
                  v
             No response
                  |
                  v
Timeout after a defined limit
```

Without timeouts, waiting requests consume connections, memory, and workers until the whole application becomes unavailable.

## Retries

A retry repeats an operation after a temporary failure.

```text
Attempt 1 -> temporary failure
      |
      v
Wait briefly
      |
      v
Attempt 2 -> success
```

### Exponential backoff with jitter

Do not retry immediately and repeatedly.

```text
Retry delay:

Attempt 1: 100 ms
Attempt 2: 200 ms
Attempt 3: 400 ms
```

Add random variation (**jitter**) so many clients do not retry at the same moment.

```text
Without jitter:
Many clients retry together -> dependency overload

With jitter:
Retries spread over time
```

### Retry only safe operations

Retries can create duplicate side effects.

```text
Capture payment
   |
   v
Provider completes charge, but response is lost
   |
   v
Application retries
   |
   v
Customer may be charged twice
```

For side-effecting operations, use an idempotency key or a provider-supported idempotency mechanism.

### Pros

- Recovers from temporary faults.
- Improves success rate for reliable dependencies.
- Timeouts prevent resource exhaustion.

### Cons

- Retries can make overload worse.
- Incorrect retries can duplicate orders, emails, or payments.
- Timeout values require monitoring and tuning.
- Retrying permanent failures wastes resources.

### Problem left behind

When a dependency is consistently failing, retries keep sending traffic to a system that cannot recover.

This leads to circuit breakers.

---

# Solution 5: Circuit Breakers

A **circuit breaker** stops calls to an unhealthy dependency for a temporary period.

```text
Orders API -> Payment provider fails repeatedly
                     |
                     v
               Circuit opens
                     |
                     v
Orders API fails fast instead of waiting
```

## Circuit breaker states

```text
Closed
  |
  | failures exceed threshold
  v
Open
  |
  | wait for recovery period
  v
Half-open
  |
  +--> test call succeeds -> Closed
  |
  +--> test call fails    -> Open
```

### Closed

Calls are allowed normally.

### Open

Calls are blocked immediately. The application returns a safe fallback or a clear retry-later response.

### Half-open

A small number of test requests check whether the dependency has recovered.

## Example safe fallback

For a product-recommendation service:

```text
Recommendations unavailable
   |
   v
Show no recommendations or cached recommendations
```

For payment capture:

```text
Payment provider unavailable
   |
   v
Do not mark order as paid
   |
   v
Return: "Payment is temporarily unavailable. Try again later."
```

Never use a fallback that invents success for a financial or security-sensitive operation.

### Pros

- Prevents resource exhaustion during outages.
- Stops cascading failures.
- Helps unhealthy dependencies recover.
- Produces faster, more predictable failure behavior.

### Cons

- Users may receive immediate failure while the dependency is recovering.
- Wrong thresholds can open too early or too late.
- Requires safe fallback behavior.
- Does not fix the dependency itself.

### Problem left behind

A system can handle normal failures, but it still needs to know how much traffic and resource use it is designed to support.

This leads to capacity planning.

---

# Solution 6: Capacity Planning

**Capacity planning** estimates what resources the system needs for expected and peak workloads.

It answers questions such as:

- How many requests per second must the API handle?
- How many orders can be processed per minute?
- How fast will the database grow?
- How much queue backlog is acceptable?
- What happens during a marketing campaign?
- Can the system handle one instance failing?

## Start with workload assumptions

Example:

| Workload | Normal | Peak |
|---|---:|---:|
| Product page requests | 100 requests/second | 1,000 requests/second |
| Checkout requests | 5 requests/second | 50 requests/second |
| Orders created | 2/minute | 40/minute |
| Email jobs | 10/minute | 100/minute |
| New product images | 20/day | 2,000/day |

Then define targets:

```text
Product API: p95 below 300 ms
Checkout API: p95 below 800 ms
Order processing: completed within 60 seconds
Availability: 99.9%
```

## Plan for failure, not only average load

```text
Three API instances normally
      |
      v
One instance fails
      |
      v
Two remaining instances must still handle peak required traffic
```

This is often called **N+1 capacity**: enough capacity for the expected load plus one component failure.

## Queue capacity

For asynchronous work, monitor:

```text
Queue depth
Processing rate
Oldest message age
Failure rate
Dead-letter queue count
```

A queue can hide overload temporarily. A growing queue means work is arriving faster than it is being processed.

```text
Incoming jobs: 100/minute
Workers process: 60/minute
       |
       v
Backlog grows by 40/minute
```

### Pros

- Reduces production surprises.
- Supports sensible infrastructure budgets.
- Identifies bottlenecks before critical events.
- Creates realistic scaling and recovery plans.

### Cons

- Forecasts can be wrong.
- Requires load tests and production monitoring.
- Must be reviewed as product usage changes.

### Problem left behind

Even a well-sized system can fail unexpectedly. Teams need visibility to detect, diagnose, and respond to problems.

This leads to observability.

---

# Solution 7: Observability

**Observability** means understanding what the system is doing from its outputs.

The three main signals are:

```text
Metrics  -> numbers over time
Logs     -> detailed events
Traces   -> one request across components
```

## Metrics

Examples:

```text
HTTP request count
p95 latency
error rate
CPU and memory usage
database connection count
queue depth
cache hit ratio
```

## Logs

Logs should explain important events:

```text
Order creation succeeded
Payment provider timed out
Inventory reservation failed
```

Do not log:

- Passwords.
- Access tokens.
- Session identifiers.
- Full payment details.
- Sensitive personal data unless necessary and protected.

## Distributed traces

A trace follows one request across services.

```text
Request ID: abc-123

Web -> Orders API -> Inventory API -> Database
                     |
                     +--> 2.4 second delay found here
```

### Pros

- Faster incident diagnosis.
- Detects hidden dependency delays.
- Supports capacity planning with real data.
- Helps validate whether reliability targets are met.

### Cons

- Adds instrumentation work and operating cost.
- Excessive logging can be expensive and create privacy risk.
- Monitoring without alerts and ownership does not help.

---

# One TypeScript Example: Retry with Backoff and Timeout

This example retries only a retryable operation. It uses a timeout and exponential backoff with jitter.

```typescript name=src/shared/resilience/retry-with-timeout.ts
export type RetryOptions = Readonly<{
  maxAttempts: number;
  timeoutMs: number;
  initialDelayMs: number;
  maxDelayMs: number;
}>;

export class TimeoutError extends Error {
  constructor() {
    super("The operation timed out.");
  }
}

export async function retryWithTimeout<T>(
  operation: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  if (
    !Number.isSafeInteger(options.maxAttempts) ||
    options.maxAttempts < 1 ||
    !Number.isSafeInteger(options.timeoutMs) ||
    options.timeoutMs < 1
  ) {
    throw new Error("Invalid retry options.");
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      return await withTimeout(operation(), options.timeoutMs);
    } catch (error) {
      lastError = error;

      const isFinalAttempt = attempt === options.maxAttempts;
      if (isFinalAttempt || !isRetryable(error)) {
        throw error;
      }

      const delay = calculateBackoffWithJitter(attempt, options);
      await sleep(delay);
    }
  }

  throw lastError;
}

async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError()), timeoutMs);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

function isRetryable(error: unknown): boolean {
  return error instanceof TimeoutError;
}

function calculateBackoffWithJitter(
  attempt: number,
  options: RetryOptions,
): number {
  const exponentialDelay = Math.min(
    options.initialDelayMs * 2 ** (attempt - 1),
    options.maxDelayMs,
  );

  // Randomize delay by ±20% to avoid synchronized retry storms.
  const jitterFactor = 0.8 + Math.random() * 0.4;
  return Math.round(exponentialDelay * jitterFactor);
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
```

## Important usage rule

Use this only for operations that are safe to retry.

```text
Safe examples:
- Read a product from a temporary unavailable service.
- Fetch public exchange-rate data.

Requires idempotency protection:
- Create an order.
- Capture a payment.
- Send an email.
- Publish a message.
```

For production code, also use:

- Request cancellation with `AbortSignal`.
- Dependency-specific error classification.
- Metrics for attempts, timeout rates, and final failures.
- Circuit breakers for repeatedly failing dependencies.
- Idempotency keys for operations with side effects.

---

# When to Choose Which

| Problem | Design approach |
|---|---|
| Users experience slow responses | Measure latency, identify bottleneck, optimize the real cause |
| One API server cannot handle demand | Load balancer and horizontal scaling |
| Database receives repeated read requests | Caching, after confirming correctness requirements |
| A dependency is briefly unavailable | Timeout and limited retry with backoff |
| A dependency repeatedly fails | Circuit breaker and safe fallback |
| Background work overloads user requests | Queue and independent workers |
| The system’s traffic is growing or uncertain | Capacity planning and load testing |
| An incident is difficult to diagnose | Metrics, structured logs, and distributed traces |
| A server failure causes downtime | Redundant instances and health checks |

---

# Practical Design Sequence

```text
1. Define measurable targets.
       |
       v
2. Measure current behavior.
       |
       v
3. Remove obvious bottlenecks.
       |
       v
4. Add horizontal API scaling and health checks.
       |
       v
5. Cache safe read-heavy data.
       |
       v
6. Add timeouts, limited retries, and circuit breakers.
       |
       v
7. Plan capacity for peak load and component failure.
       |
       v
8. Monitor, test, and revise continuously.
```

---

# Key Takeaways

- Measure before optimizing; use p95 and p99 latency, not only averages.
- Use a **load balancer** and stateless application instances for horizontal scaling.
- Use **caching** for safe, read-heavy data, with correct authorization and invalidation.
- Every network call needs a **timeout**.
- Use limited **retries with exponential backoff and jitter** only for safe or idempotent operations.
- Use **circuit breakers** to prevent failures from spreading.
- Use **capacity planning** to prepare for peaks and component failures, not average traffic alone.
- Use **metrics, logs, and traces** to understand production behavior.
- Never trade away correctness or security for speed: payments, authorization, and sensitive data require fail-safe behavior.

**Next topic: 2.10 Security architecture** — authentication, authorization, OAuth 2.0/OIDC, zero trust, STRIDE threat modeling, and secrets management.

---

# 2.10 Security Architecture

**Security architecture** defines how a system protects users, data, services, and infrastructure.

It answers questions such as:

- Who is making this request?
- What are they allowed to do?
- Can one customer access another customer’s data?
- How are services trusted internally?
- Where are passwords, API keys, and certificates stored?
- What happens if an attacker sends malformed or malicious input?

Security must be designed into the system. Adding it only near release time leaves dangerous gaps.

---

## Problem: Trusting Requests by Default

An insecure system may behave like this:

```text
Request: GET /orders/123
       |
       v
API reads order 123
       |
       v
Returns order details
```

This is unsafe because the API does not know:

- Who made the request.
- Whether they own order `123`.
- Whether they are permitted to view payment or address information.
- Whether the request is malicious.

Common security failures include:

- Stolen passwords or tokens.
- Users accessing other users’ records.
- Hardcoded secrets in source code.
- Overly broad service permissions.
- SQL injection, XSS, or path traversal.
- Unencrypted network traffic.
- Logging private data.
- Internal services trusting each other without verification.

---

# Solution 1: Authentication

**Authentication (AuthN)** verifies **who** is making a request.

```text
User
  |
  | proves identity
  v
Identity Provider
  |
  v
Authenticated session or token
```

Examples of authentication methods:

| Method | Typical use |
|---|---|
| Password + MFA | Human user login |
| Passkeys | Passwordless user login |
| OpenID Connect (OIDC) | Application sign-in through an identity provider |
| Client credentials | Service-to-service access |
| Mutual TLS (mTLS) | Workload/service identity |
| API key | Limited machine integration; use carefully |

## Password handling

If an application must store passwords:

- Hash passwords using **Argon2id** or **bcrypt**.
- Never encrypt passwords for later recovery.
- Never log passwords.
- Use multi-factor authentication for sensitive accounts.
- Rate-limit login attempts.
- Use account lockout or progressive delays carefully to reduce brute-force attacks.
- Reset passwords through expiring, single-use tokens.

A better option is often to use a managed identity provider, which reduces the need to build password storage, MFA, account recovery, and breach detection internally.

### Pros

- Identifies users and services.
- Creates a basis for audit logging.
- Supports secure sessions and access tokens.
- Allows MFA and centralized identity policies.

### Cons

- Authentication alone does not control access.
- Token validation and session handling must be correct.
- Identity-provider outages need a defined operational plan.

### Problem left behind

Knowing that a user is Alice does not answer whether Alice may access an invoice, delete a project, or refund an order.

This leads to authorization.

---

# Solution 2: Authorization

**Authorization (AuthZ)** verifies **what an authenticated identity may do**.

```text
Authenticated user: Alice
          |
          v
Requests order 123
          |
          v
Is Alice allowed to read this specific order?
          |
      +---+---+
      |       |
     Yes      No
      |       |
   Return    Deny
```

## Authentication vs authorization

```text
Authentication: "Who are you?"
Authorization:  "Are you allowed to do this?"
```

Both are required.

## Role-Based Access Control (RBAC)

RBAC assigns permissions through roles.

```text
User
  |
  +--> Customer role
  |      └--> orders:read:own
  |
  +--> Support role
  |      └--> orders:read:any
  |
  +--> Finance role
         └--> payments:refund
```

### Pros

- Easy to understand.
- Good for stable organizational roles.
- Simple to administer.

### Cons

- Roles can grow excessively.
- Roles may not express ownership or tenant rules.
- A role alone may be too broad.

## Attribute-Based Access Control (ABAC)

ABAC uses attributes of the user, resource, and request.

```text
Allow when:
  order.tenantId == user.tenantId
  AND order.customerId == user.id
```

Or:

```text
Allow refund when:
  user.department == "finance"
  AND order.amount < approvalThreshold
  AND request.region is allowed
```

### Pros

- Fine-grained and flexible.
- Supports tenant isolation and ownership rules.
- Better for complex business policies.

### Cons

- Rules can become difficult to understand.
- Requires strong testing and audit logging.

## Deny by default

A secure authorization design begins with denial:

```text
No matching permission or policy
          |
          v
        Deny access
```

Do not allow access merely because a user is logged in.

## Resource-level authorization

This is essential:

```text
Unsafe:
User is authenticated -> return requested order

Safe:
User is authenticated
    +
User has permission to read this specific order
    +
Order belongs to the user's tenant
    ->
Return order
```

### Problem left behind

Custom authentication and token handling are difficult to build safely. Applications need a standard way to delegate sign-in and validate identity information.

This leads to OAuth 2.0 and OpenID Connect.

---

# Solution 3: OAuth 2.0 and OpenID Connect

**OAuth 2.0** is an authorization framework. It allows an application to receive limited access to an API without handling a user’s password.

**OpenID Connect (OIDC)** adds authentication on top of OAuth 2.0.

```text
User
  |
  v
Application
  |
  | redirect for sign-in
  v
Identity Provider
  |
  | authenticated identity response
  v
Application
```

## Important tokens

| Token | Purpose | Important rule |
|---|---|---|
| ID token | Identifies the authenticated user to the client application | Do not use it as an API authorization token |
| Access token | Authorizes calls to an API | Validate it at the API |
| Refresh token | Obtains new access tokens | Protect carefully; do not expose to browser JavaScript when avoidable |

## Secure browser sign-in flow

For browser and mobile apps, use:

```text
Authorization Code Flow + PKCE
```

```text
Browser app
    |
    | authorization request with PKCE challenge
    v
Identity provider
    |
    | authorization code
    v
Browser app / backend
    |
    | code + PKCE verifier
    v
Identity provider
    |
    v
Tokens/session
```

PKCE protects the authorization code from being reused by an attacker.

## API token validation

An API should validate at least:

```text
Access token
   |
   +--> signature
   +--> issuer
   +--> audience
   +--> expiration
   +--> not-before time, if present
   +--> authorized scopes/permissions
```

Never accept a token simply because it looks like a JWT.

### Pros

- Avoids storing user passwords in every application.
- Supports SSO, MFA, account recovery, and centralized policies.
- Uses standardized protocols.
- Enables scoped access tokens.

### Cons

- Token flows and configuration are easy to misconfigure.
- Token revocation and expiry need clear handling.
- Identity does not replace application-specific authorization.
- An identity-provider dependency must be monitored.

### Security rules

- Use HTTPS everywhere.
- Use Authorization Code Flow with PKCE for browser/mobile sign-in.
- Validate issuer, audience, signature, expiry, and permissions.
- Use short-lived access tokens.
- Do not place tokens in URLs.
- Avoid storing long-lived tokens in browser-accessible storage.
- Rotate signing keys and client secrets.
- Keep authorization decisions in the API, not only in the UI.

### Problem left behind

Even valid identity tokens do not make internal networks safe. An attacker who gains access to one service or network segment must not automatically gain access to everything.

This leads to zero trust.

---

# Solution 4: Zero Trust Architecture

**Zero trust** means:

> Never automatically trust a request because it comes from an internal network, VPN, or another service.

Every request must prove identity and permission.

```text
Traditional assumption:
Internal network -> trusted

Zero trust:
Internal network -> verify identity, authorization, and request context
```

## Zero trust service communication

```text
Orders Service
   |
   | TLS / mTLS + short-lived service identity
   v
Payments Service
   |
   +--> verifies caller identity
   +--> authorizes payment action
   +--> validates request data
```

## Core principles

| Principle | Meaning |
|---|---|
| Verify explicitly | Authenticate and authorize every request |
| Least privilege | Grant only minimum required permissions |
| Assume breach | Limit lateral movement if one system is compromised |
| Segment access | Restrict network, data, and service boundaries |
| Monitor continuously | Detect suspicious behavior and failures |

## Least privilege example

```text
Notification worker:
  Can read: notification queue
  Can call: email provider
  Cannot read: payment database
  Cannot refund: payments
  Cannot administer: cloud account
```

### Pros

- Limits damage from stolen credentials or compromised services.
- Supports strong tenant and service isolation.
- Reduces reliance on network location.
- Encourages explicit security boundaries.

### Cons

- Requires identity, policy, certificate, and network management.
- Can increase operational complexity.
- Poorly designed policies can block legitimate traffic.

### Problem left behind

Zero trust protects boundaries, but teams must systematically identify threats before they become incidents.

This leads to threat modeling.

---

# Solution 5: STRIDE Threat Modeling

**Threat modeling** is a structured way to ask:

> How could this design be abused, fail, or be attacked?

**STRIDE** is a common threat-modeling method.

| Threat | Meaning | Example mitigation |
|---|---|---|
| **S**poofing | Pretending to be another user/service | MFA, OIDC validation, mTLS |
| **T**ampering | Changing data or messages | TLS, signatures, integrity checks, authorization |
| **R**epudiation | Denying an action occurred | Immutable audit logs, correlation IDs |
| **I**nformation disclosure | Exposing private data | Encryption, access controls, data minimization |
| **D**enial of service | Making a system unavailable | Rate limits, queues, autoscaling, circuit breakers |
| **E**levation of privilege | Gaining unauthorized permissions | Least privilege, authorization tests, secure admin controls |

## Simple threat-model diagram

```text
Customer Browser
       |
       | HTTPS
       v
+------------------+
| Store API        |
+------------------+
   |            |
   |            +--> Payment Provider
   |
   v
+------------------+
| Orders Database  |
+------------------+
```

Questions to ask:

```text
Browser -> API:
- Can someone steal or replay a token?
- Can one user access another user's order?
- Is input validated and rate-limited?

API -> Database:
- Does the database account have only required permissions?
- Are queries parameterized?
- Are backups encrypted?

API -> Payment Provider:
- Is the provider endpoint allow-listed?
- Are timeouts and idempotency used?
- Are payment details excluded from logs?
```

## Threat modeling process

```text
1. Draw the system and trust boundaries.
2. Identify data, actors, and external dependencies.
3. Apply STRIDE questions to each boundary.
4. Record threats and mitigations.
5. Assign owners and priority.
6. Validate through tests, reviews, and monitoring.
```

### Pros

- Finds security risks early.
- Encourages design-level security instead of patching later.
- Creates shared understanding between engineers and security teams.
- Helps prioritize effort by impact.

### Cons

- Requires time and collaboration.
- Can become a checklist exercise if not connected to implementation.
- Must be updated when architecture changes.

### Problem left behind

Threat modeling may reveal that secrets such as API keys, database passwords, signing keys, and certificates are exposed through source code, configuration, or logs.

This leads to secrets management.

---

# Solution 6: Secrets Management

A **secret** is sensitive information that grants access or reveals protected data.

Examples:

```text
Database passwords
API keys
OAuth client secrets
Signing keys
TLS private keys
Webhook signing secrets
Encryption keys
```

## Never hardcode secrets

Unsafe:

```text
const databasePassword = "production-password";
```

Also unsafe:

```text
const paymentApiKey = process.env.PAYMENT_API_KEY ?? "test-key";
```

A fallback can accidentally become active in production.

## Safer design

```text
Application
    |
    | workload identity
    v
Secret manager
    |
    v
Short-lived secret / credential
```

Examples of secret storage approaches:

- Cloud secret manager.
- Managed key vault.
- Kubernetes secret integration with external secret manager.
- Secure CI/CD secret store.
- Environment variables injected only at runtime, for smaller deployments.

Environment variables can be appropriate, but they need protection:

- Do not commit `.env` files containing secrets.
- Do not display secrets in CI logs.
- Restrict process and deployment access.
- Rotate secrets.
- Avoid passing secrets in command-line arguments, which may be visible to other processes.

## Rotation

Secrets should be rotated without unnecessary downtime.

```text
Old key active
    |
    +--> introduce new key
    |
    +--> deploy consumers that accept/use new key
    |
    +--> verify
    |
    +--> revoke old key
```

### Pros

- Reduces risk of source-control leaks.
- Centralizes access control and audit logs.
- Supports rotation and revocation.
- Limits long-lived credentials.

### Cons

- Adds deployment and operational dependencies.
- Applications need a secure startup and renewal process.
- A secret manager does not help if overly broad access policies remain.

---

# One TypeScript Example: Resource-Level Authorization

This example checks permission, tenant isolation, and ownership before returning an order.

```typescript name=src/orders/application/get-authorized-order.ts
export type Actor = Readonly<{
  userId: string;
  tenantId: string;
  permissions: readonly string[];
}>;

export type Order = Readonly<{
  id: string;
  tenantId: string;
  customerId: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  totalCents: number;
}>;

export interface OrderRepository {
  findById(orderId: string): Promise<Order | null>;
}

export class NotFoundError extends Error {
  constructor() {
    super("Order not found.");
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You are not allowed to access this order.");
  }
}

export async function getAuthorizedOrder(
  actor: Actor,
  orderId: string,
  orders: OrderRepository,
): Promise<Order> {
  if (!isUuid(orderId)) {
    throw new NotFoundError();
  }

  const order = await orders.findById(orderId);

  // Return "not found" for unknown or inaccessible resources to reduce
  // information disclosure about other tenants' records.
  if (order === null || order.tenantId !== actor.tenantId) {
    throw new NotFoundError();
  }

  const canReadAnyOrder = actor.permissions.includes("orders:read:any");
  const isOrderOwner = order.customerId === actor.userId;

  // Deny by default. Being authenticated is not enough.
  if (!canReadAnyOrder && !isOrderOwner) {
    throw new ForbiddenError();
  }

  return order;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
```

## What this protects

```text
Request for order
      |
      v
Validate identifier
      |
      v
Verify tenant match
      |
      v
Verify owner or explicit privileged permission
      |
      v
Return only authorized data
```

This reduces the risk of:

- **IDOR/BOLA:** changing an ID to access another customer’s order.
- **Cross-tenant access:** retrieving data from another organization.
- **Overly broad authorization:** treating every authenticated user as privileged.
- **Information disclosure:** confirming whether inaccessible records exist.

In production, the database query should ideally include `tenant_id` directly, and the API should authenticate the actor before calling this use case.

---

# When to Choose Which

| Need | Choose |
|---|---|
| Verify a user or service identity | **Authentication** |
| Decide whether identity can perform an action | **Authorization** |
| Stable organization-wide permissions | **RBAC** |
| Ownership, tenant, time, location, or contextual rules | **ABAC or policy-based authorization** |
| User sign-in through an identity provider | **OIDC** |
| Delegated API access | **OAuth 2.0** |
| Browser/mobile sign-in | **Authorization Code Flow with PKCE** |
| Secure internal service calls | **Zero trust, workload identity, TLS/mTLS where appropriate** |
| Find design-level security risks | **STRIDE threat modeling** |
| Store keys, credentials, and certificates | **Managed secrets manager/key vault** |

---

# Practical Security Architecture Flow

```text
1. Authenticate the user or service.
          |
          v
2. Validate token/session identity.
          |
          v
3. Authorize the requested action on the specific resource.
          |
          v
4. Validate all input and enforce business rules.
          |
          v
5. Access only permitted data with least-privilege credentials.
          |
          v
6. Encrypt traffic and sensitive data.
          |
          v
7. Record safe audit and operational events.
          |
          v
8. Monitor, alert, rotate secrets, and review threats.
```

---

# Key Takeaways

- **Authentication** proves identity; **authorization** controls access.
- Always authorize actions against the specific resource, tenant, and ownership context.
- Use **OAuth 2.0** for delegated authorization and **OIDC** for user authentication.
- Use Authorization Code Flow with **PKCE** for browser and mobile sign-in.
- Treat internal traffic as untrusted: apply **zero trust**, short-lived identities, TLS, and least privilege.
- Use **STRIDE** to identify threats early in design.
- Store secrets in managed secret storage, never source code or logs.
- Deny by default, validate every input, rate-limit abuse-prone endpoints, avoid exposing internal errors, and audit sensitive actions safely.

**Next topic: 2.11 UX/UI design and mockups** — information architecture, wireframes, mockups, prototypes, design systems, WCAG accessibility, and internationalization.

---

# 2.11 UX/UI Design and Mockups

**UX** means **user experience**: how easy, clear, and safe a product is to use.

**UI** means **user interface**: the visible controls, layout, colors, typography, and interactions.

A good interface helps users complete a goal with minimal confusion.

```text
User goal
   |
   v
Clear information
   |
   v
Understandable screen
   |
   v
Accessible interaction
   |
   v
Successful outcome
```

---

## Problem: Building Screens Before Understanding User Needs

A team may start by designing attractive screens immediately:

```text
"We need an order page."
       |
       v
Start drawing buttons and cards
```

This often creates problems:

- Users cannot find important actions.
- The page has too much information.
- The workflow has too many steps.
- Error messages are unclear.
- Keyboard and screen-reader users cannot complete tasks.
- Text does not fit in other languages.
- Developers receive mockups with missing states, such as loading or errors.

A visually attractive screen can still provide a poor experience.

---

# Solution 1: Information Architecture

**Information architecture (IA)** decides how content and features are organized so users can find what they need.

Before designing a page, identify:

1. **Who is the user?**
2. **What goal are they trying to achieve?**
3. **What information do they need first?**
4. **What action should they take next?**

## Example: Online store account area

Bad navigation:

```text
Home
Products
Orders
Profile
Settings
Account
My Stuff
History
Help
```

Users may not know whether “Orders,” “History,” or “My Stuff” contains past purchases.

Better navigation:

```text
Account
 ├─ Profile
 ├─ Orders
 ├─ Saved addresses
 ├─ Payment methods
 └─ Security
```

## User flow

A **user flow** shows the steps a user takes to complete a goal.

```text
View product
     |
     v
Add to cart
     |
     v
Review cart
     |
     v
Enter shipping details
     |
     v
Pay
     |
     v
See order confirmation
```

A good flow includes failure paths:

```text
Pay
 |
 +--> Payment succeeds -> confirmation
 |
 +--> Payment fails -> explain problem -> let user retry safely
```

### Pros

- Organizes screens around user goals.
- Prevents confusing navigation.
- Identifies unnecessary steps early.
- Helps product, design, and engineering agree on the workflow.

### Cons

- Requires user research or stakeholder input.
- Different user types may need different navigation.
- A flow alone does not define layout or visual design.

### Problem left behind

Knowing the correct pages and flow does not show whether users can understand the layout.

This leads to wireframes.

---

# Solution 2: Wireframes

A **wireframe** is a low-detail layout that shows page structure and priority.

It focuses on:

- Content placement
- Navigation
- Actions
- User flow
- Information hierarchy

It does **not** focus on final colors, fonts, illustrations, or polished visual details.

## Example wireframe: order details

```text
+---------------------------------------------------+
| Account > Orders > Order #1042                    |
+---------------------------------------------------+
| Order status: Shipped                              |
|                                                   |
| Items                                              |
| - Keyboard                       $80.00            |
| - Mouse                          $25.00            |
|                                                   |
| Total                            $105.00           |
|                                                   |
| [ Track shipment ]   [ Download invoice ]          |
+---------------------------------------------------+
```

Wireframes answer questions such as:

- Is the primary action obvious?
- Is the most important information visible first?
- Does the workflow contain unnecessary controls?
- Can users find help when something goes wrong?

### Pros

- Fast and inexpensive to change.
- Keeps discussion focused on structure, not decoration.
- Helps find missing screens and states early.
- Works well in sketches, whiteboards, or tools such as Figma.

### Cons

- Users may find it difficult to imagine the final product.
- Does not validate color contrast, typography, or visual hierarchy fully.
- Can hide interaction details.

### Problem left behind

A wireframe shows structure, but stakeholders may need to review the realistic visual experience.

This leads to mockups.

---

# Solution 3: Mockups

A **mockup** is a high-detail static design of a screen.

It usually includes:

- Realistic text
- Colors
- Typography
- Spacing
- Icons
- Buttons
- Form styles
- Brand design

```text
Wireframe:                 Mockup:

[ Button ]                 [ Blue "Track shipment" button ]
Simple boxes               Final typography and spacing
Placeholder text           Real order details and labels
```

## Example screen states to design

A mockup should not show only the successful state.

For an order page, include:

```text
1. Loading state
2. Order found
3. Order not found
4. Access denied
5. Network error
6. Empty order history
7. Payment pending
8. Refund requested
```

```text
Order history
     |
     +--> Has orders  -> show list
     |
     +--> No orders   -> explain and link to products
     |
     +--> Error       -> clear retry guidance
```

### Pros

- Lets stakeholders review the expected final appearance.
- Supports consistent developer implementation.
- Reveals visual hierarchy, contrast, and spacing issues.
- Helps define design-system components.

### Cons

- Takes longer to create than a wireframe.
- Can create a false impression that interactions are complete.
- High-detail work is wasteful if the user flow is still uncertain.

### Problem left behind

A mockup is static. It cannot show how users move through the interface, enter data, or recover from errors.

This leads to prototypes.

---

# Solution 4: Prototypes

A **prototype** simulates interaction between screens.

A prototype can range from simple clickable wireframes to high-detail interactive mockups.

```text
Product page
     |
     | click "Add to cart"
     v
Cart drawer
     |
     | click "Checkout"
     v
Shipping form
     |
     | submit
     v
Payment screen
```

Tools such as **Figma** can link screens into a clickable prototype for usability review.

## What prototypes validate

- Can users find the next action?
- Do labels make sense?
- Are steps in the expected order?
- Can users recover from mistakes?
- Is the process too long?
- Do confirmation messages build confidence?

### Example: payment failure flow

```text
Enter payment details
        |
        v
Payment declined
        |
        +--> Explain clearly without exposing provider internals
        |
        +--> Keep safe non-sensitive form data where appropriate
        |
        +--> Offer retry or another payment method
```

Avoid vague errors:

```text
"Error 500"
```

Prefer:

```text
"We could not complete your payment. Check your payment details or try another method."
```

Do not reveal sensitive details such as fraud rules, internal provider errors, or whether a specific card is valid.

### Pros

- Finds usability problems before development.
- Makes workflows easier for non-technical stakeholders to test.
- Reduces costly late changes.
- Helps validate loading, error, and success states.

### Cons

- A prototype does not prove technical feasibility.
- It can become expensive if too polished too early.
- It may not accurately represent real performance or accessibility unless tested carefully.

### Problem left behind

Individual mockups and prototypes can look inconsistent when every team or developer creates controls differently.

This leads to design systems.

---

# Solution 5: Design Systems

A **design system** is a shared collection of reusable visual rules, UI components, and usage guidance.

```text
Design system
   |
   +--> Colors
   +--> Typography
   +--> Spacing
   +--> Buttons
   +--> Forms
   +--> Dialogs
   +--> Tables
   +--> Error messages
   +--> Accessibility rules
```

## Example component model

```text
Button
 ├─ Primary
 ├─ Secondary
 ├─ Destructive
 └─ Disabled
```

Each variation has defined behavior.

```text
Primary button:
- Main action on a screen
- Clear accessible label
- Visible keyboard focus
- Disabled only when action cannot be performed

Destructive button:
- Used for irreversible actions
- Requires clear warning or confirmation when appropriate
```

## Design tokens

**Design tokens** are reusable values used by both design and code.

```text
Color:
  primary = blue
  error = red
  text = dark gray

Spacing:
  small = 8px
  medium = 16px
  large = 24px
```

This prevents each screen from inventing slightly different colors and spacing.

### Pros

- Creates a consistent experience.
- Makes development faster through reusable components.
- Centralizes accessibility fixes.
- Reduces visual regressions.
- Improves collaboration between designers and developers.

### Cons

- Requires maintenance and ownership.
- A large system can become difficult to change.
- Teams may misuse components outside their intended purpose.
- It should not stop product-specific design when necessary.

### Problem left behind

Consistent components do not automatically make the product usable by people with disabilities.

This leads to accessibility.

---

# Solution 6: Accessibility (WCAG)

**Accessibility** means people with disabilities can use the product.

This includes users who:

- Navigate only with a keyboard.
- Use screen readers.
- Have low vision or color blindness.
- Need larger text or browser zoom.
- Have limited motor control.
- Have cognitive or learning differences.
- Use a slow network or older device.

The **Web Content Accessibility Guidelines (WCAG)** provide widely used accessibility guidance. A common target is **WCAG 2.2 Level AA**.

## Essential accessibility requirements

### 1. Use semantic HTML

Use the HTML element that matches the meaning.

```text
Use:
<button>Save</button>

Not:
<div onclick="save()">Save</div>
```

A native button provides keyboard behavior, focus behavior, and semantics automatically.

### 2. Support keyboard navigation

Every interactive control must be usable without a mouse.

```text
Tab -> focus next interactive element
Enter / Space -> activate control
Escape -> close dialog where appropriate
```

Focus must always be visible.

```text
[ Track shipment ]
        ^
  visible focus indicator
```

### 3. Label form fields clearly

```text
Email address
[________________________]

Error: Enter a valid email address.
```

Do not rely only on placeholder text.

```text
Unsafe:
[ Enter email ]
```

Placeholders disappear when users type and are often not sufficient labels.

### 4. Do not use color alone

Bad:

```text
Red text = error
```

Better:

```text
⚠ Payment failed: Check your card details and try again.
```

Use text, icons, and appropriate accessible markup in addition to color.

### 5. Provide sufficient contrast

Text and controls must remain readable against their backgrounds. This includes focus indicators and error states.

### 6. Give errors clear instructions

Bad:

```text
Invalid input.
```

Better:

```text
Postal code must contain 5 to 10 letters or numbers.
```

### 7. Respect zoom and responsive layouts

Users should be able to zoom without content being hidden, overlapping, or requiring unnecessary horizontal scrolling.

### Pros

- Makes products usable by more people.
- Improves usability for everyone, including keyboard and mobile users.
- Reduces legal and compliance risk.
- Encourages clearer labels, errors, and navigation.

### Cons

- Requires design, development, and testing effort.
- Automated tools find only some issues.
- Retrofitting accessibility late is more expensive.

### Problem left behind

Even an accessible interface can fail for global users if text, date formats, addresses, and layouts assume one language or region.

This leads to internationalization.

---

# Solution 7: Internationalization (i18n)

**Internationalization (i18n)** prepares software for different languages, cultures, regions, and writing systems.

**Localization (l10n)** adapts the product for a specific language or region.

```text
i18n = design the product to support many locales
l10n = provide translated/localized content for one locale
```

## Common i18n problems

Hardcoded text:

```text
"Your order has shipped."
```

Assuming one date format:

```text
03/04/2026
```

Is that March 4 or April 3?

Assuming one currency format:

```text
$1,234.56
```

Assuming all names and addresses have the same shape:

```text
First name + last name + ZIP code
```

## Better approach

```text
Text key:
order.shipped

Locale:
en-GB -> "Your order has been dispatched."
fr-FR -> translated text
```

Use locale-aware formatting:

```text
Date: 13 October 2026
Currency: €1,234.56
```

## Layout considerations

Translated text can be longer.

```text
English:  "Save"
German:   "Speichern"
```

Some languages are written right-to-left.

```text
English: left-to-right
Arabic:  right-to-left
```

Avoid fixed widths that cut off translated content.

### Pros

- Makes future localization possible without rewriting the UI.
- Avoids confusing date, currency, and address formats.
- Supports a larger user base.
- Improves data correctness for international customers.

### Cons

- Adds translation workflow and testing needs.
- More text can create layout issues.
- Locale-specific legal, tax, and address rules can be complex.

---

# One TypeScript Example: Accessible, Localized Order Status

This TypeScript example creates an accessible order-status message using locale-aware date and currency formatting. It uses `textContent`, not `innerHTML`, which avoids injecting untrusted text as HTML.

```typescript name=src/ui/render-order-status.ts
export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type OrderSummary = Readonly<{
  orderReference: string;
  status: OrderStatus;
  totalCents: number;
  updatedAt: Date;
}>;

const statusMessageKeys: Readonly<Record<OrderStatus, string>> = {
  pending: "order.status.pending",
  paid: "order.status.paid",
  shipped: "order.status.shipped",
  cancelled: "order.status.cancelled",
};

const translations: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "en-GB": {
    "order.status.pending": "Your order is being processed.",
    "order.status.paid": "Your payment was received.",
    "order.status.shipped": "Your order has been dispatched.",
    "order.status.cancelled": "Your order was cancelled.",
  },
  "fr-FR": {
    "order.status.pending": "Votre commande est en cours de traitement.",
    "order.status.paid": "Votre paiement a été reçu.",
    "order.status.shipped": "Votre commande a été expédiée.",
    "order.status.cancelled": "Votre commande a été annulée.",
  },
};

export function renderOrderStatus(
  container: HTMLElement,
  order: OrderSummary,
  locale: "en-GB" | "fr-FR",
  currency: "GBP" | "EUR",
): void {
  if (!Number.isSafeInteger(order.totalCents) || order.totalCents < 0) {
    throw new Error("Order total must be a non-negative integer.");
  }

  const translation = translations[locale][statusMessageKeys[order.status]];

  const total = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(order.totalCents / 100);

  const updatedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(order.updatedAt);

  const heading = document.createElement("h2");
  heading.textContent = `Order ${order.orderReference}`;

  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.textContent = translation;

  const details = document.createElement("p");
  details.textContent = `Total: ${total}. Last updated: ${updatedAt}.`;

  // Remove only this controlled container's existing display content.
  // No user-supplied values are inserted as HTML.
  container.replaceChildren(heading, status, details);
}
```

## What this example demonstrates

```text
Order data
   |
   +--> localized status message
   +--> locale-aware currency
   +--> locale-aware date and time
   +--> safe text rendering
   +--> screen-reader announcement for status changes
```

Accessibility and security practices included:

- Uses semantic heading and paragraph elements.
- Announces status changes with `role="status"` and `aria-live="polite"`.
- Uses `Intl` for locale-aware dates and currency.
- Uses `textContent` instead of `innerHTML`, reducing XSS risk.
- Validates the monetary value before formatting.
- Does not assume a single date, currency, or language format.

In a production UI, visible strings should come from a maintained translation system rather than a small in-code map.

---

# When to Choose Which

| Need | Use |
|---|---|
| Organize pages, features, and navigation | **Information architecture** |
| Test page structure and content priority quickly | **Wireframes** |
| Review visual appearance and design consistency | **Mockups** |
| Test a workflow before building it | **Prototypes** |
| Reuse UI components and visual rules across products | **Design system** |
| Ensure people with disabilities can use the product | **Accessibility and WCAG** |
| Support multiple languages, regions, and writing systems | **Internationalization** |

---

# Practical UX/UI Workflow

```text
1. Identify users and their goals.
          |
          v
2. Create the information architecture and user flows.
          |
          v
3. Make low-detail wireframes.
          |
          v
4. Test the workflow and improve it.
          |
          v
5. Create high-detail mockups.
          |
          v
6. Build a prototype for important interactions.
          |
          v
7. Apply design-system components.
          |
          v
8. Validate accessibility and internationalization.
          |
          v
9. Implement loading, empty, error, and success states.
```

---

# Key Takeaways

- Start with user goals and information architecture, not visual decoration.
- Use **wireframes** for structure, **mockups** for visual design, and **prototypes** for interaction.
- Include loading, empty, error, permission-denied, and success states—not only the ideal path.
- Use a **design system** to keep components consistent and reusable.
- Build accessibility in from the beginning: semantic HTML, keyboard support, visible focus, clear labels, sufficient contrast, and understandable errors.
- Plan for **internationalization** by externalizing text and formatting dates, amounts, and other values by locale.
- Treat UI security as part of UX: use safe output rendering, avoid exposing sensitive internal errors, confirm destructive actions, and never rely on the client UI as the only authorization control.

**Next topic: 2.12 UML and modeling** — use-case, class, sequence, state, and activity diagrams.

---

# 2.12 UML and Modeling

**UML** means **Unified Modeling Language**. It is a set of diagram types used to explain how a system works.

Diagrams are useful when they make a design easier to understand than code or paragraphs alone.

They should answer a real question:

- Who uses this system?
- What can they do?
- What objects exist?
- What happens during a request?
- Which states are valid?
- What are the steps in a workflow?

Do not create diagrams only because UML exists. Outdated or overly detailed diagrams create confusion.

---

## Problem: Requirements and Behavior Are Hard to Understand

Without models, teams often rely on scattered requirements, meetings, and code.

```text
Product owner explains a feature
        |
        v
Developer interprets it
        |
        v
Developer writes code
        |
        v
Different interpretation found during testing
```

Common problems:

- Stakeholders and developers use different language.
- Important edge cases are missed.
- A workflow’s order is unclear.
- Invalid state transitions are not discovered until production.
- New team members struggle to understand the system.

---

# Solution 1: Use-Case Diagrams

A **use-case diagram** shows:

- **Actors**: people or external systems.
- **Use cases**: goals those actors achieve through the system.

It answers:

> Who uses the system, and what do they need to do?

## Example: online store

```text
+--------------------------------------------------+
| Online Store                                     |
|                                                  |
| Customer                                         |
|   ├── Browse products                            |
|   ├── Place order                                |
|   ├── View own orders                            |
|   └── Cancel eligible order                      |
|                                                  |
| Support agent                                    |
|   └── View customer orders                       |
|                                                  |
| Payment provider                                 |
|   └── Process payment                            |
+--------------------------------------------------+
```

A more traditional UML-style view:

```text
Customer ------------> (Browse products)
Customer ------------> (Place order)
Customer ------------> (View own orders)
Customer ------------> (Cancel eligible order)

Support agent -------> (View customer orders)

(Place order) -------> Payment provider
```

## What use-case diagrams do not show

They do not explain:

- Database tables.
- API calls.
- Internal class structure.
- Exact screen design.
- The detailed order of technical steps.

### Pros

- Easy for technical and non-technical people to read.
- Clarifies system scope.
- Reveals missing user roles and goals.
- Useful early in planning.

### Cons

- Can become too vague.
- Does not explain detailed behavior.
- Large systems can produce unreadable diagrams.

### Problem left behind

Knowing that a customer can “place an order” does not explain the internal data model.

This leads to class diagrams.

---

# Solution 2: Class Diagrams

A **class diagram** shows important objects, their data, and their relationships.

It answers:

> What concepts exist, and how are they connected?

## Example: order domain

```text
+--------------------+
| Customer           |
|--------------------|
| id                 |
| email              |
+--------------------+
          |
          | places
          | 1..*
          v
+--------------------+
| Order              |
|--------------------|
| id                 |
| status             |
| customerId         |
|--------------------|
| pay()              |
| cancel()           |
| markShipped()      |
+--------------------+
          |
          | contains
          | 1..*
          v
+--------------------+        +--------------------+
| OrderItem          | *..1   | Product            |
|--------------------|------->|--------------------|
| productId          |        | id                 |
| quantity           |        | name               |
| unitPriceCents     |        | currentPriceCents  |
+--------------------+        +--------------------+
```

## Relationship notation

| Notation | Meaning |
|---|---|
| `1` | Exactly one |
| `0..1` | Zero or one |
| `*` | Many |
| `1..*` | One or more |

For example:

```text
One customer can have many orders:

Customer 1 -------- * Order
```

## Important modeling rule

Do not turn every TypeScript class, database table, utility, or framework object into a diagram.

Focus on meaningful business concepts and relationships:

```text
Good:
Order, Payment, Product, InventoryReservation

Usually unnecessary:
DateFormatter, HttpClient, StringUtils
```

### Pros

- Clarifies important domain concepts.
- Reveals missing relationships and ownership.
- Helps identify inconsistent names.
- Useful for domain-driven design and data design.

### Cons

- Can become inaccurate when code changes.
- Does not show the order in which requests happen.
- A class diagram may encourage an overly object-focused model for simple data.

### Problem left behind

A class diagram shows what objects exist, but not how they collaborate during a specific action.

This leads to sequence diagrams.

---

# Solution 3: Sequence Diagrams

A **sequence diagram** shows how participants communicate over time.

It answers:

> What happens, in what order, when a user performs an action?

## Example: placing an order

```text
Customer      Web App       Orders API      Payment API      Database
   |              |              |               |               |
   | Checkout     |              |               |               |
   |------------->|              |               |               |
   |              | Create order |               |               |
   |              |------------->|               |               |
   |              |              | Authorize     |               |
   |              |              | payment       |               |
   |              |              |-------------->|               |
   |              |              |<--------------|               |
   |              |              | Save order    |               |
   |              |              |------------------------------>|
   |              |              |<------------------------------|
   |              |<-------------|               |               |
   |<-------------| Confirmation |               |               |
```

## Include failure paths

A useful sequence diagram includes important failure cases.

```text
Orders API -> Payment API: Capture payment
Payment API -> Orders API: Payment declined

Orders API:
  - does not mark order as paid
  - returns a safe, understandable error
  - allows retry only with idempotency protection
```

```text
Customer      Orders API       Payment API
   |               |                |
   | Place order   |                |
   |-------------->|                |
   |               | Capture        |
   |               |--------------->|
   |               |<---------------|
   |               | Declined       |
   |<--------------|                |
   | Payment could not be completed |
```

## Security boundaries in sequence diagrams

Show important checks:

```text
Client
  |
  v
API
  |
  +--> authenticate token
  +--> authorize requested resource/action
  +--> validate input
  +--> call dependency over TLS
```

This helps identify missing security controls before implementation.

### Pros

- Makes request flow clear.
- Identifies dependency calls and failure points.
- Useful for API integration and distributed systems.
- Helps review authentication, authorization, retries, and timeouts.

### Cons

- Can become wide and hard to read.
- Describes one scenario, not all system behavior.
- Must be updated when workflow changes.

### Problem left behind

A sequence diagram shows interaction order, but it may not clearly express the allowed lifecycle of one business object.

This leads to state diagrams.

---

# Solution 4: State Diagrams

A **state diagram** shows the valid states of an object and the transitions between them.

It answers:

> What states can this object be in, and which changes are allowed?

## Example: order lifecycle

```text
                 payment succeeds
Pending --------------------------> Paid
   |                                  |
   | customer cancels                 | shipment created
   v                                  v
Cancelled                         Shipped
```

Invalid transitions are intentionally absent:

```text
Cancelled -> Paid     invalid
Shipped -> Pending    invalid
Pending -> Shipped    invalid
```

## Why state diagrams matter

Without explicit states, systems often use a text field:

```text
status = "something"
```

Then any code may set any value:

```text
status = "paid"
status = "shipped"
status = "cancelled"
```

This can allow impossible business behavior.

A state model defines legal transitions:

```text
Pending
  ├─ pay()    -> Paid
  └─ cancel() -> Cancelled

Paid
  └─ ship()   -> Shipped
```

### Pros

- Makes lifecycle rules clear.
- Prevents invalid transitions.
- Useful for orders, payments, tickets, subscriptions, and approvals.
- Supports focused tests.

### Cons

- Not needed for objects with no meaningful lifecycle.
- Complex workflows can have many states.
- State names must match real business language.

### Problem left behind

A state diagram describes object lifecycle, but not the full decision process or parallel work in a business workflow.

This leads to activity diagrams.

---

# Solution 5: Activity Diagrams

An **activity diagram** shows a workflow, including decisions, parallel work, and alternate paths.

It answers:

> What steps happen in this process, including decisions and failure paths?

## Example: checkout process

```text
Start
  |
  v
Validate cart
  |
  v
Is inventory available?
  |
  +--> No --> Show unavailable items --> End
  |
 Yes
  |
  v
Authorize payment
  |
  +--> Declined --> Show payment error --> End
  |
 Approved
  |
  v
Create order
  |
  +----------------------------+
  |                            |
  v                            v
Send confirmation          Update analytics
  |                            |
  +-------------+--------------+
                |
                v
               End
```

The two final tasks can happen independently:

```text
Create order
   |
   +--> Send confirmation
   |
   +--> Update analytics
```

## Use activity diagrams for

- Checkout flows.
- Account registration.
- Approval workflows.
- File-upload processing.
- Password-reset flows.
- Support-ticket triage.
- Deployment processes.

### Pros

- Easy to understand as a workflow.
- Shows decision points clearly.
- Can show parallel work.
- Helps find missing error and retry paths.

### Cons

- Can overlap with flowcharts and sequence diagrams.
- Large workflows become difficult to read.
- Does not show detailed data structure or implementation boundaries.

---

# When to Choose Which Diagram

| Question | Diagram |
|---|---|
| Who uses the system and what goals do they have? | **Use-case diagram** |
| What are the important domain objects and relationships? | **Class diagram** |
| What happens between components during one scenario? | **Sequence diagram** |
| Which lifecycle transitions are valid? | **State diagram** |
| What steps, decisions, and parallel actions form a process? | **Activity diagram** |

---

# Simple Modeling Flow

Use diagrams in this order when designing a significant feature:

```text
1. Who needs the feature?
       |
       v
   Use-case diagram
       |
       v
2. What concepts and data are involved?
       |
       v
   Class diagram
       |
       v
3. What happens during the important request?
       |
       v
   Sequence diagram
       |
       v
4. Does an object have strict lifecycle rules?
       |
       v
   State diagram
       |
       v
5. Does the business process have decisions or parallel steps?
       |
       v
   Activity diagram
```

You do not need every diagram for every feature.

For example:

```text
Simple profile update:
- Usually no UML diagram needed.

Payment workflow:
- Sequence diagram + state diagram are useful.

New marketplace application:
- Use-case + class + activity diagrams may be useful.
```

---

# Modeling Best Practices

## Keep diagrams focused

Bad:

```text
One diagram containing:
- every user
- every database table
- every API endpoint
- every class
- every cloud resource
```

Better:

```text
One diagram answers one question.
```

## Use business language

Prefer:

```text
OrderPaid
ReserveInventory
PaymentCaptured
```

Avoid vague labels:

```text
processData
updateItem
handleThing
```

## Show security boundaries where relevant

For sensitive workflows, indicate:

```text
Browser
   |
   | HTTPS
   v
API
   |
   | authenticated and authorized request
   v
Database
```

Also identify:

- External services.
- Trust boundaries.
- Sensitive data stores.
- Admin-only actions.
- Asynchronous queues and event topics.

## Include failure states

Do not model only success.

```text
Payment request
   |
   +--> approved
   +--> declined
   +--> timed out
   +--> unknown outcome requiring reconciliation
```

This is especially important for payments, authentication, authorization, data migrations, and distributed workflows.

## Keep diagrams near the code

Store important diagrams as text-based formats where possible, such as Mermaid or PlantUML, so they can be reviewed with code changes.

```text
docs/
  ├─ architecture/
  ├─ adr/
  └─ diagrams/
```

Review diagrams when the design changes. An outdated diagram is less useful than no diagram.

---

# Key Takeaways

- UML diagrams are communication tools, not documentation for its own sake.
- Use **use-case diagrams** for users and goals.
- Use **class diagrams** for domain concepts and relationships.
- Use **sequence diagrams** for interactions over time.
- Use **state diagrams** for valid lifecycle transitions.
- Use **activity diagrams** for workflows, decisions, and parallel work.
- Keep every diagram focused on one question.
- Include trust boundaries, authorization checks, and failure paths for security-sensitive designs.
- Update or remove diagrams when the design changes.

**Next topic: 2.13 Mocking (design level)** — contract-first API mocks, mock servers, and service virtualization.

---

# 2.13 Mocking at Design Level

Design-level mocking means creating a **simulated API or service** before the real service is ready.

It helps front-end, mobile, partner, and integration teams work in parallel.

```text
Frontend
   |
   v
Mock API
   |
   v
Real API later
```

This is different from unit-test mocks.

```text
Unit-test mock:
A small fake object used inside automated code tests.

Design-level mock:
A running simulated API that clients can call over HTTP.
```

---

## Problem: Teams Cannot Work in Parallel

Suppose a web team needs an Orders API, but the backend is not finished.

```text
Frontend team waits
       |
       v
Backend team builds API
       |
       v
Frontend starts integration
       |
       v
Problems found late
```

This creates delays:

- The UI cannot be built against realistic data.
- API misunderstandings appear late.
- Error states are not designed.
- Mobile and partner teams cannot start.
- Backend changes may unexpectedly break clients.
- Demo environments depend on unfinished systems.

---

# Solution 1: Informal Example Responses

A team may begin by sharing example JSON in chat, documentation, or a ticket.

```text
GET /orders/123

{
  "id": "123",
  "status": "shipped",
  "totalCents": 10500
}
```

### Pros

- Very fast to create.
- Useful for an early conversation.
- Helps teams agree on names and basic data shape.

### Cons

- Not executable.
- Often becomes outdated.
- Does not validate requests.
- Usually omits error cases, authentication, pagination, and edge cases.
- Clients can make assumptions that the real API does not support.

### Problem left behind

Example JSON provides an idea of the response, but it is not a reliable shared contract.

This leads to contract-first API design.

---

# Solution 2: Contract-First API Design

**Contract-first design** means defining the API contract before implementing the real service.

For HTTP APIs, the contract is commonly written using **OpenAPI**.

```text
API contract
     |
     +--> Documentation
     +--> Mock server
     +--> Client generation
     +--> Request validation
     +--> Contract tests
     +--> Real API implementation
```

The contract defines:

- Routes and HTTP methods.
- Request body structure.
- Response body structure.
- Status codes.
- Authentication requirements.
- Validation rules.
- Error format.
- Pagination behavior.
- Example responses.

## Example contract idea

```text
GET /v1/orders/{orderId}

Success:
200 OK
{
  "id": "8be7...",
  "status": "shipped",
  "totalCents": 10500
}

Not found or unavailable:
404 Not Found
{
  "code": "ORDER_NOT_FOUND",
  "message": "Order not found."
}
```

## Why define errors early?

The happy path is not enough.

A client needs to know what to do when:

```text
Request order
   |
   +--> 200: show order
   +--> 401: ask user to sign in
   +--> 403: show access-denied state
   +--> 404: show unavailable order state
   +--> 429: wait and retry later
   +--> 500: show safe retry guidance
```

### Pros

- Creates one shared API definition.
- Lets teams review integration before implementation.
- Enables mock servers and generated clients.
- Reduces late integration surprises.
- Makes breaking changes visible.
- Supports automated validation in CI.

### Cons

- The contract can become stale if not checked automatically.
- Writing a complete contract takes time.
- A valid schema does not prove business rules or authorization are correct.

### Security requirements in the contract

Document security behavior explicitly:

| Concern | Contract requirement |
|---|---|
| Authentication | Required scheme, such as OAuth 2.0 access token |
| Authorization | Required scope or permission per operation |
| Input validation | Length, format, range, and required fields |
| Errors | Safe error messages without stack traces or internal details |
| Rate limits | Expected `429` behavior and retry guidance |
| Sensitive fields | Fields never returned to clients |
| Transport | HTTPS only |

Never include real credentials, production access tokens, or real personal data in API examples.

### Problem left behind

A contract describes an API, but clients still need something they can call while the real API is unavailable.

This leads to a mock server.

---

# Solution 3: Mock Servers

A **mock server** is a running HTTP service that behaves like the planned API.

```text
Web application
      |
      | HTTPS / HTTP
      v
+-------------------+
| Mock Orders API   |
+-------------------+
      |
      +--> returns example success response
      +--> returns validation error
      +--> returns not-found response
      +--> simulates delay where useful
```

A mock server may generate responses directly from an OpenAPI contract.

## Example development flow

```text
1. Team agrees on OpenAPI contract.
         |
         v
2. Mock server serves the contract.
         |
         v
3. Frontend integrates with mock server.
         |
         v
4. Backend implements real API.
         |
         v
5. Contract tests verify real API matches contract.
         |
         v
6. Frontend changes API URL to real environment.
```

## Useful mock scenarios

Do not mock only successful responses.

```text
Orders API mock
   |
   +--> Order exists
   +--> Order does not exist
   +--> User has no access
   +--> Request is invalid
   +--> API is rate-limited
   +--> Temporary server failure
   +--> Empty order list
   +--> Paginated order list
```

This helps UI teams build:

- Loading states.
- Empty states.
- Error messages.
- Retry actions.
- Permission-denied screens.
- Pagination controls.

### Pros

- Enables parallel frontend and backend work.
- Makes integration behavior tangible.
- Helps demos and usability testing.
- Supports realistic error-state design.
- Reduces dependency on unstable development environments.

### Cons

- A mock server can drift from the real API.
- Static responses may not reflect real business behavior.
- Mock success can hide production integration failures.
- It must not be treated as security testing.

### Security warning

A mock server should not bypass security thinking.

It should simulate expected security behavior:

```text
No token / invalid token -> 401
Valid token without permission -> 403
Request for another tenant's order -> 404 or 403, based on policy
Too many requests -> 429
```

But never expose a mock server publicly with production-like data, weak default credentials, or unrestricted administrative endpoints.

### Problem left behind

A mock server usually imitates one API. Some systems depend on many unavailable, costly, unstable, or third-party services.

This leads to service virtualization.

---

# Solution 4: Service Virtualization

**Service virtualization** simulates a dependency with more realistic behavior than a simple mock server.

```text
Application under test
        |
        v
+---------------------------+
| Virtual payment service   |
|                           |
| - payment approved        |
| - payment declined        |
| - timeout                 |
| - duplicate response      |
| - delayed callback        |
| - malformed response      |
+---------------------------+
```

It is useful when the real dependency is:

- Expensive to use.
- Rate-limited.
- Unavailable in development.
- Difficult to trigger edge cases in.
- Slow or unreliable.
- Controlled by another company.
- Unsafe to call with test data.

## Example: payment provider

A simple mock may always return:

```text
Payment approved
```

A virtualized payment provider can simulate meaningful conditions:

```text
Payment request
   |
   +--> approved
   +--> declined
   +--> provider timeout
   +--> duplicate webhook delivery
   +--> delayed payment confirmation
   +--> unknown result requiring reconciliation
```

### Pros

- Supports testing difficult and rare conditions.
- Reduces reliance on external systems.
- Makes integration tests more repeatable.
- Helps test resilience: timeouts, retries, duplicate events, and failures.
- Can simulate complex multi-step protocols.

### Cons

- More expensive and complex than a simple mock server.
- The virtual behavior must be maintained.
- It can still differ from the real provider.
- Does not replace limited testing against a real sandbox or staging environment.

### Problem left behind

Mocks and virtual services are only useful if they remain aligned with the contract and real behavior.

This leads to contract testing and validation.

---

# Solution 5: Contract Testing

**Contract testing** verifies that an API provider and its consumers agree on the same contract.

```text
Consumer expectation
       |
       v
Contract
       |
       v
Provider verification
```

## Provider contract test

The real API is tested against the OpenAPI contract.

```text
OpenAPI says:
GET /orders/{id} returns `status` and `totalCents`

Real API test:
- validates response fields
- validates status codes
- validates error format
```

## Consumer contract test

The client is tested against expected API behavior.

```text
Web application expects:
- `status` is one of known values
- `totalCents` is an integer
- missing order returns 404
```

## Why this matters

Without validation:

```text
Mock API returns:
{ "totalCents": 10500 }

Real API changes:
{ "total": "105.00" }

Frontend fails after deployment.
```

With contract testing:

```text
Real API change
      |
      v
Contract test fails in CI
      |
      v
Team fixes, versions, or coordinates the change before release
```

### Pros

- Detects breaking changes early.
- Keeps mocks and real services aligned.
- Protects independently deployed teams.
- Supports safer API evolution.
- Reduces manual integration testing effort.

### Cons

- Requires CI setup and contract ownership.
- Tests need representative cases.
- Passing a contract test does not guarantee performance, security, or business correctness.

---

# One TypeScript Example: Contract-Based Mock Handler

This simple mock handler returns safe, predictable order responses for success, not-found, and unauthorized cases.

```typescript name=src/mocks/orders-api.ts
export type MockRequest = Readonly<{
  headers: Readonly<Record<string, string | undefined>>;
  params: Readonly<{ orderId: string }>;
}>;

export type MockResponse = Readonly<{
  status: number;
  body: Readonly<Record<string, unknown>>;
}>;

const mockOrders = new Map([
  [
    "11111111-1111-4111-8111-111111111111",
    {
      id: "11111111-1111-4111-8111-111111111111",
      tenantId: "demo-tenant",
      customerId: "demo-customer",
      status: "shipped",
      totalCents: 10500,
    },
  ],
]);

export function getOrderMock(request: MockRequest): MockResponse {
  const accessToken = request.headers.authorization;

  // Simulate the real API's authentication boundary.
  if (accessToken !== "Bearer demo-access-token") {
    return {
      status: 401,
      body: {
        code: "UNAUTHENTICATED",
        message: "Authentication is required.",
      },
    };
  }

  const order = mockOrders.get(request.params.orderId);

  // Do not reveal whether an inaccessible order exists.
  if (order === undefined || order.tenantId !== "demo-tenant") {
    return {
      status: 404,
      body: {
        code: "ORDER_NOT_FOUND",
        message: "Order not found.",
      },
    };
  }

  return {
    status: 200,
    body: {
      id: order.id,
      status: order.status,
      totalCents: order.totalCents,
    },
  };
}
```

## What this mock demonstrates

```text
Client request
   |
   +--> no valid token -> 401
   |
   +--> unknown/inaccessible order -> 404
   |
   +--> valid request -> safe order response
```

It intentionally:

- Does not return internal tenant or customer identifiers.
- Simulates authentication behavior.
- Uses a generic `404` response for unavailable records.
- Returns a stable response shape for client development.

In a production-quality mock server, use an OpenAPI document as the source of truth and include tests that validate its response payloads against that schema.

---

# When to Choose Which

| Need | Choose |
|---|---|
| Quickly discuss possible response data | Informal example JSON |
| Define and review an API before implementation | Contract-first design with **OpenAPI** |
| Let frontend or mobile teams develop in parallel | **Mock server** |
| Simulate an unavailable or complex external dependency | **Service virtualization** |
| Ensure real API behavior matches agreed contract | **Provider contract testing** |
| Ensure client expectations remain valid | **Consumer contract testing** |

---

# Practical Workflow

```text
1. Define user and integration requirements.
          |
          v
2. Write the API contract.
          |
          v
3. Review paths, schemas, errors, pagination, and security behavior.
          |
          v
4. Generate or implement a mock server.
          |
          v
5. Build client integration against the mock.
          |
          v
6. Implement the real API.
          |
          v
7. Run contract tests in CI.
          |
          v
8. Test critical workflows against a real sandbox or staging environment.
```

---

# Key Takeaways

- Design-level mocking lets teams work before real services are ready.
- Start with a clear **contract**, ideally OpenAPI for HTTP APIs.
- Use a **mock server** for realistic client integration and UI development.
- Include success, validation, authentication, authorization, empty, failure, and rate-limit scenarios.
- Use **service virtualization** for complex, costly, unstable, or unavailable external dependencies.
- Use **contract testing** to keep mocks, clients, and real services aligned.
- Mocks are not production proof: validate critical integrations against real sandbox or staging systems.
- Treat mock infrastructure securely: use synthetic data, do not publish mock admin controls, never include real secrets, and model authorization behavior rather than bypassing it.

**Next topic: 2.14 Infrastructure design** — cloud, containers, Kubernetes, infrastructure as code, networking, and environments.

---

# 2.14 Infrastructure Design

**Infrastructure design** is how an application runs outside its source code.

It includes:

- Cloud services or servers
- Containers
- Networking
- Databases and storage
- Environments
- Deployment pipelines
- Monitoring
- Access control
- Backup and recovery

A good infrastructure design makes software secure, repeatable, observable, and reliable.

---

## Problem: Manual, One-Server Deployment

A small application may begin like this:

```text
Developer laptop
      |
      | manually copies files
      v
One production server
      |
      +--> API
      +--> database
      +--> uploaded files
```

This works briefly, but creates risks:

- Deployments differ between developers and production.
- One server failure causes downtime.
- Configuration is changed manually and not documented.
- Secrets may be copied into files or chat messages.
- It is hard to recreate the system after failure.
- Testing may accidentally affect production.
- Scaling requires manual emergency changes.

---

# Solution 1: Use Separate Environments

An **environment** is an isolated setup for a stage of delivery.

A common structure is:

```text
Developer machine
      |
      v
Development
      |
      v
Test / Integration
      |
      v
Staging
      |
      v
Production
```

## Typical purpose

| Environment | Purpose |
|---|---|
| Local development | Fast developer feedback |
| Development | Shared early integration |
| Test | Automated integration and end-to-end testing |
| Staging | Production-like final validation |
| Production | Real users and real data |

## Why environments matter

```text
New feature
   |
   v
Local tests
   |
   v
Test environment
   |
   v
Staging validation
   |
   v
Production deployment
```

This reduces the chance of discovering basic configuration or integration errors after release.

## Environment rules

- Production must use separate credentials, databases, storage, and secrets.
- Never copy production data into lower environments without strict approval, minimization, and anonymization.
- Restrict production access to only people and workloads that need it.
- Keep environment differences small and documented.
- Use production-like configuration in staging where possible.

### Pros

- Reduces production risk.
- Supports repeatable testing.
- Separates real customer data from test data.
- Helps debug changes before release.

### Cons

- More environments cost time and money.
- Environments can drift if configured manually.
- Staging may not perfectly reproduce production traffic or data scale.

### Problem left behind

Separate environments help, but manually configuring each one creates drift and mistakes.

This leads to infrastructure as code.

---

# Solution 2: Infrastructure as Code (IaC)

**Infrastructure as Code** means defining infrastructure in version-controlled files instead of manual console changes.

```text
Infrastructure definition
       |
       v
Review and approve change
       |
       v
Automated deployment
       |
       v
Cloud resources created consistently
```

IaC can define:

- Networks
- Databases
- Storage
- Container services
- DNS records
- Access policies
- Monitoring alerts
- Queues
- Secret references

## Example concept

```text
Repository
  |
  +--> application code
  |
  +--> infrastructure/
        |
        +--> network definition
        +--> database definition
        +--> service definition
        +--> monitoring definition
```

Common IaC tools include Terraform, Pulumi, AWS CloudFormation, Azure Bicep, and platform-specific tools.

## Benefits of version control

```text
Infrastructure change
      |
      v
Pull request
      |
      +--> review
      +--> automated validation
      +--> approval
      +--> deployment
```

This provides:

- Change history.
- Reviewable access-policy changes.
- Reproducible environments.
- Safer disaster recovery.
- Easier auditing.

### Pros

- Reduces manual configuration drift.
- Makes infrastructure reproducible.
- Supports peer review and automated validation.
- Enables consistent environment creation.
- Helps recover from infrastructure failure.

### Cons

- Requires learning and maintaining IaC tooling.
- A bad IaC change can affect many resources quickly.
- State management and permissions need careful design.

## Security rules

- Use least-privilege deployment identities.
- Separate read-only planning permissions from apply/deployment permissions where possible.
- Require review for network and identity-policy changes.
- Store IaC state securely because it may contain sensitive metadata.
- Do not hardcode credentials in IaC files.
- Scan IaC for insecure settings, such as public storage or overly broad network access.

### Problem left behind

IaC can create infrastructure consistently, but applications still need a portable and predictable way to run.

This leads to containers.

---

# Solution 3: Containers

A **container** packages an application with its runtime and dependencies.

```text
Application source code
        |
        v
Container image
        |
        v
Runs consistently in:
- local development
- test
- staging
- production
```

```text
+------------------------------------+
| Container                          |
|                                    |
| TypeScript application             |
| Node.js runtime                    |
| Production dependencies            |
+------------------------------------+
```

Containers commonly use Docker-compatible images.

## Why containers help

Without containers:

```text
"It works on my machine."
```

With containers:

```text
"Run the same built image in every environment."
```

## Important container practices

### Build immutable images

An image should be created once and promoted through environments.

```text
Build image
   |
   v
Test image
   |
   v
Deploy same image to staging
   |
   v
Deploy same image to production
```

Do not rebuild “the same version” differently in production.

### Run as a non-root user

```text
Unsafe:
Container process runs as root

Safer:
Container process runs as dedicated non-root application user
```

### Keep images small

Use only required runtime files and dependencies.

Benefits:

- Smaller attack surface.
- Faster build and deployment.
- Fewer vulnerable packages.
- Lower storage and transfer cost.

### Do not put secrets in images

Unsafe:

```text
Container image
  └── .env file with production password
```

A container image may be copied into registries, developer systems, backups, and CI caches.

Use runtime secret injection from a managed secret store instead.

### Pros

- Consistent runtime across environments.
- Easier deployment and scaling.
- Isolates application dependencies.
- Supports immutable release artifacts.

### Cons

- Adds image build, registry, and vulnerability-scanning work.
- Containers do not automatically provide security.
- Stateful workloads need special handling.
- Container orchestration may be unnecessary for small systems.

### Problem left behind

Containers make one application instance portable. Running many containers reliably, scaling them, networking them, and recovering them requires an orchestration platform.

This leads to Kubernetes or managed container platforms.

---

# Solution 4: Container Orchestration

**Container orchestration** manages containers across servers or cloud capacity.

```text
Users
  |
  v
Load Balancer
  |
  +--> Container instance 1
  +--> Container instance 2
  +--> Container instance 3
```

Common options:

| Option | Best for |
|---|---|
| Managed app/container platform | Most teams wanting low operational effort |
| Kubernetes | Teams with complex orchestration needs and operational expertise |
| Serverless containers | Variable workloads and simple HTTP/event services |
| Virtual machines | Legacy software or workloads needing OS-level control |

## Kubernetes, simply explained

Kubernetes is a platform for running and managing containerized workloads.

```text
Kubernetes cluster
   |
   +--> Deployment
   |      |
   |      +--> Pod 1 -> application container
   |      +--> Pod 2 -> application container
   |
   +--> Service -> stable internal network address
   |
   +--> Ingress -> external HTTP entry point
```

### Main concepts

| Kubernetes concept | Simple meaning |
|---|---|
| Cluster | Group of machines managed together |
| Node | One machine in the cluster |
| Pod | Smallest runnable unit, usually one application container |
| Deployment | Keeps the desired number of Pods running |
| Service | Stable internal address for Pods |
| Ingress / Gateway | Controlled HTTP entry point |
| Namespace | Logical isolation boundary |
| ConfigMap | Non-sensitive configuration |
| Secret | Sensitive configuration reference; preferably integrated with an external secret manager |

## When Kubernetes is useful

Choose Kubernetes when you have real needs such as:

- Multiple services with shared platform requirements.
- Autoscaling and self-healing workloads.
- Advanced traffic routing.
- Multi-team platform standards.
- Portable deployment across supported environments.
- Strong internal networking and policy needs.

## When it is excessive

For one small API, Kubernetes can add unnecessary complexity:

```text
Simple application
   |
   +--> managed container platform
```

is often easier than:

```text
Simple application
   |
   +--> Kubernetes cluster
        |
        +--> cluster upgrades
        +--> networking policies
        +--> ingress configuration
        +--> resource quotas
        +--> monitoring stack
        +--> workload security
```

### Pros

- Supports scaling and self-healing.
- Enables rolling deployments.
- Provides service discovery.
- Can standardize operations across many services.
- Supports resource quotas and network policies.

### Cons

- Significant operational complexity.
- Requires monitoring, upgrades, access control, and policy management.
- Misconfiguration can expose services or consume excessive cost.
- Does not replace secure application design.

### Problem left behind

Orchestrated workloads need carefully designed network boundaries. A service must not automatically reach every other service or database.

This leads to infrastructure networking design.

---

# Solution 5: Network Design and Segmentation

Network design controls how users, services, databases, and external systems communicate.

A secure default is **deny by default**.

```text
Internet
   |
   v
+-----------------------+
| Public entry point    |
| Load balancer / API   |
+-----------------------+
   |
   v
+-----------------------+
| Private application   |
| network               |
+-----------------------+
   |
   v
+-----------------------+
| Private data network  |
| database / cache      |
+-----------------------+
```

## Common network zones

```text
Internet
   |
   v
Public zone
   |
   +--> CDN
   +--> Load balancer
   +--> API gateway
   |
   v
Private application zone
   |
   +--> APIs
   +--> workers
   |
   v
Private data zone
   |
   +--> databases
   +--> caches
   +--> internal queues
```

Databases should usually not be publicly reachable.

## Traffic rules

Example least-privilege rules:

```text
Internet
  -> may call public HTTPS endpoint only

API
  -> may call Orders database on database port only
  -> may call payment provider over HTTPS only

Notification worker
  -> may read notification queue
  -> may call email provider over HTTPS
  -> may not access payment database
```

## Outbound traffic

Do not assume outbound traffic is harmless.

An application compromised through a vulnerability may attempt to send data to an attacker-controlled destination.

For sensitive workloads, consider:

- Allow-listing required external hosts.
- Restricting outbound ports.
- Using controlled egress gateways.
- Monitoring unexpected outbound traffic.
- Validating external URLs before making requests to prevent SSRF.

### Pros

- Limits lateral movement after compromise.
- Reduces accidental exposure.
- Separates public services from sensitive data.
- Supports zero-trust architecture.

### Cons

- Requires planning and operational maintenance.
- Overly restrictive rules can break legitimate integrations.
- Debugging connectivity issues can take time.

### Problem left behind

Infrastructure can run securely, but configuration and code still must be deployed safely and repeatedly.

This leads to CI/CD.

---

# Solution 6: CI/CD Pipelines

**Continuous Integration (CI)** automatically builds and tests changes.

**Continuous Delivery/Deployment (CD)** prepares or deploys validated changes.

```text
Code change
   |
   v
Pull request
   |
   +--> lint
   +--> unit tests
   +--> security scans
   +--> build container image
   +--> integration tests
   |
   v
Approved merge
   |
   +--> deploy to staging
   +--> validate
   +--> deploy to production
```

## Recommended pipeline checks

| Stage | Example checks |
|---|---|
| Source validation | Formatting, linting, type checking |
| Tests | Unit, integration, contract, end-to-end tests |
| Dependency security | Vulnerability and license scanning |
| Secret scanning | Prevent credentials from entering source control |
| Container scanning | Detect vulnerable packages in images |
| IaC scanning | Detect public storage, open ports, broad access policies |
| Build | Create immutable artifact/image |
| Deployment | Apply reviewed change |
| Post-deploy | Health checks, smoke tests, monitoring verification |

## Deployment strategies

### Rolling deployment

Replace instances gradually.

```text
Old version: 3 instances
   |
   v
Replace one at a time
   |
   v
New version: 3 instances
```

### Blue-green deployment

Maintain two environments.

```text
Blue: current production
Green: new version
       |
       v
Switch traffic after validation
```

### Canary deployment

Send a small percentage of traffic to the new version first.

```text
New version: 5% traffic
       |
       v
Monitor errors and latency
       |
       +--> healthy -> increase traffic
       +--> unhealthy -> roll back
```

### Pros

- Reduces manual deployment errors.
- Creates repeatable releases.
- Finds issues before users do.
- Supports rollback or controlled forward fixes.
- Improves auditability.

### Cons

- Requires setup and maintenance.
- Automated deployment can spread a defect quickly without safeguards.
- Database changes need special migration planning.

## Security rules for CI/CD

- Use short-lived workload credentials, not long-lived personal tokens.
- Grant pipeline jobs only the permissions they need.
- Protect production deployment environments with approvals where appropriate.
- Pin and verify third-party actions or build dependencies.
- Restrict who can change pipeline configuration.
- Keep secrets masked and avoid printing environment variables.
- Generate and retain software build provenance where supported.
- Scan dependencies, containers, and IaC before deployment.

### Problem left behind

Deployment is not the end. Systems must be monitored, backed up, and recoverable.

This leads to operational design.

---

# Solution 7: Monitoring, Backups, and Disaster Recovery

A production system needs a plan for both small incidents and serious failures.

```text
Running system
   |
   +--> monitoring detects problem
   |
   +--> alert reaches responsible team
   |
   +--> incident response
   |
   +--> recovery
   |
   +--> follow-up improvement
```

## Monitoring

Monitor:

```text
Application:
- request rate
- error rate
- p95/p99 latency
- authentication failures
- authorization-denied events
- dependency timeout rate

Infrastructure:
- CPU and memory
- disk space
- database connections
- queue depth
- container restarts
- network errors

Business:
- order completion rate
- payment failure rate
- failed background jobs
```

## Backups

Backups should be:

- Automatic.
- Encrypted.
- Access-controlled.
- Retained according to business and legal requirements.
- Tested through restoration exercises.

A backup that has never been restored is not proven useful.

```text
Database backup
      |
      v
Regular restore test
      |
      v
Verify data integrity and recovery time
```

## Recovery objectives

| Term | Meaning |
|---|---|
| RPO — Recovery Point Objective | Maximum acceptable data loss period |
| RTO — Recovery Time Objective | Maximum acceptable recovery time |

Example:

```text
RPO: 15 minutes
RTO: 2 hours
```

This means the business accepts losing up to 15 minutes of data and expects service recovery within two hours.

### Pros

- Reduces outage impact.
- Makes responsibilities clear.
- Protects customer and business data.
- Builds confidence in recovery capability.

### Cons

- Backups, replicas, and drills cost time and money.
- Recovery plans can become outdated.
- High availability is not a replacement for backups.

---

# One TypeScript Example: Health Check Endpoint

A health endpoint helps an orchestrator or load balancer determine whether an API instance can receive traffic.

```typescript name=src/platform/health/health-handler.ts
export type HealthStatus = Readonly<{
  status: "ok" | "degraded";
  checks: Readonly<{
    database: "ok" | "failed";
  }>;
}>;

export interface DatabaseHealthCheck {
  ping(signal: AbortSignal): Promise<void>;
}

export async function getHealthStatus(
  database: DatabaseHealthCheck,
): Promise<Readonly<{ statusCode: 200 | 503; body: HealthStatus }>> {
  const timeout = AbortSignal.timeout(1_000);

  try {
    await database.ping(timeout);

    return {
      statusCode: 200,
      body: {
        status: "ok",
        checks: {
          database: "ok",
        },
      },
    };
  } catch {
    // Do not expose connection strings, stack traces, or infrastructure details.
    return {
      statusCode: 503,
      body: {
        status: "degraded",
        checks: {
          database: "failed",
        },
      },
    };
  }
}
```

## What this supports

```text
Load balancer / orchestrator
        |
        v
GET /health
        |
        +--> 200 -> instance can receive traffic
        |
        +--> 503 -> remove instance from traffic and investigate
```

Security and operational notes:

- Keep health responses minimal; do not expose database hostnames, versions, credentials, or stack traces.
- Do not make unauthenticated health endpoints reveal sensitive internal topology.
- Use separate readiness and liveness checks in platforms that support them:
  - **Liveness:** should the process be restarted?
  - **Readiness:** should this instance receive traffic?
- Keep health checks fast and use strict timeouts.
- Avoid expensive checks that could overload dependencies when many instances probe simultaneously.

---

# When to Choose Which

| Need | Choose |
|---|---|
| Separate development, testing, and real customer data | **Multiple environments** |
| Reproducible cloud resources and reviewed changes | **Infrastructure as Code** |
| Consistent application runtime across environments | **Containers** |
| Multiple containerized services with advanced operations | **Kubernetes**, if operationally justified |
| Simple containerized API with low platform-management needs | **Managed container platform** |
| Prevent public database exposure and lateral movement | **Network segmentation and deny-by-default rules** |
| Repeatable testing, security checks, and deployments | **CI/CD** |
| Reduce risk during releases | **Rolling, blue-green, or canary deployment** |
| Recover from service or data loss | **Monitoring, backups, and disaster-recovery plan** |

---

# Practical Infrastructure Progression

Start with the least complex design that meets the current needs.

```text
Small application
   |
   v
Managed database + managed application/container platform
   |
   v
IaC + CI/CD + monitoring + backups
   |
   v
Load balancing and multiple instances
   |
   v
Queues, caching, private networking, and stronger operational controls
   |
   v
Kubernetes only when its capabilities solve proven needs
```

---

# Key Takeaways

- Use separate environments to prevent untested changes and test data from affecting production.
- Define infrastructure with **IaC** so it is reproducible, reviewable, and auditable.
- Use immutable **container images** for consistent application deployment.
- Choose managed platforms before Kubernetes unless you need Kubernetes-specific capabilities.
- Keep databases and internal services private; expose only controlled HTTPS entry points.
- Enforce network least privilege and restrict unnecessary outbound access.
- Use CI/CD to automate tests, security scanning, artifact builds, and deployments.
- Deploy safely with health checks, gradual rollout strategies, and rollback/forward-fix plans.
- Monitor production, encrypt and test backups, and define recovery objectives.
- Never hardcode secrets; use managed secret storage, short-lived identities, and least-privilege access.

---
