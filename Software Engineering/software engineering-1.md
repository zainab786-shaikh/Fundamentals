# Software Engineering Learning Map

## Learning template for every topic

Each topic follows this sequence:

1. **Problem**: what goes wrong without this topic.
2. **Solution 1** → pros / cons → **the problem it leaves behind**.
3. **Solution 2** (which fixes that problem) → pros / cons → and so on.
4. **When to choose which**: a short decision guide.

Each solution's weakness leads into the next solution, so the topics build on one another.

---

## Group 1: Product Definition (Idea → Test Cases)

| # | Topic | Subtopics | Status |
|---|---|---|---|
| 1.1 | Problem discovery | Stakeholder analysis, user research, interviews, personas, Jobs-To-Be-Done, market and competitor analysis | **Added** |
| 1.2 | Vision and business case | Goals, OKRs/KPIs, success metrics, ROI, feasibility (technical, financial, legal) | **Added** |
| 1.3 | SDLC and process models | Waterfall, V-model, Iterative, Agile (Scrum, Kanban), Lean, DevOps | **Added** |
| 1.4 | Requirements elicitation | Workshops, surveys, observation, prototyping, user stories | Core |
| 1.5 | Requirements types | Functional, non-functional (performance, security, accessibility, i18n, scalability), constraints, assumptions | Core |
| 1.6 | **PRD** (Product Requirements Document) | Structure, scope and non-scope, user journeys, epics, stories, acceptance criteria, MoSCoW/RICE prioritization | Core |
| 1.7 | **BRD / SRS** | Business vs. software requirements, IEEE 830/29148 | **Added** |
| 1.8 | **TRD** (Technical Requirements Document) | Tech constraints, integrations, data requirements, SLAs/SLOs, compliance, environments | Core |
| 1.9 | Requirements quality | Ambiguity, INVEST, traceability matrix, change control, versioning | **Added** |
| 1.10 | Estimation and planning | Story points, T-shirt sizing, PERT, roadmaps, MVP, risk register | **Added** |
| 1.11 | Compliance, privacy and security requirements | GDPR, threat modeling intro, data classification | **Added** |
| 1.12 | **Test cases (from requirements)** | Acceptance criteria → Given/When/Then (BDD), equivalence classes, boundary values, test case structure, requirements-to-test traceability | Core |

---

## Group 2: Architecture and Design (including Mockups)

| # | Topic | Subtopics | Status |
|---|---|---|---|
| 2.1 | Architecture fundamentals | Quality attributes, trade-offs, ADRs (Architecture Decision Records), C4 model | **Added** |
| 2.2 | Architecture styles | Monolith, modular monolith, layered, hexagonal/clean, microservices, SOA, event-driven, serverless, CQRS/Event Sourcing | Core |
| 2.3 | Design principles | SOLID, DRY, KISS, YAGNI, separation of concerns, coupling and cohesion | **Added** |
| 2.4 | Design patterns | Creational, structural, behavioral (GoF), enterprise patterns | **Added** |
| 2.5 | Domain-driven design | Bounded contexts, aggregates, ubiquitous language | **Added** |
| 2.6 | Data design | ER modeling, normalization, SQL vs. NoSQL, indexing, caching, data migration | **Added** |
| 2.7 | API design | REST, GraphQL, gRPC, OpenAPI, versioning, idempotency, pagination | **Added** |
| 2.8 | Communication and integration | Sync vs. async, queues, pub/sub, sagas, consistency (CAP) | **Added** |
| 2.9 | Scalability, resilience and performance design | Load balancing, caching, retries, circuit breakers, capacity planning | **Added** |
| 2.10 | Security architecture | AuthN/AuthZ (OAuth2/OIDC), zero trust, STRIDE, secrets management | **Added** |
| 2.11 | UX/UI design and **mockups** | Information architecture, wireframes → mockups → prototypes (Figma), design systems, accessibility (WCAG), i18n | Core |
| 2.12 | UML and modeling | Use case, class, sequence, state, and activity diagrams | **Added** |
| 2.13 | **Mocking (design level)** | API mocks (contract-first), mock servers, service virtualization | Core |
| 2.14 | Infrastructure design | Cloud, containers, Kubernetes, IaC, networking, environments | **Added** |
| 2.15 | Design validation | Design reviews, ATAM, proof of concept, spikes | **Added** |

---

## Group 3: Implementation

| # | Topic | Subtopics | Status |
|---|---|---|---|
| 3.1 | Dev environment | IDE (VS Code), dev containers, cross-platform setup, environment config | **Added** |
| 3.2 | Version control | Git, branching strategies (trunk-based, GitFlow), commits, PRs, merge vs. rebase | **Added** |
| 3.3 | Language and programming fundamentals | Types, memory, concurrency/async, error handling (TypeScript/.NET) | **Added** |
| 3.4 | Data structures and algorithms | Complexity, common structures, search/sort | **Added** |
| 3.5 | Clean code and refactoring | Naming, code smells, refactoring techniques, technical debt | **Added** |
| 3.6 | Secure coding | Input validation, OWASP Top 10, parameterized queries, dependency vulnerabilities | **Added** |
| 3.7 | Backend implementation | Persistence, ORMs, auth, validation, background jobs | Core |
| 3.8 | Frontend implementation | Components, state management, accessibility, performance | Core |
| 3.9 | Logging, observability and error handling | Structured logs, metrics, tracing, health checks | **Added** |
| 3.10 | Configuration and secrets | Env vars, vaults, feature flags | **Added** |
| 3.11 | Code review and standards | Linters, formatters, style guides, review etiquette | **Added** |
| 3.12 | Build, CI/CD and packaging | Pipelines, artifacts, containers, SCA/SAST scanning | **Added** |
| 3.13 | Documentation | README, API docs, inline docs, runbooks | **Added** |

---

## Group 4: Testing

| # | Topic | Subtopics | Status |
|---|---|---|---|
| 4.1 | Testing fundamentals | Test pyramid, verification vs. validation, shift-left, coverage | **Added** |
| 4.2 | Test strategy and plan | Scope, risk-based testing, entry/exit criteria, environments, test data | **Added** |
| 4.3 | Unit testing | Arrange-Act-Assert, isolation, TDD | Core |
| 4.4 | **Test doubles (implementation level)** | Dummy, stub, spy, mock, fake; mocking pitfalls | Core |
| 4.5 | Integration testing | DB, API, contract testing (Pact), Testcontainers | Core |
| 4.6 | System and E2E testing | UI automation (Playwright), flaky tests | Core |
| 4.7 | Acceptance testing / BDD | UAT, executable specifications | **Added** |
| 4.8 | Non-functional testing | Performance (load, stress, soak), security (SAST/DAST, pen test), accessibility, i18n, compatibility, chaos | **Added** |
| 4.9 | Advanced techniques | Property-based, mutation, fuzzing, snapshot, exploratory | **Added** |
| 4.10 | Regression and CI test automation | Test selection, parallelization, quality gates | **Added** |
| 4.11 | Defect management | Bug lifecycle, severity vs. priority, root cause analysis | **Added** |
| 4.12 | Test metrics and reporting | Coverage, defect density, DORA metrics | **Added** |

---

## Suggested additional groups

These fall outside your four groups, but they complete the lifecycle:

- **Group 5: Deployment and Operations**: release strategies (blue/green, canary), monitoring, incident response, SRE, DevSecOps.
- **Group 6: Maintenance and Evolution**: technical debt, legacy modernization, deprecation, versioning.
- **Group 7: People and Process**: estimation, communication, code ownership, project management.

---

## Questions before I start

1. **Order of delivery**: should I go group by group (1 → 4), or topic by topic?
2. **Depth per topic**: concise (about 1 page each) or detailed with diagrams?
3. **Code examples**: I'll default to explanations only. Do you want TypeScript or .NET examples in Groups 3 and 4?
4. **Do you want Groups 5–7** added to the plan?
5. **Running example**: should I use one project (such as an "Online Booking System") through all groups, so each topic connects to the same product?

## Proposed next step

After you approve, I'll start with **Topic 1.1 (Problem discovery)** using the template. Each solution will have its pros and cons, and the weakness of one solution will lead into the next.

Should I proceed, or would you like to add, remove, or reorder any topics?


I’ll cover **one topic per response**, with every subtopic following your **Problem → Solutions → trade-offs → decision guide** template. I’ll split a topic into parts if it becomes too long.

# 1.1 Problem Discovery

**Goal:** Find a real user or business problem worth solving *before* defining features, architecture, or test cases.

A product can be technically excellent and still fail if it solves an unimportant problem, solves it for the wrong people, or misunderstands how people currently work.

---

## 1. Stakeholder Analysis

### Simple explanation

A **stakeholder** is anyone affected by the product or able to influence it: customers, users, sponsors, legal teams, support staff, operations teams, and developers.

Stakeholder analysis identifies:
- Who needs to be involved.
- Their goals, concerns, influence, and decision-making authority.
- Conflicts between their needs.

### Example

For an online appointment-booking system:

| Stakeholder | Need | Influence |
|---|---|---:|
| Patients | Quickly find and book appointments | High |
| Doctors | Avoid scheduling conflicts | High |
| Receptionists | Easily manage changes and cancellations | High |
| Clinic owner | Reduce no-shows and operating cost | High |
| Compliance officer | Protect health data | High |
| Engineering team | Clear, feasible requirements | Medium |

### Problem

Without stakeholder analysis, the team often listens only to the person funding the project.

For example, a clinic owner requests “online booking,” but receptionists are not consulted. The delivered system lets patients book appointments but makes it difficult for receptionists to manage cancellations, special appointment types, or doctor availability.

### Solution 1: Identify the project sponsor

Start by identifying the person or group funding and approving the work.

**Pros**
- Fast.
- Establishes business goals and budget boundaries.
- Clarifies who makes final decisions.

**Cons**
- Sponsors may not be daily users.
- Their view can be biased toward financial outcomes.
- Important operational or legal requirements may be missed.

**Problem left behind:** You know who pays for the product, but not everyone who uses, supports, or is affected by it.

### Solution 2: Create a stakeholder map

List all stakeholder groups and classify them by:
- **Interest:** How much the product affects them.
- **Influence:** How much power they have over decisions.

A common approach is an **interest–influence matrix**:

| Category | Approach |
|---|---|
| High interest, high influence | Manage closely; involve in decisions |
| High interest, low influence | Keep informed; collect feedback |
| Low interest, high influence | Keep satisfied; escalate key risks |
| Low interest, low influence | Monitor; communicate as needed |

**Pros**
- Prevents overlooked groups.
- Makes communication planning easier.
- Reveals potential conflicts early.

**Cons**
- A list alone does not reveal the real needs behind stakeholders’ requests.
- Stakeholders may state desired features rather than underlying problems.

**Problem left behind:** You know *who* to speak with, but not necessarily *what they truly need*.

### Solution 3: Define stakeholder goals, concerns, and authority

For each stakeholder, document:
- Their desired outcomes.
- Their pain points.
- Decisions they own.
- Risks they are responsible for.
- How success will be measured.

Example:

| Stakeholder | Goal | Concern | Authority |
|---|---|---|---|
| Receptionist | Process changes quickly | Double bookings | Defines scheduling workflow |
| Compliance officer | Ensure lawful data handling | Unauthorized access | Approves privacy controls |
| Patient | Book in under two minutes | Confusing availability | Provides usability feedback |

**Pros**
- Converts generic stakeholder lists into actionable information.
- Makes conflicts explicit.
- Helps prioritize interviews and workshops.

**Cons**
- Needs regular review as people, scope, and regulations change.
- Can become bureaucratic if maintained in too much detail.

### When to choose which

- Use **Solution 1** for a very small project with one clear decision-maker.
- Use **Solution 2** when multiple departments, customers, or external parties are involved.
- Use **Solution 3** for products with compliance, security, operational, or competing business concerns.

---

## 2. User Research

### Simple explanation

**User research** gathers evidence about users’ behaviors, needs, frustrations, and environment. It prevents product decisions based only on assumptions.

Research can be:
- **Qualitative:** Explains *why* people behave in a certain way. Examples: interviews, observation.
- **Quantitative:** Shows *how often* something happens. Examples: surveys, analytics.

### Example

A team assumes users abandon a purchase because delivery is expensive. Research reveals that most users abandon the process because the checkout form rejects apartment numbers without explaining why.

### Problem

Without research, teams build features based on opinions:

> “Users want a dashboard.”  
> “Customers need AI recommendations.”  
> “Nobody reads emails anymore.”

These statements might be true, but they are hypotheses—not evidence.

### Solution 1: Use internal opinions and existing knowledge

Ask sales, support, product, and operations teams what customers complain about.

**Pros**
- Very fast.
- Low cost.
- Support teams often know common user pain points.

**Cons**
- Internal teams may hear only from highly dissatisfied or highly vocal users.
- They can mistake a requested feature for the actual user problem.
- Information may be old or anecdotal.

**Problem left behind:** Internal knowledge is useful, but it may not reflect real user behavior or the needs of quieter user groups.

### Solution 2: Conduct qualitative research

Use interviews, usability tests, contextual inquiry, or observation to understand behavior and reasoning.

Example finding:

> “Users do not want more filters. They cannot tell which existing filters are currently applied.”

**Pros**
- Reveals motivations, workarounds, confusion, and unmet needs.
- Helps discover unexpected problems.
- Produces rich context for requirements and design.

**Cons**
- Small samples do not reliably measure frequency.
- Researcher questions can introduce bias.
- Takes time to recruit appropriate participants.

**Problem left behind:** You learn *why* a problem occurs, but not necessarily how widespread or commercially important it is.

### Solution 3: Combine qualitative and quantitative research

Validate qualitative findings using product analytics, surveys, support-ticket patterns, conversion funnels, or experiments.

Example:
1. Interviews reveal checkout-form confusion.
2. Analytics show 38% of users leave at the address step.
3. A redesigned address form reduces abandonment to 17%.

**Pros**
- Balances depth with scale.
- Supports evidence-based prioritization.
- Makes outcomes measurable.

**Cons**
- Requires reliable event tracking and privacy-aware analytics.
- Correlation does not always prove causation.
- More expensive than using one method alone.

### When to choose which

- Use **Solution 1** to form initial hypotheses quickly.
- Use **Solution 2** when you need to understand a new workflow, behavior, or usability issue.
- Use **Solution 3** before making high-cost product decisions or scaling a solution to many users.

---

## 3. Interviews

### Simple explanation

A **user interview** is a structured conversation used to understand a participant’s real experiences, goals, pain points, and current workflow.

Good interviews focus on past behavior, not speculative opinions.

Prefer:

> “Tell me about the last time you scheduled an appointment.”

Over:

> “Would you use an AI appointment scheduler?”

### Example

For expense-management software:

**Weak question:** “Would an automated receipt scanner be useful?”  
Most participants may say yes.

**Better question:** “How did you submit your most recent expense claim?”  
This may reveal that employees lose receipts, managers delay approvals, and finance staff manually re-enter data.

### Problem

Without interviews, requirements may be based on guesses and feature requests rather than user outcomes.

A user might request an “export to Excel” button, but the deeper problem may be that the existing reports do not show the information they need.

### Solution 1: Ask direct feature-preference questions

Examples:
- “Do you want dark mode?”
- “Would you use an export button?”
- “Do you like this design?”

**Pros**
- Easy to ask.
- Generates quick feedback.
- Helpful for low-risk visual preferences.

**Cons**
- Users are not always good at predicting future behavior.
- Answers are influenced by wording and social pressure.
- Feature requests rarely explain the underlying problem.

**Problem left behind:** You collect opinions, but not reliable evidence of real work, context, or priorities.

### Solution 2: Use behavioral, open-ended questions

Ask about concrete past events:
- “Walk me through the last time you completed this task.”
- “What made that difficult?”
- “What did you do when the system could not help?”
- “How often does this happen?”
- “What happens if this task is delayed or done incorrectly?”

**Pros**
- Reveals real workflows and workarounds.
- Reduces hypothetical answers.
- Identifies consequences, frequency, and urgency.

**Cons**
- Participants may forget details.
- Interviews are time-consuming.
- Poor facilitation can still create bias.

**Problem left behind:** Interview answers are self-reported; people may describe what they think they do rather than what they actually do.

### Solution 3: Pair interviews with observation and artifacts

Ask participants to demonstrate their current workflow or show sanitized examples such as forms, spreadsheets, screenshots, or reports.

For sensitive data:
- Obtain consent.
- Minimize collected personal data.
- Redact data where possible.
- Store recordings securely with restricted access and retention limits.

**Pros**
- Validates spoken answers against actual behavior.
- Exposes hidden steps and manual workarounds.
- Produces stronger evidence for requirements.

**Cons**
- Requires more coordination and privacy safeguards.
- Observation can change how people behave.
- Some environments cannot be observed due to security or regulatory restrictions.

### When to choose which

- Use **Solution 1** only for minor preference checks after the actual problem is understood.
- Use **Solution 2** for most discovery interviews.
- Use **Solution 3** when workflows are complex, high-risk, regulated, or likely to contain hidden manual steps.

---

## 4. Personas

### Simple explanation

A **persona** is a research-based summary of a meaningful user group. It describes goals, context, behaviors, skills, and frustrations—not just demographics.

A useful persona helps teams decide:

> “Would this workflow work for a time-constrained receptionist with limited technical training?”

### Example

**Persona: Maya, Clinic Receptionist**
- Goal: Schedule and change appointments accurately.
- Context: Handles phone calls while assisting people at a front desk.
- Frustration: Current system requires opening several screens to reschedule.
- Need: A fast workflow with clear conflict warnings.
- Not useful detail: Favorite color or an invented biography unrelated to the product.

### Problem

Without personas, teams may use a vague, unrealistic “average user.”

This leads to conflicting design decisions:
- “Make it powerful for experts.”
- “Make it simple for beginners.”
- “Add every option to the first screen.”

### Solution 1: Use demographics-only profiles

Example:
- Age: 25–45
- Location: United Kingdom
- Job title: Administrator

**Pros**
- Simple to produce.
- Can help with broad market segmentation.
- May be useful for legal, language, or accessibility planning.

**Cons**
- Demographics rarely explain product behavior.
- Can encourage stereotypes.
- Does not tell the team what tasks, pain points, or outcomes matter.

**Problem left behind:** The team knows who users are statistically, but not what they are trying to achieve.

### Solution 2: Create goal- and behavior-based personas

Build personas from research findings:
- Role and environment.
- Main jobs and desired outcomes.
- Behavioral patterns.
- Constraints.
- Digital confidence and accessibility needs.
- Pain points and workarounds.

**Pros**
- Supports product, UX, requirements, and test-case decisions.
- Keeps attention on user outcomes.
- Helps distinguish genuinely different user groups.

**Cons**
- Can become fictional if not evidence-based.
- Too many personas create confusion.
- Personas can become outdated as the product or market changes.

**Problem left behind:** Personas summarize groups well, but may hide context-specific moments where needs change.

### Solution 3: Use personas with scenarios and user journeys

Add realistic situations:

> Maya receives a call from a patient who needs to reschedule while three people wait at the desk. She must find a valid slot, avoid conflicts, confirm the change, and notify the doctor in under two minutes.

**Pros**
- Turns static profiles into actionable product situations.
- Exposes time pressure, edge cases, and accessibility needs.
- Helps create user stories and acceptance criteria later.

**Cons**
- Requires validation against actual workflows.
- May become overly detailed if every rare scenario is included.

### When to choose which

- Use **Solution 1** for high-level market reporting only.
- Use **Solution 2** when designing workflows for distinct user groups.
- Use **Solution 3** when defining requirements, UX flows, and acceptance tests.

---

## 5. Jobs-To-Be-Done (JTBD)

### Simple explanation

**Jobs-To-Be-Done** focuses on the progress a person is trying to make in a situation. Users “hire” a product or workaround to get a job done.

It shifts the question from:

> “What feature should we build?”

to:

> “What outcome is the user trying to achieve, and what prevents it?”

### Example

A person does not “need a drill.” They need to create a hole in a wall safely and accurately.

For a clinic:

> “When a patient cancels at short notice, help me fill the appointment slot quickly so that the doctor’s time is not wasted.”

The job is not “use a cancellation-management screen.”

### Problem

Feature-centered thinking produces requirements like:
- Add notifications.
- Build a dashboard.
- Add AI search.
- Add a calendar.

The team may build the requested feature without understanding why it matters.

### Solution 1: Capture feature requests

Record what users ask for.

**Pros**
- Easy to collect from feedback, sales, and support.
- Can identify recurring demand.
- Helpful input for a backlog.

**Cons**
- A feature request is usually a proposed solution.
- Different users may request different features for the same underlying need.
- Building all requests creates product bloat.

**Problem left behind:** The team has a list of solutions but lacks a shared understanding of the desired outcome.

### Solution 2: Write a JTBD statement

A common structure is:

> **When** [situation],  
> **I want to** [motivation/action],  
> **so I can** [desired outcome].

Example:

> When a patient cancels at short notice, I want to identify suitable waiting-list patients quickly, so I can fill the slot without manually calling dozens of people.

**Pros**
- Focuses on user outcomes.
- Encourages multiple solution ideas.
- Helps identify competing alternatives, including spreadsheets and manual processes.

**Cons**
- A job statement alone does not prove importance, frequency, or willingness to pay.
- Poorly written jobs may still contain a hidden solution.

**Problem left behind:** You understand the desired progress, but you still need evidence that solving it creates sufficient value.

### Solution 3: Prioritize jobs using importance and satisfaction

Ask users:
- How important is this outcome?
- How satisfied are you with current alternatives?
- How frequently does the situation happen?
- What is the cost of failure or delay?

A high-value opportunity is typically:
- **Important**
- **Poorly satisfied by current options**
- **Frequent or costly**

**Pros**
- Connects discovery to prioritization.
- Avoids investing in low-impact jobs.
- Helps make a business case.

**Cons**
- Survey answers can be biased.
- Needs validation with behavioral evidence and market data.
- Cannot replace technical, legal, or security feasibility analysis.

### When to choose which

- Use **Solution 1** as input, but do not treat requests as requirements.
- Use **Solution 2** to understand user outcomes and generate solution options.
- Use **Solution 3** when prioritizing investments across several user problems.

---

## 6. Market and Competitor Analysis

### Simple explanation

**Market analysis** examines the broader problem space: customer segments, alternatives, trends, regulations, pricing, and demand.

**Competitor analysis** examines how other products—including manual processes and internal tools—solve the same problem.

The key is to learn, not copy.

### Example

A team wants to build a team-chat product. Competitors include:
- Slack and Microsoft Teams.
- Email.
- Shared documents.
- Phone calls.
- Existing internal communication tools.

The real competition is any alternative users choose instead.

### Problem

Without market and competitor analysis, teams may:
- Build something with no demand.
- Duplicate a mature product without differentiation.
- Miss legal, privacy, regional, or pricing constraints.
- Underestimate existing user habits.

### Solution 1: Review competitor feature lists

Compare visible features, pricing pages, reviews, and marketing claims.

**Pros**
- Fast and low-cost.
- Identifies baseline expectations.
- Helps avoid missing obvious capabilities.

**Cons**
- Encourages feature copying.
- Competitors’ marketing may not reflect actual user satisfaction.
- Does not explain why customers choose or leave competitors.

**Problem left behind:** You know what competitors advertise, but not where users struggle or where an opportunity exists.

### Solution 2: Analyze competitor strengths, weaknesses, and alternatives

Study:
- Public reviews and support forums.
- Onboarding flows.
- Pricing and packaging.
- Accessibility and localization.
- Security and compliance claims.
- Switching costs.
- Manual alternatives, not only software competitors.

Example insight:

> Competitors have strong scheduling features, but small clinics struggle with setup complexity and cannot easily configure local privacy requirements.

**Pros**
- Finds opportunities for differentiation.
- Identifies market risks and entry barriers.
- Reveals non-feature factors such as trust, support, integration, and price.

**Cons**
- Public feedback is biased toward extreme experiences.
- Some competitor information is unavailable.
- Analysis can become endless without a decision goal.

**Problem left behind:** Market gaps are opportunities, but they are not proof that your target users want or will adopt your solution.

### Solution 3: Validate the opportunity with target users

Test a clear hypothesis with the intended market segment:

> “Small clinics will adopt a simpler scheduling product if it reduces setup time from two days to two hours while meeting local privacy obligations.”

Validate with:
- Interviews.
- Prototype tests.
- Landing-page experiments.
- Pilot programs.
- Paid trials where appropriate.

Do not collect unnecessary personal data. Use consent, minimize data, and protect research records.

**Pros**
- Connects market analysis to real customer demand.
- Tests differentiation before major investment.
- Helps estimate adoption barriers and pricing sensitivity.

**Cons**
- Experiments require careful design.
- Early interest may not become long-term use.
- A pilot is not automatically representative of the entire market.

### When to choose which

- Use **Solution 1** for a quick baseline before ideation.
- Use **Solution 2** to define differentiation and identify risks.
- Use **Solution 3** before committing significant engineering, sales, or operational investment.

---

# Topic 1.1 Decision Guide

| If you need to… | Start with… |
|---|---|
| Identify everyone affected by the product | Stakeholder analysis |
| Understand real behavior and pain points | User research and interviews |
| Keep the team focused on distinct user groups | Personas |
| Focus on outcomes instead of requested features | Jobs-To-Be-Done |
| Understand demand, alternatives, and differentiation | Market and competitor analysis |

## How this leads to Topic 1.2

Problem discovery tells you **which problem is worth solving**, **for whom**, and **why current alternatives fail**.

The next question is:

> “Is this opportunity valuable and feasible enough to justify investment, and how will we measure success?”

That leads to **1.2 Vision and Business Case**.

# 1.2 Vision and Business Case

**Goal:** Turn a validated problem into a clear direction, measurable outcomes, and a justified investment decision.

Problem discovery establishes that users have a real problem. A vision and business case establish whether solving that problem is worthwhile, feasible, and aligned with organizational goals.

---

## 1. Product Vision

### Simple explanation

A **product vision** is a concise description of the future value the product will create for a target group.

It answers:

- Who is this for?
- What problem will it solve?
- What outcome will it create?
- Why is it different or better than alternatives?

It should guide decisions without prescribing every feature.

### Example

> For small clinics that lose revenue through unfilled cancelled appointments, our scheduling platform helps staff fill open slots quickly through an easy waiting-list workflow, unlike complex enterprise systems that require costly configuration.

### Problem

Without a vision, teams can build disconnected features based on the loudest requests:

- “Add SMS notifications.”
- “Add a dashboard.”
- “Add AI.”
- “Support more report exports.”

Each may be useful, but the product gradually becomes a collection of features without a coherent outcome.

### Solution 1: Use a feature roadmap as the direction

A roadmap might say:

- Q1: Build calendar.
- Q2: Add notifications.
- Q3: Add reporting.

**Pros**
- Easy to communicate.
- Gives engineering teams a near-term implementation sequence.
- Helps estimate delivery work.

**Cons**
- Describes outputs, not customer or business outcomes.
- Assumes the proposed features are correct before validating them.
- Makes it difficult to reject features that do not support the product’s purpose.

**Problem left behind:** The team knows what to build next, but not why those features matter or how to judge whether they worked.

### Solution 2: Write a vision statement

Use a structure such as:

> For **[target user]** who need **[problem/outcome]**, **[product]** provides **[key value]**, unlike **[alternative]**, it **[differentiator]**.

**Pros**
- Creates a shared purpose across product, engineering, design, sales, and support.
- Helps prevent scope creep.
- Keeps focus on users and value rather than implementation details.

**Cons**
- Can become vague marketing language.
- Does not define how success will be measured.
- Does not prove the product is financially or technically viable.

**Problem left behind:** The team has direction, but cannot objectively determine whether the vision is being achieved.

### Solution 3: Pair vision with measurable outcomes

Define measurable outcomes that show whether the vision is becoming real.

For the clinic example:

| Outcome | Measure | Target |
|---|---|---|
| Fill cancelled appointment slots faster | Median time to fill a cancelled slot | Reduce from 4 hours to 30 minutes |
| Reduce lost appointment revenue | Percentage of cancelled slots left unfilled | Reduce from 22% to 10% |
| Improve staff workflow | Receptionist task-completion rate | At least 95% in usability tests |

**Pros**
- Links product direction to observable value.
- Enables evidence-based prioritization.
- Makes it easier to stop or change ineffective work.

**Cons**
- Metrics can be misleading when chosen poorly.
- Collecting metrics may require analytics, privacy review, and baseline data.
- Teams can optimize a metric while harming the actual user experience.

### When to choose which

- Use **Solution 1** only as a delivery plan after the product direction is clear.
- Use **Solution 2** to align stakeholders around the intended long-term value.
- Use **Solution 3** when managing investment, prioritization, and product progress.

---

## 2. Goals

### Simple explanation

A **goal** is a broad, meaningful outcome the organization wants to achieve. It should describe impact, not a feature or task.

Good goal:

> Reduce avoidable appointment revenue loss for small clinics.

Weak goal:

> Launch a waiting-list feature.

### Example

For the scheduling platform:

- **Business goal:** Increase recurring revenue from small clinics.
- **User goal:** Reduce receptionist effort when filling cancelled slots.
- **Product goal:** Make waiting-list matching reliable and fast.

### Problem

Without explicit goals, teams may measure activity instead of impact:

- Number of features shipped.
- Number of tickets closed.
- Number of lines of code written.
- Number of releases completed.

These measures can indicate output, but not whether the product improved a user or business outcome.

### Solution 1: Set activity-based goals

Examples:
- Release version 2.0 by June.
- Complete 30 backlog items.
- Add support for three integrations.

**Pros**
- Straightforward to track.
- Useful for coordinating delivery commitments.
- Helpful when work is contractual or compliance-driven.

**Cons**
- Encourages shipping regardless of usefulness.
- Does not measure adoption, quality, value, or customer impact.
- Can reward completing the wrong work efficiently.

**Problem left behind:** The team can prove that work was delivered but not that it solved the intended problem.

### Solution 2: Set outcome-based goals

Examples:
- Reduce appointment-slot fill time.
- Increase successful booking completion.
- Reduce support contacts related to scheduling errors.

**Pros**
- Focuses on user and business value.
- Encourages experimentation and learning.
- Allows multiple implementation approaches.

**Cons**
- Outcomes can be affected by external factors such as seasonality or marketing.
- May take longer to observe than delivery metrics.
- Requires reliable measurement and a known baseline.

**Problem left behind:** Outcomes provide direction, but large goals may still be too broad to guide weekly decisions.

### Solution 3: Break goals into measurable objectives and initiatives

Example:

- **Goal:** Reduce lost revenue from appointment cancellations.
- **Objective:** Reduce unfilled cancellations from 22% to 10% within six months.
- **Initiative:** Build and test waiting-list matching, staff notifications, and patient confirmation workflows.

**Pros**
- Connects strategy with delivery.
- Makes assumptions explicit.
- Supports staged investment and reassessment.

**Cons**
- Needs active maintenance when evidence changes.
- Can create excessive reporting if too many objectives exist.
- A hierarchy does not replace user research or technical feasibility analysis.

### When to choose which

- Use **Solution 1** for delivery milestones, but do not use it as the primary definition of success.
- Use **Solution 2** for product and business direction.
- Use **Solution 3** for larger initiatives involving multiple teams or phased delivery.

---

## 3. OKRs and KPIs

### Simple explanation

**OKRs** and **KPIs** both measure progress, but serve different purposes.

- **Objective and Key Results (OKRs):** Time-bound, ambitious change goals.
- **Key Performance Indicators (KPIs):** Ongoing health measures for a product, service, or business.

### Example

**Objective:** Make appointment cancellations less costly for clinics.

**Key Results:**
1. Reduce unfilled cancelled slots from 22% to 10%.
2. Reduce median time to contact an eligible waiting-list patient from 45 minutes to 5 minutes.
3. Reach a staff satisfaction score of at least 4.2/5 for cancellation management.

**Ongoing KPIs:**
- Booking completion rate.
- System availability.
- Cancellation rate.
- Median response time.
- Support tickets per active clinic.

### Problem

Without a structured approach, teams may collect too many metrics or choose vanity metrics.

Examples of vanity metrics:
- Total app downloads.
- Number of registered users.
- Total page views.

These can increase even if users do not successfully complete important tasks.

### Solution 1: Track simple usage metrics

Examples:
- Monthly active users.
- Number of bookings created.
- Number of notifications sent.

**Pros**
- Usually easy to instrument.
- Useful for detecting broad adoption trends.
- Can reveal sudden regressions.

**Cons**
- Does not show whether usage produced value.
- Can be manipulated by unwanted behavior.
- May ignore user groups with low volume but high importance.

**Problem left behind:** You know that people used the product, but not whether it helped them achieve their goals.

### Solution 2: Define outcome-oriented KPIs

Measure successful completion and quality:

- Percentage of users who complete a booking.
- Time required to reschedule an appointment.
- Rate of duplicate bookings.
- Percentage of users who return after first use.

**Pros**
- Closer to user and business value.
- Helps identify where workflows fail.
- Supports prioritization based on real product health.

**Cons**
- Requires careful event definitions.
- Can create privacy risk if telemetry collects unnecessary personal data.
- A single KPI can hide unequal outcomes between user groups.

**Problem left behind:** Ongoing KPIs monitor health, but they do not necessarily drive a focused change initiative.

### Solution 3: Use OKRs for change and KPIs for health

Use:
- **KPIs** to watch ongoing system, product, and business health.
- **OKRs** to make deliberate improvements over a defined period.

For secure analytics:
- Collect only events necessary for the defined measure.
- Avoid recording sensitive data in event names or properties.
- Use pseudonymous identifiers where possible.
- Apply access controls and retention policies.
- Review regional privacy requirements before deployment.

**Pros**
- Separates “keep the service healthy” from “make a meaningful improvement.”
- Reduces metric overload.
- Creates a clear rhythm for planning and review.

**Cons**
- Requires disciplined metric ownership.
- Poorly designed OKRs can become performance targets and encourage gaming.
- Measurement does not establish causation by itself.

### When to choose which

- Use **Solution 1** for lightweight monitoring during early exploration.
- Use **Solution 2** to understand ongoing product health.
- Use **Solution 3** when the organization needs both operational visibility and structured improvement goals.

---

## 4. Success Metrics

### Simple explanation

A **success metric** is a specific measurement used to determine whether a product, feature, or initiative achieved its intended result.

A strong metric is:
- Directly connected to the user or business problem.
- Clearly defined.
- Measurable consistently.
- Compared against a baseline or target.
- Difficult to improve without creating real value.

### Example

Weak metric:

> Number of waiting-list notifications sent.

Better metric:

> Percentage of cancelled appointments filled within two hours.

The better metric measures the desired result, not the feature’s activity.

### Problem

Without success metrics, teams cannot distinguish between:

- A feature being shipped.
- A feature being used.
- A feature producing value.
- A feature causing unintended harm.

### Solution 1: Use delivery metrics

Examples:
- Feature released on time.
- Number of users enabled.
- Percentage of code coverage.

**Pros**
- Important for release management and engineering quality.
- Easy to understand.
- Useful as supporting indicators.

**Cons**
- They do not measure user impact.
- Code coverage does not prove behavioral correctness.
- On-time delivery can still deliver the wrong solution.

**Problem left behind:** Delivery metrics show readiness, not real-world success.

### Solution 2: Define a primary outcome metric

Choose one primary measure tied to the problem.

Example:

> Primary success metric: percentage of cancelled appointment slots filled within two hours.

Add supporting metrics:
- Time for a receptionist to initiate matching.
- Patient confirmation rate.
- Double-booking rate.
- Staff-reported workflow satisfaction.

**Pros**
- Creates focus.
- Makes trade-offs more visible.
- Helps determine whether the initiative should continue, change, or stop.

**Cons**
- A primary metric may be too narrow.
- Teams may optimize the metric in harmful ways.

For example, aggressively notifying patients may fill slots faster but create notification fatigue or privacy concerns.

**Problem left behind:** A single metric can hide side effects and quality regressions.

### Solution 3: Use primary, guardrail, and diagnostic metrics

Use three types:

| Type | Purpose | Example |
|---|---|---|
| Primary metric | Measures intended outcome | Cancelled slots filled within two hours |
| Guardrail metric | Detects unacceptable harm | Patient opt-out rate; duplicate-booking rate |
| Diagnostic metric | Explains why results changed | Notification delivery rate; matching eligibility rate |

**Pros**
- Balances speed, quality, safety, and user trust.
- Makes unintended consequences visible.
- Helps teams diagnose weak results.

**Cons**
- More metrics increase instrumentation and review effort.
- Teams must avoid collecting unnecessary data.
- Metrics still need qualitative research for interpretation.

### When to choose which

- Use **Solution 1** to monitor delivery and engineering readiness.
- Use **Solution 2** for small, focused experiments.
- Use **Solution 3** for user-facing, high-impact, regulated, or potentially harmful product changes.

---

## 5. Return on Investment (ROI)

### Simple explanation

**Return on Investment (ROI)** estimates whether the expected value of an initiative outweighs its total cost.

A simple formula is:

\[
\text{ROI} = \frac{\text{Benefit} - \text{Cost}}{\text{Cost}} \times 100
\]

ROI is not always financial. Benefits can include reduced support cost, lower risk, saved employee time, improved retention, or avoided compliance penalties. However, these must be estimated honestly.

### Example

A clinic platform feature costs:

- Development: \$60,000
- Testing, security review, and rollout: \$20,000
- First-year operating cost: \$20,000

**Total first-year cost:** \$100,000

Expected first-year benefit:
- Recovered appointment revenue: \$140,000
- Reduced receptionist administration: \$30,000

**Total expected benefit:** \$170,000

\[
ROI = \frac{170{,}000 - 100{,}000}{100{,}000} \times 100 = 70\%
\]

### Problem

Without ROI thinking, organizations may prioritize projects based on enthusiasm, internal politics, or the apparent attractiveness of a feature.

They may also underestimate non-development costs:
- Security testing.
- Accessibility work.
- Documentation and training.
- Customer support.
- Hosting and monitoring.
- Maintenance.
- Incident response.
- Legal or compliance review.

### Solution 1: Estimate only development cost and direct revenue

**Pros**
- Fast.
- Easy to explain.
- May be enough for tiny, reversible experiments.

**Cons**
- Underestimates total ownership cost.
- Ignores operational, security, and support needs.
- Can make risky projects look artificially attractive.

**Problem left behind:** The estimate is simple but unreliable because real lifecycle costs and risks are missing.

### Solution 2: Estimate total cost of ownership and expected benefits

Include:
- Discovery and design.
- Development and testing.
- Accessibility and localization.
- Security review and vulnerability remediation.
- Infrastructure and vendor costs.
- Training, documentation, and support.
- Ongoing maintenance.
- Expected financial or operational benefits.

Use ranges rather than false precision.

Example:

| Item | Low estimate | Likely estimate | High estimate |
|---|---:|---:|---:|
| Implementation | \$50,000 | \$60,000 | \$80,000 |
| Security and compliance | \$10,000 | \$20,000 | \$40,000 |
| First-year operations | \$15,000 | \$20,000 | \$30,000 |

**Pros**
- Gives a more realistic decision basis.
- Makes hidden costs visible.
- Encourages risk-aware planning.

**Cons**
- Estimates remain uncertain.
- Financial benefits may be difficult to attribute.
- Teams may spend too much effort modeling a low-cost decision.

**Problem left behind:** A detailed estimate shows plausible value but may still fail if assumptions about adoption, savings, or feasibility are wrong.

### Solution 3: Use staged investment and validate assumptions

Invest in progressively larger stages:

1. Research and prototype.
2. Small pilot with representative users.
3. Measure outcomes and operating cost.
4. Expand only if evidence supports it.

Document assumptions:

| Assumption | Validation method |
|---|---|
| Clinics will use the waiting list daily | Pilot usage data and interviews |
| Patients will confirm via SMS | Prototype or pilot confirmation rate |
| Notifications are legally permissible | Privacy and legal review |
| Matching can run within performance targets | Technical proof of concept and load testing |

**Pros**
- Limits financial exposure.
- Replaces assumptions with evidence.
- Allows cancellation before expensive implementation.

**Cons**
- Slower than committing fully at the start.
- Pilots require careful participant selection.
- A successful pilot may not scale without additional investment.

### When to choose which

- Use **Solution 1** only for very small, low-risk, easily reversible work.
- Use **Solution 2** for ordinary project funding decisions.
- Use **Solution 3** for uncertain, expensive, high-risk, or strategically important initiatives.

---

## 6. Feasibility Assessment

### Simple explanation

A **feasibility assessment** determines whether a proposed product or initiative can realistically be delivered and operated.

The main dimensions are:

- **Technical feasibility:** Can it be built, integrated, secured, and maintained?
- **Financial feasibility:** Are the benefits likely to justify the costs?
- **Legal and regulatory feasibility:** Is it lawful and compliant?
- **Operational feasibility:** Can users, support teams, and business processes adopt it?
- **Schedule feasibility:** Can it be delivered when needed?

### Example

For SMS appointment notifications:

- Technical: Can the system integrate with a reliable provider?
- Financial: What will each message cost at expected volume?
- Legal: Is consent required in each operating region?
- Operational: Can staff handle patients who opt out or reply?
- Schedule: Can the feature be ready before the busy season?

### Problem

Without feasibility work, a team can validate a user problem and still fail during delivery.

Examples:
- A valuable feature depends on an unavailable third-party API.
- A workflow conflicts with privacy regulations.
- The system cannot meet required performance under real usage.
- Support teams cannot operate the solution.
- An ambitious deadline forces unsafe shortcuts.

### Solution 1: Assume feasibility from past experience

For example:

> “We have built notifications before, so this will be easy.”

**Pros**
- Fast.
- Reasonable for well-understood, low-risk changes.
- Avoids unnecessary analysis for trivial work.

**Cons**
- Context changes: scale, data sensitivity, integrations, and regulations may differ.
- Can overlook hidden dependencies.
- Encourages late discovery of critical constraints.

**Problem left behind:** Familiarity creates confidence but does not verify that this specific problem is feasible.

### Solution 2: Run a structured feasibility review

Assess each dimension and record risks, assumptions, owners, and mitigations.

| Area | Question | Example risk |
|---|---|---|
| Technical | Can required integrations meet reliability needs? | Provider outage prevents confirmation |
| Financial | Can operating cost scale with use? | SMS cost exceeds revenue benefit |
| Legal | Is consent and data processing lawful? | Messages sent without valid consent |
| Operational | Can staff support the new workflow? | Manual exceptions overwhelm staff |
| Schedule | Can dependencies be delivered in time? | API contract is delayed |

**Pros**
- Reveals constraints early.
- Supports realistic estimates and planning.
- Makes decision-making transparent.

**Cons**
- Can become a paperwork exercise.
- Conclusions may still be based on assumptions.
- Needs cross-functional expertise.

**Problem left behind:** A review identifies uncertainty but does not prove the highest-risk assumptions.

### Solution 3: Use targeted proof-of-concepts and pilots

Test the riskiest unknowns directly.

Examples:
- Build a small integration proof-of-concept.
- Load-test matching under expected peak use.
- Have a privacy specialist review data flows.
- Pilot the workflow with two clinics.
- Conduct accessibility testing with representative users.

Security controls for a proof-of-concept still matter:
- Use non-production or anonymized data.
- Do not use real secrets in source code.
- Apply least-privilege access.
- Restrict test environments from public exposure.
- Remove temporary access after the evaluation.

**Pros**
- Produces evidence instead of assumptions.
- Reduces the chance of expensive late failure.
- Focuses effort on genuinely uncertain areas.

**Cons**
- Takes time and may not become production code.
- A proof-of-concept can prove possibility, not maintainability.
- Pilots can miss scale-related issues.

### When to choose which

- Use **Solution 1** only for small changes with proven patterns and no meaningful new risks.
- Use **Solution 2** for normal product initiatives with multiple stakeholders.
- Use **Solution 3** when technical, security, legal, scale, or operational uncertainty could block delivery.

---

# Topic 1.2 Decision Guide

| If you need to… | Start with… |
|---|---|
| Give the product a durable direction | Product vision |
| Connect strategy to measurable outcomes | Goals, objectives, and initiatives |
| Separate ongoing health monitoring from improvement work | KPIs and OKRs |
| Determine whether a feature achieved value without causing harm | Primary, guardrail, and diagnostic metrics |
| Decide whether investment is justified | ROI and total cost of ownership |
| Identify whether delivery is realistic before committing | Feasibility assessment and targeted proof-of-concepts |

## How this leads to Topic 1.3

A vision and business case establish **what outcome is worth pursuing**, **how success will be measured**, and **whether the work is feasible**.

The next question is:

> “How should the team organize, plan, build, validate, release, and improve this product over time?”

That leads to **1.3 SDLC and Process Models**.


# 1.3 SDLC and Process Models

**Goal:** Choose a repeatable way to turn validated requirements into secure, tested, maintainable software.

The **Software Development Life Cycle (SDLC)** describes the activities needed to create and operate software. A **process model** determines how those activities are sequenced and controlled.

Typical SDLC activities:

1. Plan and discover.
2. Define requirements.
3. Design architecture and user experience.
4. Implement.
5. Test and validate.
6. Release and deploy.
7. Operate, monitor, support, and improve.
8. Retire or replace when appropriate.

The models below differ mainly in when they perform these activities, how often they seek feedback, and how they respond to change.

---

## 1. SDLC Fundamentals

### Simple explanation

An SDLC prevents software delivery from becoming:

> “Write code quickly, then discover requirements, security issues, and operational problems just before release.”

It makes work visible and ensures product, engineering, security, operations, and users contribute at appropriate points.

### Example

For a clinic appointment system:

| SDLC stage | Example activity |
|---|---|
| Discovery | Interview receptionists and patients |
| Requirements | Define booking, cancellation, and consent rules |
| Design | Design data model, UI flow, and security controls |
| Implementation | Build the booking workflow |
| Testing | Verify conflicts, accessibility, privacy, and performance |
| Deployment | Release gradually to selected clinics |
| Operations | Monitor errors, availability, failed bookings, and support requests |
| Improvement | Reduce friction found through metrics and feedback |

### Problem

Without an SDLC, teams commonly encounter:
- Features built against unclear requirements.
- Testing performed too late.
- Production incidents caused by missing operational planning.
- Security and accessibility treated as last-minute checks.
- No owner for monitoring, support, or maintenance.

### Solution 1: Ad hoc development

The team discusses a request, writes code, and releases it.

**Pros**
- Very fast for a tiny, low-risk internal script.
- Minimal meetings and documentation.
- Useful for experiments that do not handle sensitive data or affect customers.

**Cons**
- Requirements are easy to misunderstand.
- Quality depends on individual discipline.
- Security, accessibility, operations, and maintenance are easily missed.
- Knowledge remains in people’s heads instead of the project.

**Problem left behind:** Speed comes at the cost of repeatability, auditability, and reliability.

### Solution 2: Define standard SDLC stages

Document the minimum expected activities for each stage.

For example:
- Requirements need acceptance criteria.
- Design needs security and data-flow review.
- Code needs peer review and automated tests.
- Releases need a rollback plan.
- Production services need monitoring and incident ownership.

**Pros**
- Reduces missed work.
- Clarifies responsibilities.
- Improves quality and predictability.
- Supports compliance and onboarding.

**Cons**
- Can become slow if every change receives the same process.
- Teams may treat checklists as paperwork rather than risk controls.
- Sequential handoffs can delay feedback.

**Problem left behind:** A standard lifecycle creates consistency, but it may still respond poorly to changing requirements.

### Solution 3: Use a risk-based, iterative SDLC

Apply more rigor where failure has greater impact.

For example:

| Change type | Appropriate process |
|---|---|
| Text correction | Review and automated deployment |
| Internal reporting change | Lightweight requirements, review, tests |
| Payment or health-data workflow | Detailed requirements, threat model, security review, audit trail, staged rollout |
| New architecture or vendor integration | Prototype, risk register, load testing, rollout plan |

**Pros**
- Balances delivery speed with safety.
- Applies security and quality effort where it matters most.
- Supports incremental learning and improvement.
- Works with Agile, DevOps, and other modern delivery approaches.

**Cons**
- Requires teams to assess risk well.
- Inconsistent risk decisions can cause confusion.
- Needs leadership support and clear minimum standards.

### When to choose which

- Use **Solution 1** only for disposable, isolated, non-sensitive work.
- Use **Solution 2** for stable teams building ordinary business software.
- Use **Solution 3** for most professional environments, especially systems involving customer data, money, availability commitments, or regulations.

---

## 2. Waterfall Model

### Simple explanation

**Waterfall** is a sequential process model. Work moves through defined phases, usually with formal approval before moving to the next phase.

Typical sequence:

```text
Requirements → Design → Implementation → Testing → Deployment → Maintenance
```

The idea is that each phase should be substantially complete before the next starts.

### Example

A government organization procures a system with a fixed scope, budget, regulatory obligations, and acceptance process:

1. Approve a detailed requirements specification.
2. Complete solution design.
3. Build the agreed scope.
4. Perform formal verification and user acceptance testing.
5. Deploy after approval.

### Problem

Teams need predictability, documentation, and formal control—especially for contracts, regulated environments, or expensive changes.

However, simply working without a model makes it difficult to coordinate dependencies and approvals.

### Solution 1: Use informal sequential phases

The team broadly follows requirements, design, coding, and testing, but without formal entry or exit criteria.

**Pros**
- Easier to understand than ad hoc work.
- Introduces basic planning.
- Low administrative overhead.

**Cons**
- Requirements may be declared “done” while still ambiguous.
- Testing can still be delayed.
- Stakeholders may not know what is ready for approval.
- Problems often surface late.

**Problem left behind:** Sequencing work helps, but without defined quality gates, the team can pass incomplete or risky work downstream.

### Solution 2: Use formal Waterfall phases and sign-offs

Define deliverables and approval points for each stage:

| Phase | Example deliverable |
|---|---|
| Requirements | Signed SRS or contractual specification |
| Design | Architecture and interface design |
| Implementation | Built software and code-review evidence |
| Testing | Test plan, results, and defect resolution |
| Deployment | Release approval and operating procedures |

**Pros**
- Strong traceability from requirement to test evidence.
- Clear contractual and compliance checkpoints.
- Useful where changes are costly or require formal approval.
- Helps coordinate many external suppliers.

**Cons**
- Feedback arrives late if users see working software only near the end.
- Changes can be expensive due to re-approval and rework.
- Assumes requirements can be known early and remain stable.
- May encourage producing documents rather than validating real user needs.

**Problem left behind:** Waterfall controls known requirements well, but it struggles when users, markets, technology, or regulations change during delivery.

### Solution 3: Use Waterfall selectively with early prototypes and controlled change

Keep formal phases where needed, but reduce late surprises through:
- Clickable prototypes.
- Technical proof-of-concepts.
- Early integration testing.
- Requirement reviews with actual users.
- A formal change-control process.
- Risk-based testing and security reviews throughout.

**Pros**
- Retains auditability and contractual clarity.
- Finds usability and feasibility issues earlier.
- Makes changes explicit rather than ignoring them.

**Cons**
- Still slower than iterative delivery.
- Requires governance to avoid uncontrolled scope change.
- Prototypes can be mistaken for production-ready software.

### When to choose which

- Use **Solution 1** only for small work where formality is unnecessary.
- Use **Solution 2** when scope is stable, change is costly, and documentation or approvals are mandatory.
- Use **Solution 3** for regulated or contract-driven work that still needs earlier user and technical feedback.

---

## 3. V-Model

### Simple explanation

The **V-Model** extends sequential development by explicitly pairing each development stage with a corresponding test stage.

```text
Business requirements          ↔ Acceptance testing
System requirements            ↔ System testing
Architecture / design          ↔ Integration testing
Component design               ↔ Unit testing
                Implementation
```

The left side defines what will be built; the right side verifies and validates it.

### Example

For appointment booking:

| Definition stage | Paired test stage |
|---|---|
| Business requirement: prevent double booking | Acceptance test: staff cannot confirm overlapping appointments |
| System requirement: availability is updated within five seconds | System test: verify update timing under expected load |
| Interface design: calendar service calls booking API | Integration test: calendar and booking service exchange valid data |
| Component design: conflict-check function | Unit test: overlapping time ranges return a conflict |

### Problem

In basic sequential delivery, testing is often treated as a final phase. This means requirements can be ambiguous or untestable until implementation is almost complete.

### Solution 1: Test after coding is finished

The team implements all planned functionality, then begins testing.

**Pros**
- Easy to understand.
- May work for a small, isolated application.
- Keeps implementation moving initially.

**Cons**
- Testers discover requirement gaps too late.
- Defects become expensive to fix because design and code may need rework.
- Security, performance, and integration failures may appear near release.
- Teams may cut testing to meet a deadline.

**Problem left behind:** Late testing finds defects but does not prevent unclear or untestable requirements from entering development.

### Solution 2: Plan tests alongside requirements and design

For every requirement, define:
- How it will be verified.
- Required test data and environment.
- Expected result.
- Acceptance criteria.
- Relevant security, accessibility, reliability, and performance checks.

Example:

> Requirement: A receptionist must not create conflicting appointments.  
> Verification: Automated integration test attempts concurrent bookings for the same clinician and time.  
> Expected result: Exactly one succeeds; the other receives a safe, understandable conflict response.

**Pros**
- Makes requirements measurable and testable.
- Finds ambiguity early.
- Improves traceability.
- Encourages test automation planning before implementation.

**Cons**
- Requires more up-front analysis.
- Can become document-heavy.
- Detailed test plans may need revision when requirements change.

**Problem left behind:** Test planning improves quality, but strict phase separation still delays learning from real users and working software.

### Solution 3: Use V-Model traceability within iterative delivery

Apply V-Model thinking in short iterations:
- Define acceptance criteria before development.
- Write unit, integration, and end-to-end tests during implementation.
- Map high-risk requirements to explicit verification.
- Run automated regression tests continuously.
- Include exploratory testing and user validation before release.

**Pros**
- Retains strong verification discipline.
- Works well in regulated, safety-critical, or security-sensitive systems.
- Supports continuous testing rather than a late test phase.
- Provides evidence for audits.

**Cons**
- Requires investment in automation, environments, and test data.
- Traceability can become expensive if maintained manually.
- Not every low-risk change needs the same evidence level.

### When to choose which

- Use **Solution 1** only for minimal prototypes where failure has little impact.
- Use **Solution 2** when requirements must be demonstrably verified.
- Use **Solution 3** for modern teams that need both iterative delivery and strong quality or compliance evidence.

---

## 4. Iterative Development

### Simple explanation

**Iterative development** delivers the product in repeated cycles. Each cycle produces a usable improvement, gathers feedback, and informs the next cycle.

```text
Plan → Build a small slice → Test → Release or review → Learn → Repeat
```

The product is refined through multiple iterations rather than delivered only once at the end.

### Example

Instead of building every scheduling capability before release:

1. **Iteration 1:** Staff manually create appointments.
2. **Iteration 2:** Add conflict detection.
3. **Iteration 3:** Add patient self-service booking.
4. **Iteration 4:** Add cancellation and waiting-list workflows.
5. **Iteration 5:** Improve performance and reporting based on usage.

### Problem

Waterfall and similarly sequential models struggle when:
- Users refine their needs after seeing working software.
- Integration risks are uncertain.
- Market conditions change.
- A large scope must be prioritized.

### Solution 1: Deliver the whole product at once

The team attempts to implement all intended features before users receive value.

**Pros**
- A complete initial release can look coherent.
- May be necessary when partial operation is impossible.
- Simpler external messaging: one release date.

**Cons**
- Delays feedback and value.
- Increases risk of building unnecessary features.
- Makes scope, schedule, and defects accumulate.
- Large releases are difficult to test, deploy, and roll back.

**Problem left behind:** Big-bang delivery postpones uncertainty until the most expensive point.

### Solution 2: Deliver in functional increments

Split the product into small, meaningful slices that users can use.

A good increment crosses layers:
- User interface.
- Business rules.
- Data storage.
- Authorization.
- Logging and monitoring.
- Tests.

Avoid calling an internal layer “done” if users cannot obtain value from it.

**Pros**
- Delivers value earlier.
- Validates assumptions sooner.
- Reduces deployment risk.
- Allows re-prioritization based on evidence.

**Cons**
- Requires careful architecture to avoid short-term shortcuts becoming permanent.
- Stakeholders may perceive early versions as incomplete.
- Dependencies can make slicing difficult.

**Problem left behind:** Increments enable learning, but teams can still drift without disciplined planning, quality controls, and prioritization.

### Solution 3: Use short iterations with feedback and definition of done

For each iteration:
1. Select a small, prioritized outcome.
2. Clarify acceptance criteria.
3. Design and implement the slice.
4. Validate with automated and manual tests.
5. Demonstrate to stakeholders or release safely.
6. Use feedback and metrics to adjust the next iteration.

A secure definition of done might include:
- Peer-reviewed code.
- Input validation and authorization checks.
- Automated tests passing.
- Dependency and secret scanning.
- Logs without sensitive data.
- Documentation updated.
- Monitoring or alerts added where needed.

**Pros**
- Balances adaptability with delivery discipline.
- Exposes risk and misunderstanding early.
- Encourages continuous improvement.

**Cons**
- Requires frequent stakeholder availability.
- Needs strong backlog management.
- Teams can mistake “iteration” for “rush” if quality is not part of done.

### When to choose which

- Use **Solution 1** only where partial delivery is impossible and requirements are genuinely stable.
- Use **Solution 2** for most product development.
- Use **Solution 3** when requirements, risk, or user feedback are expected to evolve.

---

## 5. Agile

### Simple explanation

**Agile** is a family of principles and practices for delivering value in small increments, collaborating closely with stakeholders, and adapting based on evidence.

Agile is not a single process. **Scrum** and **Kanban** are common frameworks used to apply Agile principles.

Core Agile ideas include:
- Deliver working software frequently.
- Learn through feedback.
- Collaborate across roles.
- Welcome valuable change.
- Maintain technical quality and sustainable pace.

### Example

A team learns that patients abandon booking because availability is confusing. Rather than waiting for the annual release, it:
1. Researches the issue.
2. Designs a small availability improvement.
3. Implements and tests it.
4. Releases it to a limited group.
5. Measures completed bookings and support contacts.
6. Adjusts based on evidence.

### Problem

Traditional, fixed plans can fail when requirements change. However, replacing planning with “just build whatever is next” creates disorder, technical debt, and unclear commitments.

### Solution 1: Treat Agile as no documentation and no planning

Common misunderstandings:
- “We can skip requirements because we are Agile.”
- “We do not need design.”
- “Testing will happen later.”
- “We can change scope every day without impact.”

**Pros**
- Appears fast at first.
- Reduces visible process overhead.
- Can feel flexible.

**Cons**
- Creates unclear priorities and rework.
- Makes compliance, security, and knowledge transfer difficult.
- Produces unstable commitments.
- Usually shifts planning effort into repeated interruptions.

**Problem left behind:** Removing structure does not create agility; it creates unpredictability.

### Solution 2: Use Agile ceremonies and artifacts

Examples:
- A prioritized backlog.
- User stories with acceptance criteria.
- Iteration or sprint planning.
- Daily coordination.
- Reviews or demos.
- Retrospectives.
- Regular refinement.

**Pros**
- Creates regular opportunities for feedback.
- Makes work and blockers visible.
- Supports incremental delivery.
- Encourages continuous improvement.

**Cons**
- Ceremonies can become routine meetings without value.
- Story points and velocity can be misused as individual performance metrics.
- Teams may follow the process while still failing to release useful software.

**Problem left behind:** A team can “do Agile” mechanically without achieving customer outcomes or operational reliability.

### Solution 3: Apply Agile principles with engineering and product discipline

Use lightweight process to support—not replace—good work:
- Maintain a clear product goal and prioritized outcomes.
- Keep requirements testable.
- Build quality into each increment.
- Use continuous integration and automated tests.
- Engage users and stakeholders regularly.
- Make technical debt visible and allocate time to address it.
- Measure outcomes after release, not only completed backlog items.

**Pros**
- Produces frequent learning and value.
- Supports changing requirements.
- Maintains sustainable quality.
- Works across many product contexts.

**Cons**
- Needs empowered teams and available decision-makers.
- Requires investment in automation and collaboration.
- Harder when external contracts demand a fixed scope and timeline.

### When to choose which

- Avoid **Solution 1**; it is a misuse of Agile.
- Use **Solution 2** when a team needs a clear starting structure.
- Use **Solution 3** when the goal is genuine adaptability with predictable quality.

---

## 6. Scrum

### Simple explanation

**Scrum** is an Agile framework that organizes work into fixed-length iterations called **Sprints**, commonly one or two weeks.

Core accountabilities:
- **Product Owner:** Maximizes product value and manages backlog ordering.
- **Developers:** Build the increment and maintain quality.
- **Scrum Master:** Helps the team use Scrum effectively and remove systemic blockers.

Key events:
- Sprint Planning.
- Daily Scrum.
- Sprint Review.
- Sprint Retrospective.

### Example

A two-week sprint goal:

> Enable receptionists to identify and contact eligible waiting-list patients for a newly cancelled appointment.

The team selects a small set of related backlog items, defines acceptance criteria, builds the feature, tests it, demonstrates it, and uses feedback to plan next steps.

### Problem

Continuous work without time boundaries can lead to:
- Priorities changing every day.
- Work remaining “almost done” for long periods.
- Stakeholders lacking predictable review points.
- Little opportunity to inspect and improve how the team works.

### Solution 1: Use a simple task list with no iteration goal

Tasks might be:
- Build notification API.
- Update calendar UI.
- Add database table.
- Fix bug.

**Pros**
- Very easy to begin.
- Low process overhead.
- Useful for a small maintenance queue.

**Cons**
- Tasks may not form a usable outcome.
- Progress is difficult to explain to stakeholders.
- Teams can complete many tasks without delivering value.
- Priority changes can disrupt partially completed work.

**Problem left behind:** A task list manages activity but does not ensure a coherent, testable product increment.

### Solution 2: Use Scrum sprints and a sprint backlog

At sprint planning:
- Agree on a **Sprint Goal**.
- Select work supporting that goal.
- Create a plan for delivery.
- Avoid unnecessary mid-sprint changes that would invalidate the goal.

At the end:
- Review the increment with stakeholders.
- Retrospect on process improvements.

**Pros**
- Creates a regular feedback rhythm.
- Encourages delivery of a usable increment.
- Protects short-term focus.
- Supports learning through reviews and retrospectives.

**Cons**
- Fixed sprints can be awkward for urgent operational work.
- Poorly refined work causes planning churn.
- Teams may treat sprint commitments as promises regardless of new evidence.
- Ceremony overhead can be excessive for very small teams.

**Problem left behind:** Sprints create focus, but unpredictable operational work and continuous-flow tasks may not fit cleanly into timeboxes.

### Solution 3: Use Scrum where timeboxed goals fit; adapt supporting practices carefully

Use Scrum when:
- A cross-functional team can deliver a usable increment each sprint.
- Product work benefits from a review rhythm.
- The team can reasonably protect sprint focus.

Add supporting practices:
- A small expedited path for genuine production incidents.
- Automated CI/CD so work is releasable before sprint end.
- Security and accessibility acceptance criteria.
- Product analytics and user feedback after release.

Do not weaken controls for urgent changes:
- Require peer review where practical.
- Use audited, least-privilege emergency access.
- Record the reason for the emergency change.
- Perform a follow-up review and permanent fix.

**Pros**
- Maintains Scrum’s inspection and adaptation benefits.
- Handles real operational constraints.
- Keeps quality and security visible.

**Cons**
- Requires clear rules to prevent every request becoming “urgent.”
- Hybrid models can become confusing if responsibilities are not explicit.

### When to choose which

- Use **Solution 1** for very small, low-risk maintenance lists.
- Use **Solution 2** for stable product teams delivering planned increments.
- Use **Solution 3** for production teams that need Scrum’s cadence alongside controlled operational flexibility.

---

## 7. Kanban

### Simple explanation

**Kanban** is a flow-based method for managing work continuously. It visualizes work, limits work in progress (WIP), and improves how quickly and reliably work moves from request to completion.

A basic board may look like:

```text
Ready → In Development → Code Review → Testing → Ready to Release → Done
```

### Example

A platform-support team receives a continuous mixture of:
- Production defects.
- Small customer requests.
- Dependency updates.
- Security fixes.
- Operational improvements.

Instead of batching all work into fixed sprints, it pulls the highest-priority ready item when capacity becomes available.

### Problem

Without flow control, teams start too much work at once. This creates:
- Context switching.
- Long cycle times.
- Large queues in code review or testing.
- Work hidden in partially complete states.
- A false appearance of high productivity.

### Solution 1: Visualize work on a board

Use columns representing stages of work.

**Pros**
- Makes status visible.
- Reveals bottlenecks.
- Easy for teams and stakeholders to understand.
- Useful even without formal Kanban adoption.

**Cons**
- A board can show too much work in progress without preventing it.
- Status updates may become manual and unreliable.
- Does not determine priority or quality standards.

**Problem left behind:** Visibility shows congestion, but does not stop the team from creating more congestion.

### Solution 2: Set work-in-progress limits

Limit how many items may be active in each stage.

Example:

| Stage | WIP limit |
|---|---:|
| In Development | 3 |
| Code Review | 2 |
| Testing | 2 |

When testing is full, developers help test, automate tests, or resolve blockers rather than starting another feature.

**Pros**
- Reduces context switching.
- Encourages finishing work before starting more.
- Exposes bottlenecks quickly.
- Improves flow and delivery predictability.

**Cons**
- Can feel inefficient if people interpret an empty development column as idle time.
- Requires cross-functional collaboration.
- Limits need adjustment as team capacity and workflow change.

**Problem left behind:** WIP limits improve flow, but the team also needs policies for priority, urgent work, and consistent definitions of done.

### Solution 3: Use explicit policies, service classes, and flow metrics

Define:
- **Entry criteria:** What makes work ready?
- **Exit criteria:** What makes work done?
- **Classes of service:** Standard, fixed-date, expedited, and intangible improvement work.
- **Flow metrics:** Lead time, cycle time, throughput, and work-item age.

Example policy:

> An item cannot enter development until its acceptance criteria, security impact, and dependency owner are known.  
> An item is done only after review, tests, security checks, deployment readiness, and required documentation are complete.

**Pros**
- Makes decisions consistent and transparent.
- Supports continuous delivery.
- Handles variable incoming work well.
- Identifies systemic bottlenecks using data.

**Cons**
- Needs discipline and regular review.
- Expedited work can undermine the system if overused.
- Flow metrics can be misused as individual performance measures.

### When to choose which

- Use **Solution 1** when beginning to understand a team’s workflow.
- Use **Solution 2** when too much work is being started and too little is being completed.
- Use **Solution 3** for teams with continuous, unpredictable, or operations-heavy work.

---

## 8. Lean

### Simple explanation

**Lean** is a mindset focused on maximizing customer value while reducing waste, delay, rework, and unnecessary complexity.

Common Lean ideas:
- Define value from the customer’s perspective.
- Map the value stream.
- Reduce waste.
- Deliver in small batches.
- Build quality in.
- Improve continuously.

### Example

A team discovers that a minor configuration change takes three weeks to reach production:

- 2 days waiting for product clarification.
- 1 day development.
- 4 days waiting for code review.
- 2 days testing.
- 6 days waiting for a deployment window.

Lean analysis focuses on reducing waiting and handoffs, not merely asking developers to code faster.

### Problem

Organizations often optimize individual departments:
- Development maximizes coding output.
- QA maximizes tests executed.
- Operations minimizes deployment changes.

The overall customer delivery time may still be poor because work waits between teams.

### Solution 1: Optimize local team productivity

Examples:
- Measure developer tickets closed.
- Maximize utilization.
- Keep every specialist busy.

**Pros**
- Simple to measure within a department.
- Can identify a clearly underperforming local activity.

**Cons**
- Increases handoffs and queues.
- High utilization can reduce responsiveness.
- Encourages starting more work instead of completing customer value.
- Can worsen end-to-end delivery time.

**Problem left behind:** Local efficiency does not guarantee system-wide value delivery.

### Solution 2: Map the value stream

Track the journey from request to customer value:
- Discovery.
- Approval.
- Development.
- Review.
- Testing.
- Deployment.
- Verification.

Measure active work time versus waiting time.

**Pros**
- Identifies bottlenecks and unnecessary handoffs.
- Makes invisible queues visible.
- Helps teams improve the full system rather than blame individuals.

**Cons**
- Requires cross-team cooperation.
- Data can be difficult to collect accurately.
- Mapping alone does not fix bottlenecks.

**Problem left behind:** Understanding waste identifies improvement opportunities, but teams still need safe methods to remove it.

### Solution 3: Improve flow with small batches, automation, and built-in quality

Examples:
- Split large features into smaller safe releases.
- Automate tests, builds, security scanning, and deployments.
- Reduce approval delays through risk-based controls.
- Fix recurring defects at the source.
- Use feature flags for controlled exposure.
- Reduce manual, error-prone operational steps.

**Pros**
- Shortens feedback loops.
- Reduces rework and operational risk.
- Improves customer responsiveness.
- Makes quality part of the delivery process.

**Cons**
- Automation requires initial investment.
- Feature flags require lifecycle management and cleanup.
- Removing controls carelessly can create security or compliance risk.

### When to choose which

- Use **Solution 1** only as a narrow diagnostic, never as the sole optimization strategy.
- Use **Solution 2** when delivery feels slow despite busy teams.
- Use **Solution 3** when bottlenecks and waste are understood and the team can improve them safely.

---

## 9. DevOps

### Simple explanation

**DevOps** combines cultural practices, automation, and shared responsibility so software can be built, released, operated, and improved reliably.

It reduces the gap between:
- Teams that create software.
- Teams that run software.
- Teams that support users.
- Teams responsible for security and compliance.

DevOps does **not** mean giving developers unrestricted production access. Secure DevOps uses automation, least privilege, separation of duties where needed, and auditable controls.

### Example

For a booking service:
- Developers build and test code.
- A CI pipeline runs tests, dependency scanning, and static analysis.
- Deployment occurs through reviewed infrastructure-as-code.
- Production monitoring detects elevated booking failures.
- The team investigates, rolls back safely if needed, and prevents recurrence.

### Problem

Traditional handoffs create “works on my machine” failures:
- Developers deliver code to operations.
- Operations discovers missing configuration or unsafe deployment behavior.
- Support discovers user issues after release.
- Security discovers vulnerabilities late.

### Solution 1: Separate development and operations completely

Development writes code; operations deploys and maintains it.

**Pros**
- Clear role boundaries.
- Operations can specialize in reliability.
- May fit organizations with strict regulatory separation.

**Cons**
- Encourages blame and slow handoffs.
- Developers may lack production feedback.
- Operations receives changes without enough context.
- Deployment becomes risky and infrequent.

**Problem left behind:** Specialized roles can improve expertise, but isolated ownership weakens end-to-end accountability.

### Solution 2: Share responsibility through collaboration and manual runbooks

Developers and operations teams collaborate, document deployment steps, and meet before releases.

**Pros**
- Better communication.
- Reduces missing knowledge.
- Improves release preparation.
- A useful transition from siloed teams.

**Cons**
- Manual runbooks drift from reality.
- Repeated meetings do not scale.
- Manual deployments are error-prone.
- Security checks may still be inconsistent.

**Problem left behind:** Collaboration helps, but reliable frequent delivery requires repeatable automation and production feedback.

### Solution 3: Implement secure DevOps practices

Use:
- Version-controlled infrastructure-as-code.
- Automated build, test, and deployment pipelines.
- Environment-specific configuration stored outside source code.
- Secrets managed through a dedicated secrets manager.
- Least-privilege, short-lived credentials.
- Mandatory review and audit trails for infrastructure changes.
- Centralized logging, monitoring, tracing, and alerting.
- Rollback or progressive-delivery strategies.
- Incident response and post-incident learning.

**Pros**
- Faster, more reliable delivery.
- Better production visibility.
- Reduced manual error.
- Security controls can run consistently in every pipeline.
- Improves recovery from failures.

**Cons**
- Requires tooling, skills, and platform investment.
- Poorly secured pipelines become high-value attack targets.
- Automation can spread an error quickly without safeguards.
- Teams must own operational readiness, not merely deployment.

### When to choose which

- Use **Solution 1** only where legal separation is mandatory, while still creating strong collaboration paths.
- Use **Solution 2** as an early transition step.
- Use **Solution 3** for production software that needs reliable, secure, repeatable delivery.

---

# Topic 1.3 Decision Guide

| Situation | Best starting approach |
|---|---|
| Need a basic lifecycle for small, ordinary changes | Risk-based SDLC with clear minimum quality gates |
| Stable, contractual, or heavily regulated scope | Waterfall with early prototypes and controlled change |
| Strong requirement-to-test traceability is necessary | V-Model practices integrated into iterative delivery |
| Requirements need frequent user feedback | Iterative development |
| Cross-functional product team delivers regular value | Agile principles with Scrum or Kanban |
| Planned work benefits from fixed review and improvement cadence | Scrum |
| Incoming work is continuous and unpredictable | Kanban |
| Delivery is slow because of queues, waiting, and handoffs | Lean value-stream analysis |
| Releases are manual, risky, or disconnected from operations | Secure DevOps practices |

## How this leads to Topic 1.4

The SDLC and process model define **how** the team will discover, design, build, test, deploy, and improve software.

The next question is:

> “How do we discover and express the detailed needs, rules, constraints, and outcomes the product must satisfy?”

That leads to **1.4 Requirements Elicitation**.


# 1.4 Requirements Elicitation

**Goal:** Discover, clarify, validate, and document what users, stakeholders, systems, and regulations require before deciding exactly what to build.

**Requirements elicitation** is not merely asking:

> “What features do you want?”

People often describe a preferred solution, omit exceptions they handle automatically, or disagree with other stakeholders. Good elicitation finds the underlying goals, current workflows, business rules, constraints, risks, and acceptance conditions.

---

## 1. Workshops

### Simple explanation

A **requirements workshop** is a facilitated session in which relevant stakeholders discuss a problem, align on goals, uncover rules, resolve conflicts, and make decisions together.

Typical participants may include:
- Product owner or sponsor.
- Actual users.
- Operations or support staff.
- Domain experts.
- Designers and engineers.
- Security, privacy, legal, or compliance representatives.
- Facilitator or business analyst.

### Example

A clinic is introducing online appointment booking. A workshop includes receptionists, clinicians, a clinic manager, a privacy officer, and engineers.

The group identifies rules such as:
- A patient cannot book two appointments at the same time.
- Some appointment types require a referral.
- Clinicians can block unavailable times.
- Appointment reminders require valid communication consent.
- Staff need a way to override availability in emergencies, with an audit record.

### Problem

Without shared discussion, teams often gather requirements from stakeholders separately. This can produce contradictions:

- The manager wants patients to self-book any time.
- Clinicians want approval for every booking.
- Receptionists need manual control over urgent cases.
- Privacy officers prohibit the data collection proposed by product teams.

If these conflicts are found only after implementation begins, the team faces rework, delays, and distrust.

### Solution 1: Hold unstructured meetings

The team gathers stakeholders in a meeting and asks:

> “What should the system do?”

**Pros**
- Fast to arrange.
- Brings people together.
- Can reveal obvious disagreements.

**Cons**
- Vocal participants can dominate.
- Discussion may jump between unrelated topics.
- Decisions may not be recorded.
- Quiet users and specialists may not contribute.
- The meeting can become a feature-request session.

**Problem left behind:** Bringing people together helps, but an unstructured conversation does not reliably produce clear, prioritized, testable requirements.

### Solution 2: Run a facilitated requirements workshop

Prepare the workshop with:
- A clear problem statement.
- Defined objectives and agenda.
- Relevant participants.
- Existing evidence: research findings, support tickets, workflow examples, metrics.
- Structured exercises such as process mapping, story mapping, risk identification, or prioritization.

During the session:
1. Explain the problem and desired outcome.
2. Map the current process.
3. Identify pain points, rules, exceptions, and dependencies.
4. Generate possible requirements.
5. Resolve or record disagreements.
6. Prioritize the most valuable needs.
7. Capture decisions, owners, assumptions, and open questions.

**Pros**
- Builds shared understanding quickly.
- Exposes conflicts and hidden business rules.
- Creates stakeholder ownership.
- Reduces back-and-forth communication later.

**Cons**
- Needs skilled facilitation.
- Scheduling appropriate participants can be difficult.
- A workshop can still reflect internal opinions rather than actual user behavior.
- Important decisions may require follow-up outside the session.

**Problem left behind:** Workshops align participants, but meeting discussions alone may not show how work actually happens in real conditions.

### Solution 3: Combine workshops with evidence and follow-up validation

Use workshops to synthesize evidence from:
- User interviews.
- Workflow observation.
- Analytics.
- Existing requirements.
- Security or privacy assessments.
- Production incidents and support requests.

Afterward:
- Publish decisions and unresolved questions.
- Validate major assumptions with actual users.
- Turn agreed needs into user stories, rules, models, or prototypes.
- Review the resulting requirements with participants.

**Pros**
- Combines collaboration with real evidence.
- Reduces decisions based solely on hierarchy or opinion.
- Produces a traceable path from discovery to requirements.
- Supports iterative refinement.

**Cons**
- Requires preparation and post-workshop follow-up.
- Can take longer than a single meeting.
- Teams must actively manage unresolved disagreements.

### When to choose which

- Use **Solution 1** only for a short, low-risk alignment discussion.
- Use **Solution 2** when multiple stakeholders need to agree on a workflow, scope, or business rules.
- Use **Solution 3** for complex, cross-functional, regulated, or user-facing products.

---

## 2. Surveys

### Simple explanation

A **survey** collects structured feedback from many people. It is useful for measuring frequency, preferences, satisfaction, or the relative importance of known problems.

Surveys are strongest when the team already has hypotheses to test.

### Example

After interviews reveal that patients struggle with appointment booking, a clinic sends a survey asking:

- How often do you book appointments online?
- Which part of booking is most difficult?
- Have you ever abandoned a booking attempt?
- What was the reason?
- Which reminder channel do you prefer: email, SMS, phone, or none?
- Do you use assistive technology when accessing online services?

### Problem

Interviews provide deep insight, but small samples cannot reliably show how common a problem is across a large audience.

For example, five interview participants may report that booking confirmation is unclear. The team still needs to know:
- Is this common?
- Which user groups are affected?
- Is it more important than other problems?
- Would solving it influence adoption or retention?

### Solution 1: Ask broad, open-ended survey questions

Examples:
- “What features do you want?”
- “How can we improve the product?”
- “What do you think of online booking?”

**Pros**
- Easy to create.
- Can collect unexpected ideas.
- Allows participants to express concerns in their own words.

**Cons**
- Difficult and time-consuming to analyze at scale.
- Responses may be vague.
- Participants often suggest solutions rather than explain problems.
- Low response rates can make results unrepresentative.

**Problem left behind:** Open answers provide ideas, but they are difficult to compare, prioritize, and quantify.

### Solution 2: Use structured questions tied to known hypotheses

Use carefully designed question types:
- Multiple choice.
- Rating scales.
- Ranking questions.
- Frequency questions.
- Optional open-text follow-up.

Example:

> How often do you abandon an online appointment booking before completion?  
> - Never  
> - Rarely  
> - Sometimes  
> - Often  
> - Always

Follow-up:

> What was the primary reason for abandoning the booking?

**Pros**
- Easier to analyze.
- Helps compare user groups.
- Measures frequency and relative importance.
- Works well for validating research hypotheses.

**Cons**
- Question wording can bias results.
- Closed options may omit important answers.
- Respondents may misunderstand questions.
- Survey results still describe self-reported behavior.

**Problem left behind:** Structured surveys quantify opinions and reported experiences, but they do not reliably reveal why people behave as they do.

### Solution 3: Combine surveys with interviews, analytics, and segmentation

Use surveys to quantify findings, then investigate significant patterns.

Example:
1. Survey shows that 32% of users abandon booking.
2. The largest affected group uses mobile devices.
3. Analytics confirm high abandonment on the address form.
4. Usability testing reveals that the keyboard obscures the error message on smaller screens.

Segment results only where necessary and lawful, such as by:
- User role.
- Device type.
- Region.
- Accessibility need, when voluntarily provided and handled appropriately.

Protect survey data:
- Collect only data needed for the research goal.
- Avoid asking for sensitive personal data unless necessary.
- Obtain clear consent where required.
- Restrict access and define retention periods.
- Report aggregated results where possible.

**Pros**
- Combines broad measurement with detailed understanding.
- Reduces the risk of acting on misleading survey results.
- Supports evidence-based prioritization.

**Cons**
- Requires more planning and analysis.
- Combining data sources can raise privacy and governance concerns.
- Small or biased samples still limit confidence.

### When to choose which

- Use **Solution 1** for early idea collection or optional feedback fields.
- Use **Solution 2** when validating known questions across a larger audience.
- Use **Solution 3** when survey results will influence important product, business, or design decisions.

---

## 3. Observation

### Simple explanation

**Observation** means watching users perform real tasks in their normal environment. It may include contextual inquiry, shadowing, task analysis, or reviewing recorded workflow steps with the user.

Observation helps uncover what people actually do—not only what they say they do.

### Example

A team observes receptionists rescheduling appointments. They discover the receptionist must:
1. Check clinician availability.
2. Check room availability.
3. Check whether the patient needs a specific appointment type.
4. Review waiting-list notes.
5. Confirm consent preferences.
6. Notify the clinician.
7. Record an explanation if an override is used.

The receptionist never mentioned several of these steps in an interview because they had become routine.

### Problem

Users are often unable to explain every part of their work. They may:
- Forget rare but important exceptions.
- Omit unofficial workarounds.
- Describe the intended process rather than the actual one.
- Underestimate interruptions, delays, and context switching.

### Solution 1: Ask users to describe their workflow

Example:

> “How do you reschedule an appointment?”

**Pros**
- Low cost.
- Easy to arrange remotely.
- Useful for a first understanding of the process.
- Less intrusive than observation.

**Cons**
- Relies on memory.
- Often misses exceptions and small repeated actions.
- Does not reveal physical environment, interruptions, or tool switching.
- Can produce an idealized description.

**Problem left behind:** Descriptions provide a starting point, but they may differ significantly from actual behavior.

### Solution 2: Observe users completing real tasks

Ask the participant to work normally while explaining relevant decisions.

Capture:
- Task steps.
- Inputs and outputs.
- Tools, systems, and documents used.
- Handoffs.
- Delays and interruptions.
- Error recovery.
- Workarounds.
- Security-sensitive actions.
- Accessibility barriers.

**Pros**
- Reveals hidden work.
- Identifies real sources of delay and error.
- Shows the practical environment, not just the documented process.
- Helps discover integration and usability requirements.

**Cons**
- Requires consent and careful privacy handling.
- Users may change behavior when observed.
- Observation takes time and may disrupt work.
- Some tasks cannot be observed due to confidentiality, safety, or legal restrictions.

**Problem left behind:** Observation produces rich evidence, but it may be difficult to generalize from a small number of participants or unusual situations.

### Solution 3: Use repeated observation with workflow modeling and validation

Observe multiple representative users and convert findings into:
- Process maps.
- Service blueprints.
- Journey maps.
- Use cases.
- Exception lists.
- Business rules.
- Candidate user stories.

Then review the model with participants:

> “We observed that rescheduling requires checking clinician, room, and referral constraints. Is this always true? What exceptions are missing?”

Security and privacy safeguards:
- Obtain explicit permission before observing or recording.
- Do not capture credentials, secrets, or unnecessary personal information.
- Use anonymized examples in notes.
- Store recordings securely with restricted access.
- Delete raw recordings when the approved retention period ends.

**Pros**
- Separates one-off behavior from recurring workflow patterns.
- Converts observations into requirements that can be reviewed and tested.
- Builds confidence through participant validation.

**Cons**
- Requires analysis skill.
- Process models can become outdated.
- The team must distinguish essential rules from local habits that should not be automated.

### When to choose which

- Use **Solution 1** for early discovery or when observation is impossible.
- Use **Solution 2** when workflows are complex, manual, high-volume, or error-prone.
- Use **Solution 3** when requirements affect multiple roles, systems, or compliance obligations.

---

## 4. Prototyping

### Simple explanation

A **prototype** is a simplified representation of a product or feature used to learn before building the full solution.

Prototype fidelity can vary:

| Type | Description | Example |
|---|---|---|
| Low fidelity | Sketches or wireframes | Paper sketch of a booking form |
| Medium fidelity | Clickable UI flow | Figma prototype of booking and cancellation |
| High fidelity | Functional proof of concept | Working booking flow connected to test data |
| Technical prototype | Tests technical feasibility | Integration with a calendar provider using synthetic data |

### Example

Before implementing appointment booking, a team creates a clickable prototype showing:
- Selecting an appointment type.
- Choosing an available slot.
- Entering contact details.
- Confirming communication preferences.
- Viewing booking confirmation.

Users repeatedly fail to understand the difference between “initial consultation” and “follow-up appointment.” The team changes the language before building backend services.

### Problem

Written requirements can be interpreted differently by users, product teams, designers, and engineers.

A sentence like:

> “The patient should be able to select an appointment.”

leaves many questions:
- Which appointments are available?
- What information appears before selection?
- How are unavailable slots displayed?
- What happens if availability changes during booking?
- How does a screen-reader user navigate the flow?
- What happens on mobile?
- What data is required and why?

### Solution 1: Use written descriptions only

Document the workflow in prose.

**Pros**
- Quick to produce.
- Easy to version and review.
- Useful for rules, assumptions, and acceptance criteria.
- Necessary for many non-visual requirements.

**Cons**
- Visual and interaction details remain ambiguous.
- Stakeholders may assume different interpretations.
- Users may struggle to give useful feedback about something abstract.
- Edge cases are easily missed.

**Problem left behind:** Text explains intent, but it does not let users experience the interaction or reveal usability problems early.

### Solution 2: Create low- or medium-fidelity prototypes

Use sketches, wireframes, diagrams, or clickable mockups to test:
- Navigation.
- Content hierarchy.
- Terminology.
- Task sequence.
- Error messages.
- Mobile layouts.
- Basic accessibility assumptions.

**Pros**
- Fast and inexpensive compared with production implementation.
- Encourages feedback because it looks changeable.
- Reveals usability misunderstandings early.
- Helps create shared understanding across disciplines.

**Cons**
- Usually cannot prove performance, security, or integration feasibility.
- Stakeholders may focus on colors and layout rather than workflow.
- A polished prototype can create unrealistic expectations.
- Prototype interactions may hide implementation complexity.

**Problem left behind:** A clickable design validates usability direction, but it cannot prove that critical technical or operational requirements can be satisfied.

### Solution 3: Use targeted high-fidelity or technical prototypes

Build only enough working functionality to test a high-risk assumption.

Examples:
- Test whether a booking service can prevent concurrent double bookings.
- Verify that a third-party calendar API meets latency and reliability needs.
- Test keyboard navigation and screen-reader announcements in a functional UI.
- Measure whether an availability search completes within the required performance target.

Use safe prototype practices:
- Use synthetic, anonymized, or non-production data.
- Never embed production secrets in prototype code.
- Restrict access to internal test environments.
- Apply authentication and least privilege when real integrations are unavoidable.
- Do not deploy experimental endpoints publicly without appropriate controls.
- Clearly label the prototype as non-production.

**Pros**
- Validates technical feasibility and risk.
- Finds performance, integration, and accessibility problems earlier.
- Reduces the chance of expensive architecture rework.

**Cons**
- Costs more than a wireframe.
- Can accidentally become production code without sufficient quality controls.
- A proof of concept proves possibility, not long-term maintainability.

### When to choose which

- Use **Solution 1** for simple rules and as supporting documentation.
- Use **Solution 2** for most new user journeys and usability questions.
- Use **Solution 3** when an uncertain technical, security, accessibility, integration, or performance requirement could block the product.

---

## 5. User Stories

### Simple explanation

A **user story** is a short statement of a user need. It helps teams discuss value from the user’s perspective.

Common format:

> As a **[user role]**,  
> I want **[capability]**,  
> so that **[benefit or outcome]**.

Example:

> As a receptionist, I want to see all eligible waiting-list patients when an appointment is cancelled, so that I can fill the slot quickly.

A user story is not a complete requirement by itself. It needs conversation, acceptance criteria, and relevant rules or constraints.

### Problem

Teams frequently write implementation-focused tasks such as:
- Add `appointments` database table.
- Build REST endpoint for reminders.
- Create a React calendar component.
- Add notification queue.

These tasks may be necessary, but they do not explain who benefits, why it matters, or how success will be verified.

### Solution 1: Write technical tasks only

Technical tasks organize engineering work.

**Pros**
- Specific for developers.
- Useful for implementation planning.
- Can expose architecture and dependency work.

**Cons**
- Does not communicate user value.
- Can lead to building components no user actually needs.
- Makes prioritization difficult for product stakeholders.
- Does not define acceptance conditions.

**Problem left behind:** Engineering tasks describe how work may be done, but not the user problem or expected outcome.

### Solution 2: Write basic user stories

Example:

> As a patient, I want to cancel my appointment online, so that I do not need to call the clinic.

**Pros**
- Centers the user and intended benefit.
- Encourages discussion before implementation.
- Helps product stakeholders prioritize by value.
- Supports incremental delivery.

**Cons**
- Stories can be vague or too large.
- They may omit business rules, security constraints, and edge cases.
- “As a user” is often too broad to guide design.
- A story can disguise a solution rather than state a need.

**Problem left behind:** A simple story explains intent, but not enough detail to build and test a secure, correct implementation.

### Solution 3: Use user stories with the “Three Cs”

A user story should include:

1. **Card** — a concise reminder of the need.
2. **Conversation** — discussion between product, engineering, design, users, and specialists.
3. **Confirmation** — acceptance criteria that prove the story is complete.

Example story:

> As a patient, I want to cancel an upcoming appointment online, so that I can free the time without calling the clinic.

Possible acceptance criteria:

```gherkin name=appointment-cancellation.feature
Feature: Online appointment cancellation

  Scenario: Patient cancels an eligible appointment
    Given an authenticated patient has an appointment more than 24 hours away
    When the patient confirms cancellation
    Then the appointment is marked as cancelled
    And the appointment slot becomes available according to clinic policy
    And the patient receives a confirmation without exposing sensitive information

  Scenario: Patient cannot cancel after the deadline
    Given an authenticated patient has an appointment within 24 hours
    When the patient attempts to cancel it
    Then the system explains that online cancellation is unavailable
    And the system provides an approved contact method for assistance

  Scenario: Unauthorized access is rejected
    Given a user is not authorized to manage an appointment
    When the user requests cancellation
    Then the system denies the request without revealing appointment details
    And the attempt is logged according to the security policy
```

Include relevant non-functional expectations:
- Authorization must be checked server-side.
- Input must be validated.
- Error responses must not disclose another patient’s data.
- The flow must be operable using keyboard navigation.
- Audit logging must follow retention and privacy policies.
- Cancellation must handle concurrent updates safely.

**Pros**
- Connects user value, discussion, and verification.
- Makes hidden rules and edge cases visible.
- Supports development, testing, and traceability.
- Encourages secure and accessible requirements from the beginning.

**Cons**
- Requires refinement time.
- Too many acceptance criteria can turn a story into an unreadable specification.
- Not every requirement fits naturally into a user-story format; integrations, infrastructure, and compliance needs may require additional documentation.

### When to choose which

- Use **Solution 1** for technical implementation tasks that support a known requirement.
- Use **Solution 2** for early backlog discovery and product discussion.
- Use **Solution 3** for work that is ready for delivery and needs clear, testable, secure completion criteria.

---

# Topic 1.4 Decision Guide

| If you need to… | Start with… |
|---|---|
| Align multiple stakeholders and resolve conflicting needs | Facilitated workshop |
| Measure how widespread a known problem or preference is | Structured survey |
| Discover hidden steps, workarounds, and real-world context | Observation |
| Validate a workflow or interaction before full implementation | Low- or medium-fidelity prototype |
| Test a risky integration, performance target, or technical assumption | Targeted technical prototype |
| Express user value in a delivery backlog | User story |
| Define how a story must behave before it is complete | Acceptance criteria with examples such as Given/When/Then |

## How this leads to Topic 1.5

Requirements elicitation gives the team raw material: needs, workflows, rules, ideas, risks, constraints, and desired outcomes.

The next question is:

> “How do we classify these findings so that we distinguish product behavior from quality expectations, constraints, assumptions, and obligations?”

That leads to **1.5 Requirements Types**.

---
---
# 1.5 Requirements Types

**Goal:** Classify requirements correctly so teams build the right behavior, achieve required quality, respect constraints, and test assumptions before they become failures.

A requirement is not always a feature. A complete requirements set usually contains:

1. **Functional requirements** — what the system must do.
2. **Non-functional requirements** — how well it must do it.
3. **Constraints** — limits on the solution.
4. **Assumptions** — conditions believed to be true but needing validation.

---

## 1. Functional Requirements

### Simple explanation

A **functional requirement** describes a capability, behavior, rule, or interaction the system must provide.

It answers:

> “What must the system do?”

Examples:
- A patient can book an available appointment.
- A receptionist can reschedule an appointment.
- The system prevents overlapping appointments for the same clinician.
- An administrator can configure clinic opening hours.
- The system sends a cancellation confirmation.

### Example

> The system shall allow an authenticated patient to cancel their own eligible appointment and make the slot available according to clinic policy.

This includes:
- A user role: authenticated patient.
- A capability: cancel an appointment.
- A rule: only their own appointment.
- A condition: eligibility depends on clinic policy.
- An outcome: the slot becomes available.

### Problem

Without functional requirements, teams may build based on incomplete conversations or technical assumptions.

For example, a stakeholder says:

> “Patients need to cancel appointments online.”

Developers might build a cancel button, but critical questions remain:
- Can a patient cancel any appointment?
- Is there a cancellation deadline?
- Does cancellation immediately free the slot?
- Can staff reverse a cancellation?
- What happens if a clinician has already started the appointment?
- What happens if two people act at the same time?

### Solution 1: Describe features at a high level

Example:

> Provide online appointment cancellation.

**Pros**
- Quick to write.
- Useful for roadmap discussions.
- Easy for non-technical stakeholders to understand.

**Cons**
- Too ambiguous for implementation and testing.
- Does not define roles, conditions, rules, failure behavior, or outcomes.
- Different team members may interpret it differently.

**Problem left behind:** The team knows the broad feature area, but not the exact behavior required.

### Solution 2: Write specific functional requirements

Example:

> The system shall allow an authenticated patient to cancel an appointment they own if the appointment begins more than 24 hours in the future.

Add related rules:

> The system shall reject cancellation attempts made by users who do not own the appointment.

> The system shall record the cancellation timestamp, initiating actor, and applicable reason code.

**Pros**
- Reduces implementation ambiguity.
- Defines expected system behavior.
- Supports traceability and test creation.
- Clarifies authorization and business-rule expectations.

**Cons**
- Can become long and difficult to read if every exception is placed in one statement.
- Requirements may overlap or conflict if not organized.
- Still may not describe the user journey clearly.

**Problem left behind:** Individual statements can be precise, but the team needs examples to verify that all expected and exceptional behaviors are understood.

### Solution 3: Combine functional requirements with stories, rules, and acceptance scenarios

Use:
- **User stories** for user value.
- **Business rules** for policy.
- **Functional requirements** for required behavior.
- **Given/When/Then scenarios** for verification.

Example:

> **User story:** As a patient, I want to cancel an eligible appointment online, so that I can free the slot without calling the clinic.

> **Business rule:** Online cancellation is not permitted less than 24 hours before the appointment unless an administrator has configured a different policy.

```gherkin name=appointment-cancellation.feature
Feature: Patient appointment cancellation

  Scenario: Eligible appointment is cancelled
    Given an authenticated patient owns an appointment scheduled more than 24 hours from now
    When the patient confirms cancellation
    Then the system marks the appointment as cancelled
    And the system records the patient as the cancellation actor
    And the system confirms the outcome to the patient

  Scenario: Cancellation is blocked after the deadline
    Given an authenticated patient owns an appointment scheduled within 24 hours
    When the patient attempts to cancel the appointment
    Then the system rejects the cancellation
    And the system provides an approved method to contact the clinic

  Scenario: Another patient's appointment cannot be cancelled
    Given an authenticated patient does not own an appointment
    When the patient attempts to cancel that appointment
    Then the system denies the request
    And the response does not reveal sensitive appointment details
```

**Pros**
- Connects user value to precise system behavior.
- Makes normal, exceptional, and security-sensitive paths testable.
- Reduces ambiguity between product, design, engineering, and QA.
- Supports automated acceptance tests.

**Cons**
- Requires refinement and collaboration.
- Detailed scenarios need maintenance as policies change.
- Not every technical capability needs a user story; some need architecture or operational requirements.

### When to choose which

- Use **Solution 1** for early product planning.
- Use **Solution 2** for clear, stable behavior and business rules.
- Use **Solution 3** when work is ready for implementation, testing, or acceptance review.

---

## 2. Non-Functional Requirements (NFRs)

### Simple explanation

A **non-functional requirement** defines a quality attribute or operational condition of the system.

It answers:

> “How well must the system perform its functions?”

Common NFR categories include:
- Performance.
- Security.
- Accessibility.
- Internationalization.
- Scalability.
- Reliability and availability.
- Maintainability.
- Observability.
- Compatibility.
- Privacy.

Functional requirement:

> A patient can book an appointment.

Non-functional requirements:

> The booking confirmation must complete within two seconds for 95% of requests under expected load.

> Only authorized users may access appointment information.

> The booking flow must be usable by keyboard-only users.

### Problem

A system can satisfy every visible feature requirement and still fail in reality:

- It takes 20 seconds to load.
- It leaks personal data.
- It is inaccessible to keyboard or screen-reader users.
- It fails during peak booking periods.
- It cannot support additional clinics or languages.
- It is impossible to diagnose after an incident.

### Solution 1: Treat NFRs as general wishes

Examples:
- The system should be fast.
- The app should be secure.
- The site should be accessible.
- The service should scale.

**Pros**
- Easy to state.
- Highlights important quality areas early.
- Suitable as an initial reminder during discovery.

**Cons**
- Not measurable.
- Teams cannot know when the requirement is met.
- Different people interpret “fast” and “secure” differently.
- Quality concerns are likely to be deferred until late in delivery.

**Problem left behind:** The team recognizes quality matters but has no verifiable target or ownership.

### Solution 2: Define measurable NFRs

Examples:

| Quality attribute | Measurable requirement |
|---|---|
| Performance | The booking API shall respond within 500 ms at the 95th percentile under 200 requests per second. |
| Availability | The booking service shall achieve 99.9% monthly availability, excluding scheduled maintenance. |
| Accessibility | The booking journey shall meet WCAG 2.2 AA success criteria applicable to the supported experience. |
| Security | All access to appointment records shall require server-side authorization checks. |
| Reliability | A submitted booking request shall not create duplicate appointments when retried. |
| Observability | Failed booking attempts shall create structured logs and metrics without storing sensitive medical details. |

**Pros**
- Creates testable quality targets.
- Enables architecture and capacity decisions.
- Clarifies trade-offs early.
- Supports service-level objectives and monitoring.

**Cons**
- Requires a baseline, expected load, and realistic context.
- Arbitrary numbers can create unnecessary cost or false confidence.
- Some quality attributes are difficult to fully quantify.

**Problem left behind:** Measurable targets are better, but requirements can still conflict—for example, stronger security controls may add latency, while high availability may increase cost.

### Solution 3: Prioritize NFRs by risk and validate them throughout delivery

For each significant NFR:
1. Define the target.
2. Identify risks and trade-offs.
3. Decide how it will be verified.
4. Include it in design, implementation, testing, deployment, and monitoring.
5. Reassess it as usage changes.

Example:

| NFR | Risk | Validation |
|---|---|---|
| Prevent double booking | Revenue loss and user distrust | Concurrency integration tests |
| 99.9% availability | Clinic operations disrupted | Uptime monitoring and failure testing |
| WCAG 2.2 AA | Exclusion and legal risk | Automated checks plus manual assistive-technology testing |
| Protect appointment data | Privacy breach | Threat model, authorization tests, logs, security review |

**Pros**
- Connects quality requirements to delivery decisions.
- Makes trade-offs explicit.
- Avoids treating security, accessibility, and performance as a final test phase.
- Enables ongoing production verification.

**Cons**
- Requires cross-functional ownership.
- Increases planning and test effort.
- Some targets require monitoring infrastructure and specialist review.

### When to choose which

- Use **Solution 1** only during early exploration.
- Use **Solution 2** for requirements ready for design and delivery.
- Use **Solution 3** for high-impact, customer-facing, regulated, or continuously operated systems.

---

# 3. Performance Requirements

### Simple explanation

**Performance requirements** define how quickly and efficiently the system must respond under specified conditions.

They commonly cover:
- Response time or latency.
- Throughput.
- Batch-processing duration.
- Resource usage.
- Timeouts.
- Peak-load behavior.

### Example

> The appointment-search service shall return available appointment slots within one second at the 95th percentile while serving 500 concurrent users.

This is more useful than:

> The appointment search must be fast.

### Problem

Without performance requirements, teams may optimize only after users complain. By that point, the architecture, database design, and integrations may be expensive to change.

A system may work in development with ten test records but fail with:
- Thousands of clinics.
- Millions of appointment records.
- Morning peak traffic.
- Slow external services.
- Large reports or exports.

### Solution 1: Test whether the feature works for one user

Developers verify that search returns results locally.

**Pros**
- Fast feedback during development.
- Confirms basic functional correctness.
- Requires little test infrastructure.

**Cons**
- Does not model real traffic or data volume.
- Cannot identify concurrency issues.
- Does not show tail latency, bottlenecks, or resource exhaustion.
- May hide poor database-query behavior.

**Problem left behind:** The feature works in a simple environment but may degrade or fail in production conditions.

### Solution 2: Specify response-time and load targets

Define:
- The key user action.
- The acceptable response time.
- The percentile, such as p95 or p99.
- Expected load.
- Data volume.
- Error-rate tolerance.

Example:

> Under a load of 200 booking requests per second and 50,000 active appointment slots, 95% of availability-search requests shall complete within one second, and fewer than 0.1% shall fail due to system error.

**Pros**
- Gives architects and engineers a concrete target.
- Enables realistic load testing.
- Supports capacity planning and operational expectations.
- Encourages performance-aware design.

**Cons**
- Requires reliable assumptions about usage patterns.
- Targets may need revision as the product grows.
- Testing realistic load can require specialized infrastructure.

**Problem left behind:** A target defines success, but the team still needs to ensure performance remains acceptable after each change and during real operations.

### Solution 3: Use performance budgets, automated tests, and production monitoring

Apply:
- **Performance budgets:** Limits for page size, database calls, or endpoint latency.
- **Load and stress tests:** Test normal and peak demand.
- **Soak tests:** Test stability over long periods.
- **Capacity limits:** Protect systems from overload.
- **Timeouts and circuit breakers:** Prevent failing dependencies from cascading.
- **Monitoring:** Track p50, p95, p99 latency, errors, saturation, and queue depth.

Security considerations:
- Rate-limit public endpoints.
- Validate request size and complexity.
- Paginate or cap expensive queries.
- Prevent unbounded exports or searches.
- Avoid exposing detailed infrastructure information in errors.

**Pros**
- Detects regressions early.
- Protects production reliability.
- Provides evidence for scaling decisions.
- Helps diagnose real-world performance incidents.

**Cons**
- Requires investment in test environments and observability.
- Load tests can be misleading if data or traffic patterns are unrealistic.
- More monitoring produces more signals that need ownership.

### When to choose which

- Use **Solution 1** for early implementation feedback only.
- Use **Solution 2** for critical user journeys and systems with defined load expectations.
- Use **Solution 3** for production services, especially where slow response affects revenue, safety, trust, or operations.

---

# 4. Security Requirements

### Simple explanation

**Security requirements** define how the system protects confidentiality, integrity, availability, and accountability.

They include:
- Authentication.
- Authorization.
- Input validation.
- Encryption.
- Secure session handling.
- Audit logging.
- Vulnerability management.
- Secure error handling.
- Data retention and deletion.
- Incident response expectations.

### Example

For appointment data:

> The system shall enforce server-side authorization so a patient can access only their own appointment records.

> The system shall transmit all data over HTTPS using modern TLS.

> Session cookies shall use `HttpOnly`, `Secure`, and `SameSite=Strict` attributes where compatible with the authentication flow.

> Failed authorization attempts shall be logged without recording sensitive data in logs.

### Problem

Without explicit security requirements, security becomes a vague expectation:

> “Make sure it is secure.”

This often leads to gaps such as:
- Users accessing records belonging to other users.
- Secrets stored in source code.
- Unvalidated input enabling injection attacks.
- Sensitive data written to logs.
- Weak session handling.
- No plan for patching vulnerable dependencies.

### Solution 1: Depend on framework defaults and developer judgment

Modern frameworks provide useful protections, such as parameterized database APIs, automatic output encoding, and HTTPS configuration options.

**Pros**
- Low effort.
- Framework defaults prevent some common mistakes.
- Appropriate as a baseline.

**Cons**
- Defaults rarely cover product-specific authorization rules.
- Misconfiguration can disable protections.
- Frameworks do not decide data classification, retention, access rights, or threat priorities.
- Security risks are often found only after implementation.

**Problem left behind:** Secure defaults reduce common vulnerabilities, but they do not define the security behavior the product must guarantee.

### Solution 2: Define specific security requirements

Examples:

| Area | Requirement |
|---|---|
| Authentication | The system shall require multi-factor authentication for administrative accounts. |
| Authorization | Every request for protected data shall verify the actor’s permission server-side. |
| Input handling | The system shall validate all untrusted input against expected type, length, format, and allowed values. |
| Database access | The system shall use parameterized queries or safe ORM APIs for all database operations. |
| Sessions | The system shall issue a new session identifier on login and invalidate sessions on logout or credential reset. |
| Secrets | The system shall retrieve secrets from an approved secrets-management service and shall not store them in source control. |
| Errors | Production error responses shall not expose stack traces, secrets, or internal implementation details. |
| Dependency security | The delivery pipeline shall scan dependencies and block release for defined critical vulnerabilities. |

**Pros**
- Makes security testable and auditable.
- Clarifies minimum protections.
- Helps design secure architecture from the start.
- Reduces reliance on undocumented assumptions.

**Cons**
- A checklist can miss threats specific to the product.
- Requirements can become overly generic if not linked to data and workflows.
- Needs periodic updates as threats and dependencies change.

**Problem left behind:** Specific controls help, but teams still need to understand how attackers could misuse the actual product and its data flows.

### Solution 3: Use threat modeling and risk-based security requirements

For important workflows:
1. Identify assets: personal data, credentials, funds, appointments, audit records.
2. Identify actors: patients, staff, administrators, attackers, integrations.
3. Map data flows and trust boundaries.
4. Identify threats: spoofing, tampering, data disclosure, denial of service, privilege escalation.
5. Define mitigations and verification methods.
6. Review after significant architectural or workflow changes.

Example threat:

| Threat | Mitigation |
|---|---|
| A user alters an appointment identifier in a request to access another patient’s record | Server-side object-level authorization on every request; authorization tests for horizontal privilege escalation |
| Automated traffic overloads availability search | Rate limiting, request-size limits, caching, queue controls, monitoring |
| Sensitive appointment details appear in diagnostic logs | Structured logging with data minimization, log-access controls, and redaction tests |

**Pros**
- Connects controls to realistic risks.
- Helps prioritize high-impact protections.
- Reveals threats generic checklists may miss.
- Improves communication among engineering, security, and product teams.

**Cons**
- Requires security knowledge and stakeholder time.
- Must be updated as the system changes.
- It reduces risk; it does not guarantee that no vulnerability exists.

### When to choose which

- Use **Solution 1** as a minimum baseline, never as the complete security strategy.
- Use **Solution 2** for all systems handling accounts, external input, or non-public data.
- Use **Solution 3** for sensitive data, financial workflows, administrative actions, integrations, or public internet-facing systems.

---

# 5. Accessibility Requirements

### Simple explanation

**Accessibility requirements** ensure people with disabilities can use the product effectively.

Accessibility includes support for people who:
- Use screen readers.
- Navigate by keyboard.
- Have low vision or color-vision differences.
- Need zoom or text resizing.
- Have hearing, motor, cognitive, or temporary impairments.
- Use small screens, slow networks, or assistive technologies.

Accessibility is not only a legal or compliance matter. It improves usability for everyone.

### Example

For online booking:

> Users shall be able to complete appointment booking using a keyboard alone.

> Form fields shall have programmatic labels, clear validation messages, and error summaries that can be announced by screen readers.

> Information shall not be communicated by color alone.

### Problem

Without accessibility requirements, teams often test only with a mouse, a large screen, and default visual settings.

This can exclude users when:
- A modal traps keyboard focus.
- Error text is not associated with the relevant input.
- A date picker cannot be navigated with a screen reader.
- Low-contrast text is unreadable.
- Timeouts prevent users from completing a form.

### Solution 1: Perform a visual review near release

A reviewer checks colors, font sizes, and obvious layout problems.

**Pros**
- Fast.
- Can catch basic contrast or layout issues.
- Better than no accessibility review.

**Cons**
- Does not test interaction, semantics, or assistive technology compatibility.
- Happens too late to influence foundational design.
- Can create false confidence from a visually polished interface.

**Problem left behind:** Visual appearance matters, but accessibility also depends on behavior, structure, and user interaction.

### Solution 2: Define standards-based accessibility requirements

Use an appropriate standard, commonly **WCAG 2.2 AA**, adapted to the product’s legal and organizational context.

Examples:
- All functionality must be operable using a keyboard.
- Focus must be visible and logically ordered.
- Images that convey meaning require suitable text alternatives.
- Form errors must be identified and explained in text.
- Content must support browser zoom and responsive layouts.
- Color alone must not communicate status or errors.
- Time limits must be adjustable, extendable, or justified.

**Pros**
- Provides a recognized and testable baseline.
- Helps teams discuss accessibility precisely.
- Supports design-system consistency.
- Reduces legal and reputational risk.

**Cons**
- Conformance criteria can be interpreted too mechanically.
- Automated tools cover only part of accessibility.
- Meeting a standard does not guarantee that the workflow is easy to use for all people.

**Problem left behind:** Standards establish a baseline, but real usability with assistive technologies requires direct testing.

### Solution 3: Build accessibility into design, implementation, and user validation

Use:
- Semantic HTML before custom ARIA.
- Native controls where possible.
- Accessible component libraries that are still independently tested.
- Keyboard testing.
- Screen-reader testing.
- Automated accessibility checks in CI.
- Manual reviews of critical workflows.
- Testing with disabled users when possible and appropriate.

Example acceptance criteria:

```gherkin name=appointment-booking-accessibility.feature
Feature: Accessible appointment booking

  Scenario: Complete booking with keyboard navigation
    Given a user is on the appointment booking page
    When the user navigates using only the keyboard
    Then every interactive control is reachable in a logical order
    And the focused control is visibly identifiable
    And the user can complete the booking without requiring a pointer device

  Scenario: Accessible form validation
    Given a user submits the booking form with missing required information
    When validation fails
    Then each error is described in text
    And each error is programmatically associated with its field
    And the error summary is available to assistive technology
```

**Pros**
- Finds real barriers rather than only rule violations.
- Prevents expensive late remediation.
- Improves overall product usability and resilience.
- Makes accessibility a shared responsibility.

**Cons**
- Requires specialist knowledge and test time.
- Assistive technology combinations vary by browser and platform.
- Existing inaccessible architecture can be costly to remediate.

### When to choose which

- Use **Solution 1** only as a quick supplementary check.
- Use **Solution 2** as the minimum standard for most user-facing products.
- Use **Solution 3** for all critical user journeys and any product expected to serve a broad public audience.

---

# 6. Internationalization (i18n) Requirements

### Simple explanation

**Internationalization**, commonly written as **i18n**, is designing software so it can support different languages, regions, writing systems, formats, and cultural expectations without major redesign.

**Localization (l10n)** is adapting the product for a specific locale, such as translating text and using local date, time, number, currency, and address formats.

### Example

A booking platform operates in the United States, Germany, and Japan. It must support:
- Different languages.
- Different date formats.
- Time zones and daylight-saving transitions.
- Local phone-number formats.
- Longer translated text.
- Regional privacy notices and communication consent rules.

### Problem

Without i18n requirements, teams often hardcode:
- English strings in UI code.
- `MM/DD/YYYY` dates.
- Dollar currency formatting.
- Left-to-right layouts.
- Assumptions that names and addresses follow one country’s format.

These decisions become expensive to change after the product is widely built.

### Solution 1: Translate visible text at the end

The team sends interface strings for translation shortly before release.

**Pros**
- Fast for a single-language prototype.
- Can work for a small amount of isolated static content.

**Cons**
- Text may be embedded in code, images, or concatenated sentences.
- Translations can be longer and break layouts.
- Dates, time zones, currencies, and pluralization are still incorrect.
- Translators lack context.
- It does not address regional business, legal, or accessibility needs.

**Problem left behind:** Translation changes words, but it does not make the product locale-aware.

### Solution 2: Build i18n-ready architecture

Define requirements such as:
- UI text must use resource files or a localization service.
- Dates, times, numbers, and currency must be formatted using the user’s locale.
- Dates and times must be stored in an unambiguous standard form, typically UTC for instants, with appropriate local-time handling for schedules.
- The layout must tolerate translated text expansion.
- The application must support Unicode.
- Language must not be inferred from location alone.
- Content direction must support right-to-left locales if required.

Example:

> The system shall display appointment times in the clinic’s configured time zone and shall clearly identify the time zone when patients can book from other regions.

**Pros**
- Makes later localization much cheaper.
- Supports users accurately across regions.
- Reduces date, time, currency, and text-encoding defects.
- Improves maintainability.

**Cons**
- Requires early architectural decisions.
- Adds development and testing effort.
- Some localization platforms and translation workflows introduce cost.

**Problem left behind:** Locale-aware architecture enables translation, but teams still need to validate whether localized content and workflows make sense for real users.

### Solution 3: Validate localized product experiences per market

For each supported market, validate:
- Translation quality and terminology.
- Date, time, time-zone, and calendar behavior.
- Address and telephone formats.
- Regional legal notices and consent requirements.
- Payment or communication preferences.
- Visual layout and reading direction.
- Local accessibility expectations.
- Support and operational processes.

Security and privacy considerations:
- Do not send sensitive data to translation services without contractual, legal, and technical approval.
- Use access-controlled translation workflows.
- Keep locale-specific privacy notices and consent records versioned.
- Treat time-zone logic as a correctness and security concern when deadlines or access windows depend on time.

**Pros**
- Prevents culturally or legally inappropriate releases.
- Finds region-specific workflow failures.
- Improves trust and adoption.
- Makes localization an operational capability, not a one-time text exercise.

**Cons**
- Requires local expertise and ongoing maintenance.
- Increases test combinations.
- Market-specific requirements can complicate the product.

### When to choose which

- Use **Solution 1** only for a disposable, single-language prototype.
- Use **Solution 2** before building a product likely to support more than one locale.
- Use **Solution 3** before launching in new countries, regulated regions, or markets with significantly different workflows.

---

# 7. Scalability Requirements

### Simple explanation

**Scalability requirements** define how the system must continue to work as demand grows.

Growth may involve:
- More users.
- More organizations or tenants.
- More data.
- More requests.
- More integrations.
- More geographic regions.
- More background jobs.

Scalability is not automatically required for every product. It should be driven by expected growth and the cost of failure.

### Example

> The platform shall support 10,000 clinics and 1 million appointments per day without increasing the availability-search p95 response time above one second.

### Problem

A system may work well for a pilot customer but fail when usage grows:
- Database queries become slow.
- Background jobs accumulate.
- A shared resource becomes a bottleneck.
- One tenant affects another tenant’s performance.
- Manual operational processes cannot keep up.

### Solution 1: Build only for the current small scale

For a pilot, the team uses a simple single-service architecture and one database.

**Pros**
- Fastest way to validate product value.
- Lower cost and operational complexity.
- Easier to understand and maintain.
- Avoids premature distributed-system complexity.

**Cons**
- May not handle growth.
- Scaling limits can be discovered under pressure.
- Architecture decisions may make later changes harder.

**Problem left behind:** Simplicity is valuable, but the team needs to know when current limits will become unacceptable.

### Solution 2: Define expected scale and capacity targets

Document:
- Expected users and tenants.
- Request rates and concurrency.
- Data growth.
- Peak patterns.
- Required isolation between customers.
- Recovery and processing windows.

Example:

| Area | Requirement |
|---|---|
| Active users | Support 100,000 monthly active users |
| Traffic | Support 300 booking requests per second during peak periods |
| Data | Retain seven years of appointment history where legally required |
| Tenant isolation | One clinic’s high-volume exports must not degrade other clinics’ booking workflows |
| Background work | Notification queues must process 99% of jobs within five minutes |

**Pros**
- Supports capacity planning.
- Helps identify bottlenecks early.
- Allows teams to test relevant limits.
- Prevents vague claims such as “must scale.”

**Cons**
- Forecasts may be uncertain.
- Capacity targets require periodic revision.
- Teams may over-engineer if they optimize for unlikely scale.

**Problem left behind:** Capacity targets clarify expected demand, but the architecture and operational practices must still be designed and verified to meet them.

### Solution 3: Scale incrementally with measurement and safe architecture

Apply practical scaling patterns only when evidence supports them:
- Efficient database indexing and query design.
- Caching with clear invalidation rules.
- Background queues for non-interactive work.
- Rate limits and quotas.
- Pagination and bounded queries.
- Horizontal scaling for stateless services.
- Tenant-aware resource controls.
- Load testing and capacity monitoring.
- Data archival and retention processes.

Security considerations:
- Enforce tenant isolation in every query and authorization decision.
- Rate-limit expensive public operations to reduce abuse and denial-of-service risk.
- Use quotas so one customer cannot exhaust shared resources.
- Protect administrative scaling controls with least privilege and audit logging.

**Pros**
- Balances simplicity with preparedness.
- Limits cost until growth demands more capacity.
- Uses production data to guide scaling decisions.
- Protects reliability across tenants.

**Cons**
- Requires ongoing monitoring and operational maturity.
- Scaling distributed systems adds failure modes.
- Caching, queues, and asynchronous workflows introduce consistency and debugging complexity.

### When to choose which

- Use **Solution 1** for low-risk pilots with an explicit plan to measure growth.
- Use **Solution 2** when planning production capacity or committing to customer contracts.
- Use **Solution 3** when growth, multi-tenancy, or peak demand creates real reliability and performance risk.

---

## 8. Constraints

### Simple explanation

A **constraint** is a limit that restricts the solution space. It is not a desired feature; it is a boundary the team must respect.

Constraints may be:
- Technical.
- Legal or regulatory.
- Budgetary.
- Schedule-related.
- Platform-related.
- Integration-related.
- Organizational.
- Contractual.

### Example

- The solution must integrate with an existing electronic health-record system.
- The system must be hosted in an approved region.
- The product must support the organization’s approved identity provider.
- The first release must be available before a regulatory deadline.
- The service must run in the existing cloud environment.

### Problem

Without identifying constraints, teams may design a solution that is ideal in theory but impossible to deploy, fund, integrate, approve, or operate.

For example:
- A team selects a cloud service unavailable in the required data-residency region.
- A design relies on a third-party API that the organization cannot legally use.
- The system requires a browser version unsupported by a key customer.
- The implementation exceeds the available budget or deadline.

### Solution 1: Discover constraints during implementation

The team starts with the preferred technical solution and discovers restrictions later.

**Pros**
- Feels fast initially.
- May be acceptable for a throwaway prototype.
- Allows early experimentation.

**Cons**
- Causes expensive rework.
- Can create security and compliance violations.
- Creates conflict between engineering, legal, operations, and procurement.
- Risks missed deadlines.

**Problem left behind:** Fast initial progress can be lost when hidden boundaries invalidate the solution.

### Solution 2: Document known constraints before solution design

Examples:

| Constraint type | Example |
|---|---|
| Regulatory | Personal data must remain in approved geographic regions. |
| Technical | The system must integrate with the organization’s OpenID Connect identity provider. |
| Budget | First-year operating cost must not exceed the approved limit. |
| Schedule | A minimum viable workflow must be available before the contract renewal date. |
| Platform | The public experience must support the latest two major browser versions. |

**Pros**
- Prevents infeasible solution proposals.
- Makes trade-offs visible.
- Helps architects and vendors evaluate options.
- Reduces late surprises.

**Cons**
- Constraints can be incorrectly treated as permanent facts.
- Stakeholders may add unnecessary preferences as “constraints.”
- An incomplete list can still miss blockers.

**Problem left behind:** Known constraints guide design, but teams need to distinguish true immovable limits from negotiable preferences.

### Solution 3: Classify constraints and challenge negotiable ones

For each constraint, record:
- Source and owner.
- Why it exists.
- Whether it is legal, contractual, technical, financial, or preference-based.
- Whether it is fixed, time-bound, or negotiable.
- The impact if it changes.
- How it will be validated.

Example:

| Constraint | Type | Fixed? | Validation |
|---|---|---:|---|
| Data must remain in a defined region | Legal/contractual | Yes | Legal and cloud-architecture review |
| Use existing identity provider | Technical/organizational | Usually | Integration proof of concept |
| Release by end of quarter | Business | Negotiable | Sponsor decision and scope plan |
| Use a specific UI library | Preference | Often | Architecture decision record |

**Pros**
- Prevents preferences from unnecessarily limiting solutions.
- Improves decision transparency.
- Helps manage changing constraints.
- Supports risk planning and traceability.

**Cons**
- Requires stakeholder engagement.
- Challenging a constraint may be politically difficult.
- Some constraints genuinely cannot change.

### When to choose which

- Use **Solution 1** only for isolated prototypes with no production commitment.
- Use **Solution 2** for normal planning and solution design.
- Use **Solution 3** for complex systems, vendor choices, major investments, and regulated environments.

---

## 9. Assumptions

### Simple explanation

An **assumption** is something believed to be true for planning or design, but not yet confirmed.

Assumptions are not requirements. They are risks until validated.

### Example

- Patients have access to email or SMS for booking confirmation.
- The clinic’s existing identity provider supports the required authentication flow.
- Most appointment bookings occur during normal daytime hours.
- The external calendar API can handle expected request volume.
- Reception staff can adopt the new workflow with limited training.

### Problem

Teams make assumptions constantly. The problem is not having them; the problem is leaving them invisible.

Unrecorded assumptions often become late-stage failures:

> “We assumed the calendar provider supported real-time updates.”

> “We assumed patients had reliable smartphone access.”

> “We assumed the compliance team would approve using this messaging vendor.”

### Solution 1: Leave assumptions implicit

The team proceeds with the assumptions embedded in discussions, designs, and code.

**Pros**
- No documentation effort.
- Feels fast.
- Can work only when the domain and solution are extremely familiar.

**Cons**
- Assumptions are forgotten or interpreted differently.
- Risks are discovered too late.
- It is difficult to assign ownership for validation.
- Decisions appear more certain than they are.

**Problem left behind:** Hidden uncertainty creates false confidence and unplanned rework.

### Solution 2: Record an assumptions list

Document assumptions with their impact.

Example:

| Assumption | Impact if false |
|---|---|
| Patients can receive SMS reminders | Reminder workflow may not reach key users |
| Calendar API supports webhook updates | Availability may become stale |
| Staff can access the system from clinic workstations | Workflow may require device or network changes |
| Existing consent records are accurate | Communications may be sent unlawfully |

**Pros**
- Makes uncertainty visible.
- Improves discussion and planning.
- Helps teams avoid treating guesses as facts.
- Supports project risk management.

**Cons**
- Lists can become stale.
- Teams may record assumptions but fail to act on them.
- Not all assumptions have equal importance.

**Problem left behind:** Visibility helps, but the team needs to prioritize and validate the assumptions most likely to cause failure.

### Solution 3: Convert critical assumptions into validation actions

For each material assumption:
1. Estimate impact if it is false.
2. Estimate likelihood of being false.
3. Assign an owner.
4. Define a validation method.
5. Set a decision deadline.
6. Update requirements, plans, or architecture based on evidence.

Example:

| Assumption | Risk | Validation action | Owner |
|---|---|---|---|
| Calendar API supports required update speed | High | Build a test integration with synthetic data | Engineering |
| Patients accept SMS communication | High | Review consent rules and conduct user research | Product and privacy |
| Staff can adopt the workflow quickly | Medium | Run usability sessions and pilot training | Operations |
| Peak booking load occurs at 9 AM | Medium | Analyze existing traffic data | Product analytics |

**Pros**
- Converts uncertainty into planned learning.
- Reduces expensive surprises.
- Helps prioritize prototypes, research, and technical spikes.
- Improves the credibility of estimates and business cases.

**Cons**
- Validation takes time and may delay decisions.
- Some assumptions cannot be fully tested in advance.
- New assumptions will emerge as the product evolves.

### When to choose which

- Avoid **Solution 1** except for trivial, easily reversible decisions.
- Use **Solution 2** for ordinary planning and requirement discovery.
- Use **Solution 3** for assumptions affecting security, compliance, customer value, cost, schedule, or technical feasibility.

---

# Topic 1.5 Decision Guide

| If you need to… | Use… |
|---|---|
| Define required system behavior | Functional requirements |
| Specify quality and operational expectations | Non-functional requirements |
| Ensure critical workflows remain responsive under load | Performance requirements |
| Protect users, data, and systems from misuse | Security requirements and threat modeling |
| Ensure people using assistive technologies can complete tasks | Accessibility requirements and user validation |
| Support multiple languages, regions, and time zones | Internationalization requirements |
| Plan for growth without premature complexity | Scalability requirements and capacity targets |
| Record limits the solution must respect | Constraints |
| Turn uncertainty into discovery work | Assumptions with validation actions |

## How this leads to Topic 1.6

Requirements types help the team separate:

- **What** the product must do.
- **How well** it must work.
- **Which boundaries** the solution must respect.
- **Which unknowns** still need validation.

The next question is:

> “How do we organize these requirements into a clear product document that defines scope, user journeys, priorities, epics, stories, and acceptance criteria?”

That leads to **1.6 PRD — Product Requirements Document**.

# 1.6 PRD — Product Requirements Document

**Goal:** Organize validated product requirements into a shared document that defines the problem, intended outcomes, scope, priorities, user journeys, and acceptance conditions.

A **Product Requirements Document (PRD)** explains **why** a product or feature should exist, **who** it serves, **what** outcomes it must achieve, and **what is in or out of scope**.

A PRD should not prescribe every technical implementation detail. Technical design belongs primarily in a TRD, architecture decision record, or design document.

---

## 1. PRD Structure

### Simple explanation

A PRD needs enough structure that product, design, engineering, QA, security, operations, and stakeholders can find the same answers.

A practical PRD commonly includes:

1. Title and owner.
2. Problem statement.
3. Background and evidence.
4. Product vision and goals.
5. Target users and stakeholders.
6. Scope and non-scope.
7. User journeys.
8. Functional requirements, epics, and stories.
9. Non-functional requirements.
10. Assumptions, dependencies, risks, and constraints.
11. Metrics and acceptance criteria.
12. Rollout, support, and operational considerations.
13. Open questions and decision log.

### Example

For an online appointment-cancellation workflow:

```markdown name=prd-outline.md
# PRD: Online Appointment Cancellation

## Problem
Patients must call the clinic to cancel appointments, causing delays,
missed cancellations, and unfilled appointment slots.

## Goal
Allow eligible patients to cancel appointments safely online.

## Success metric
Reduce phone-based cancellation requests by 30% within three months,
without increasing missed appointment rates.

## In scope
- Patient cancellation of eligible appointments
- Confirmation messages
- Audit trail
- Staff visibility of cancellations

## Out of scope
- Rescheduling
- Waiting-list auto-fill
- Changes to clinician scheduling rules

## Key requirement
Only authenticated patients may cancel appointments they own.

## Risks
- Incorrect authorization may expose another patient's appointment.
- Cancellation rules vary by clinic.

## Acceptance
Cancellation works for eligible appointments, respects clinic policy,
and remains accessible by keyboard and screen reader.
```

### Problem

Without a structured PRD, requirements are often spread across:
- Chat messages.
- Meeting notes.
- Ticket comments.
- Email threads.
- Slides.
- Individual memory.

This creates inconsistent understanding. Engineers may build from a ticket, QA may test from a spreadsheet, and stakeholders may assume requirements from a meeting that was never documented.

### Solution 1: Use informal notes and backlog tickets

The team records requests as individual tickets.

**Pros**
- Fast to create.
- Works for tiny, familiar changes.
- Fits lightweight maintenance work.

**Cons**
- Context is fragmented.
- Teams lose the problem statement and business rationale.
- Dependencies and non-scope are easily missed.
- New team members struggle to understand the bigger picture.
- Risks, security expectations, and success metrics may never be captured.

**Problem left behind:** Tickets describe pieces of work but do not establish a shared product understanding.

### Solution 2: Use a fixed PRD template

Adopt a standard document structure for product initiatives.

**Pros**
- Makes important sections less likely to be forgotten.
- Improves consistency across teams.
- Speeds review because readers know where to find information.
- Supports traceability from problem to outcome to requirement.

**Cons**
- A rigid template can become bureaucratic.
- Teams may fill every section with vague content merely to complete it.
- Small changes may not need a full PRD.
- The document can become stale after decisions change.

**Problem left behind:** A template improves completeness, but it does not guarantee that the document reflects evidence, active decisions, or current delivery reality.

### Solution 3: Use a living, risk-based PRD

Scale the PRD to the initiative’s size and risk:

| Change type | Appropriate documentation |
|---|---|
| Copy update | Ticket with review notes |
| Small workflow improvement | Short PRD or structured issue |
| New customer-facing feature | Full PRD with journeys, requirements, and metrics |
| Regulated or security-sensitive capability | Full PRD plus traceability, threat model, privacy review, and rollout plan |

Keep the PRD current:
- Link it to design, technical, and test documents.
- Record decisions and changes.
- Assign an owner.
- Mark open questions explicitly.
- Retire obsolete sections rather than allowing conflicting versions.

**Pros**
- Balances speed with clarity.
- Makes documentation proportional to impact.
- Supports evolving requirements without losing decision history.
- Helps security, accessibility, and operations participate early.

**Cons**
- Requires ownership and review discipline.
- Teams must agree which changes require which level of documentation.
- A living document needs version control and clear communication.

### When to choose which

- Use **Solution 1** only for very small, low-risk, reversible work.
- Use **Solution 2** when a team needs consistency and is beginning to formalize product discovery.
- Use **Solution 3** for most meaningful product work, especially user-facing or high-risk initiatives.

---

## 2. Scope and Non-Scope

### Simple explanation

**Scope** defines what the initiative will deliver.

**Non-scope** defines what it explicitly will not deliver now.

Both are necessary. Scope prevents ambiguity; non-scope prevents assumptions and uncontrolled expansion.

### Example

For online appointment cancellation:

| In scope | Out of scope |
|---|---|
| Patient cancels an eligible appointment | Patient reschedules an appointment |
| Staff views cancellation status | Automatic waiting-list replacement |
| Confirmation message is sent | Support for every communication channel |
| Clinic cancellation policy is enforced | Redesign of the full patient portal |

### Problem

Without boundaries, stakeholders naturally assume that related capabilities are included.

A request to “allow patients to cancel appointments online” may become:
- Cancellation.
- Rescheduling.
- Refunds.
- Calendar synchronization.
- Waiting-list automation.
- Multi-language messaging.
- Support workflows.
- Analytics dashboards.

Each may be valuable, but combining them without a deliberate decision makes estimates unreliable and delays delivery.

### Solution 1: State only the feature name

Example:

> Build online appointment cancellation.

**Pros**
- Very concise.
- Easy to add to a roadmap.
- Sufficient for a high-level conversation.

**Cons**
- Does not identify limits.
- Encourages different interpretations.
- Makes “small” changes grow silently.
- Does not help engineering estimate or test the work.

**Problem left behind:** A feature label gives direction but leaves too much room for scope expansion.

### Solution 2: Define in-scope capabilities

Example:

> The first release allows authenticated patients to cancel their own appointments when permitted by the clinic’s cancellation policy.

**Pros**
- Clarifies the central capability.
- Supports initial design and estimation.
- Makes ownership and user roles more explicit.

**Cons**
- Stakeholders may still assume closely related capabilities are included.
- Edge cases can remain unclear.
- It may not explain why some related work is deferred.

**Problem left behind:** Defining inclusion clarifies intended work, but it does not prevent assumptions about excluded work.

### Solution 3: Define both scope and non-scope, with rationale

Example:

| Item | Decision | Reason |
|---|---|---|
| Patient cancellation | In scope | Directly solves the validated problem |
| Staff override | In scope | Required for operational exceptions |
| Appointment rescheduling | Out of scope | Separate workflow with additional availability and payment rules |
| Automated waiting-list fill | Out of scope | Requires separate consent, matching, and notification design |
| Email and SMS confirmation | In scope | Existing approved notification infrastructure supports both |
| Push notifications | Out of scope | Low adoption and new mobile-app dependency |

**Pros**
- Reduces scope creep.
- Helps stakeholders understand sequencing.
- Improves planning and estimation.
- Creates a clear basis for change control.

**Cons**
- Requires difficult prioritization decisions.
- Non-scope can disappoint stakeholders.
- Scope must be reviewed when evidence or constraints change.

### When to choose which

- Use **Solution 1** only during initial ideation.
- Use **Solution 2** for small, well-understood improvements.
- Use **Solution 3** for roadmap commitments, cross-team work, and any initiative with significant dependencies or risk.

---

## 3. User Journeys

### Simple explanation

A **user journey** describes the end-to-end steps a person takes to achieve an outcome. It includes actions, decisions, emotions, touchpoints, errors, and handoffs.

A journey is broader than a screen flow. It can begin before the user opens the product and continue after the immediate task is complete.

### Example

**Journey: Patient cancels an appointment**

1. Patient receives an appointment reminder.
2. Patient realizes they cannot attend.
3. Patient opens the cancellation link or portal.
4. Patient authenticates.
5. Patient reviews appointment details.
6. Patient confirms cancellation.
7. The system validates eligibility and authorization.
8. The system records the cancellation.
9. The patient receives confirmation.
10. Clinic staff sees the updated availability.
11. The clinic may contact a waiting-list patient.

### Problem

Without journeys, teams focus on individual screens or backend endpoints rather than the user’s full outcome.

This can result in a technically correct cancel button that still fails because:
- The patient cannot find it.
- The sign-in process is confusing.
- The policy is revealed only after the user completes a long form.
- Confirmation is unclear.
- Staff are not informed.
- The appointment remains visible as active in another system.

### Solution 1: Document isolated screens or API endpoints

Examples:
- “Add a cancellation button.”
- “Create `POST /appointments/{id}/cancel`.”
- “Add a cancellation-status field.”

**Pros**
- Useful for implementation tasks.
- Clear for a narrow technical change.
- Easy to estimate in isolation.

**Cons**
- Does not show user intent or context.
- Misses handoffs and failure states.
- Does not reveal where users abandon the process.
- Encourages local optimization rather than end-to-end success.

**Problem left behind:** Components may work individually while the overall task remains difficult or incomplete.

### Solution 2: Map the happy-path journey

Document the normal route from start to successful outcome.

Example:

```text
Reminder → Portal → Sign in → Select appointment → Confirm cancellation
→ Cancellation recorded → Patient confirmation → Staff notification
```

**Pros**
- Creates shared understanding across roles.
- Identifies required systems and touchpoints.
- Helps sequence initial delivery work.
- Makes user value easier to explain.

**Cons**
- Happy paths hide important real-world complexity.
- Does not cover errors, accessibility barriers, or unusual policies.
- May ignore emotional or operational friction.

**Problem left behind:** The expected path is clear, but products must handle failures, exceptions, and different user contexts safely.

### Solution 3: Model end-to-end journeys with alternatives and service touchpoints

For each step, document:
- User goal.
- Action and interface.
- System behavior.
- Supporting teams or systems.
- Friction and risks.
- Accessibility needs.
- Security and privacy considerations.
- Alternate and failure paths.

Example:

| Step | User action | System behavior | Risk or exception |
|---|---|---|---|
| Open cancellation link | Patient follows reminder link | Validates signed, time-limited link or requires login | Link must not expose appointment details if forwarded |
| View appointment | Patient checks details | Verifies ownership before returning data | Prevent insecure direct object reference |
| Confirm cancellation | Patient selects confirm | Checks policy and concurrent changes | Appointment may already be cancelled or changed |
| Receive confirmation | Patient sees result | Sends notification according to consent | Avoid sensitive details in message previews |
| Staff follow-up | Receptionist views availability | Updates staff calendar or queue | Integration may fail and require reconciliation |

**Pros**
- Reveals cross-system, operational, accessibility, and security needs.
- Identifies failure modes before implementation.
- Produces strong input for stories, tests, and rollout planning.
- Keeps the team focused on completing a user outcome.

**Cons**
- Takes more discovery effort.
- Large journey maps can become hard to maintain.
- Teams must avoid documenting every rare detail before validating core value.

### When to choose which

- Use **Solution 1** for implementation planning after the journey is known.
- Use **Solution 2** for simple features with few exceptions.
- Use **Solution 3** for customer journeys involving personal data, multiple systems, payments, operations, or important failure consequences.

---

## 4. Epics

### Simple explanation

An **epic** is a large body of work that delivers a meaningful outcome but is too broad to complete in one iteration.

An epic is split into smaller stories or requirements that can be independently built, tested, and prioritized.

### Example

**Epic: Enable self-service appointment cancellation**

Potential stories:
1. Patient can view upcoming appointments.
2. Patient can cancel an eligible appointment.
3. System enforces clinic-specific cancellation deadlines.
4. Patient receives a cancellation confirmation.
5. Staff can view cancellation history.
6. System records an audit event.
7. The cancellation flow is accessible by keyboard and screen reader.

### Problem

Without epics, teams often choose one of two poor extremes:
- One enormous story: “Build online appointment management.”
- Hundreds of disconnected small tasks with no shared product outcome.

### Solution 1: Use a large feature as one backlog item

Example:

> As a patient, I want to manage my appointments online.

**Pros**
- Easy to describe.
- Useful for a high-level roadmap.
- Clearly communicates broad intent.

**Cons**
- Too large to estimate reliably.
- Too broad to test as one unit.
- Hides dependencies and risk.
- Creates a long period before any usable outcome is available.
- Makes progress hard to measure.

**Problem left behind:** The feature has value, but it cannot be planned or delivered incrementally.

### Solution 2: Split the feature into implementation tasks

Example:
- Create appointment table.
- Build cancellation API.
- Add UI component.
- Configure notification provider.
- Add audit log.

**Pros**
- Helps engineering plan work.
- Reveals technical dependencies.
- Easier to assign during implementation.

**Cons**
- Technical tasks do not necessarily form user value.
- Stakeholders cannot easily prioritize them.
- The team may complete many tasks without delivering a usable workflow.
- Security and user acceptance can be lost between tasks.

**Problem left behind:** Technical decomposition enables construction but does not ensure each increment creates a coherent product outcome.

### Solution 3: Define outcome-oriented epics and split them into vertical stories

An epic should describe a user or business outcome. Split it into **vertical slices** that include UI, behavior, security, persistence, tests, and operations where necessary.

Example:

| Story | User value |
|---|---|
| View eligible upcoming appointments | Patient can identify the appointment they need to cancel |
| Cancel an eligible appointment | Patient can complete the main outcome |
| Explain ineligible cancellation | Patient understands what to do when policy prevents online cancellation |
| Notify patient of cancellation | Patient has confirmation and reduced uncertainty |
| Show cancellation to staff | Clinic can act on newly available capacity |

**Pros**
- Preserves end-to-end user value.
- Enables earlier releases and feedback.
- Makes progress visible.
- Supports re-prioritization based on evidence.
- Reduces the risk of building unneeded parts of a large feature.

**Cons**
- Requires thoughtful slicing.
- Some architectural work may be needed before the first vertical slice.
- Dependencies can make “independent” stories difficult.
- Teams must avoid splitting security, accessibility, and testing into later work.

### When to choose which

- Use **Solution 1** for high-level roadmap communication only.
- Use **Solution 2** as supporting engineering planning beneath a known story.
- Use **Solution 3** for actual product delivery and backlog refinement.

---

## 5. User Stories

### Simple explanation

A **user story** is a small, user-centered statement of a need that can be discussed, implemented, and verified.

Common format:

> As a **[role]**,  
> I want **[capability]**,  
> so that **[benefit]**.

Example:

> As a patient, I want to cancel an eligible appointment online, so that I can free the appointment slot without calling the clinic.

### Problem

A PRD may define the correct product direction but still be too broad for a delivery team.

For example:

> “Patients need self-service appointment management.”

Engineering needs to know what to build first, what behavior is expected, and how to verify it.

### Solution 1: Create generic stories without outcomes

Example:

> As a user, I want appointment cancellation.

**Pros**
- Short.
- Easy to create.
- Better than a purely technical task.

**Cons**
- “User” is too vague.
- Does not describe why the capability matters.
- Omits policy, security, and usability needs.
- Cannot be estimated or tested confidently.

**Problem left behind:** The story has a user-oriented form, but it still lacks the context required for delivery.

### Solution 2: Write user stories with a clear role, capability, and benefit

Example:

> As an authenticated patient, I want to cancel an eligible appointment from the patient portal, so that I can notify the clinic without calling during business hours.

**Pros**
- Identifies the actor and value.
- Supports prioritization.
- Encourages conversations about the workflow.
- Helps distinguish needs between patients, staff, and administrators.

**Cons**
- Still does not define exact rules or expected edge-case behavior.
- Stories can become too large.
- Some work, such as infrastructure or regulatory compliance, has no direct end-user role.

**Problem left behind:** The story communicates value, but the delivery team needs confirmation criteria and supporting requirements.

### Solution 3: Use refined stories with acceptance criteria and supporting constraints

A delivery-ready story includes:
- The user story.
- Acceptance criteria.
- Relevant business rules.
- Security and privacy conditions.
- Accessibility needs.
- Dependencies and open questions.
- Non-functional expectations, if applicable.

```gherkin name=patient-cancellation.feature
Feature: Patient appointment cancellation

  Scenario: Patient cancels an eligible appointment
    Given an authenticated patient owns an appointment scheduled more than 24 hours from now
    When the patient confirms cancellation
    Then the appointment is marked as cancelled
    And the patient receives a confirmation
    And clinic staff can see the cancellation status

  Scenario: Patient attempts to cancel another patient's appointment
    Given an authenticated patient does not own an appointment
    When the patient requests cancellation
    Then the system denies the request
    And the response does not reveal appointment details
    And the authorization failure is recorded according to security policy

  Scenario: Cancellation is blocked by clinic policy
    Given an authenticated patient owns an appointment within the cancellation deadline
    When the patient attempts cancellation
    Then the system explains that online cancellation is unavailable
    And the system provides an approved support option
```

**Pros**
- Produces a testable and secure shared understanding.
- Reduces implementation ambiguity.
- Helps QA create automated and exploratory tests.
- Supports traceability from PRD to delivered behavior.

**Cons**
- Refinement takes time.
- Excessive detail can make stories difficult to read.
- Teams must maintain stories as business rules evolve.

### When to choose which

- Use **Solution 1** only during early brainstorming.
- Use **Solution 2** for backlog-level product planning.
- Use **Solution 3** before development begins on a meaningful user-facing story.

---

## 6. Acceptance Criteria

### Simple explanation

**Acceptance criteria** define the conditions that must be met for a requirement or story to be accepted as complete.

They answer:

> “How will we know this behavior works as intended?”

Acceptance criteria are not just a QA checklist. They align product, design, engineering, security, and operations before implementation.

### Example

For appointment cancellation:

- Only an authenticated patient can cancel an appointment they own.
- The system prevents cancellation when the clinic deadline has passed.
- A successful cancellation is visible to both patient and staff.
- The patient receives a confirmation that does not expose unnecessary personal data.
- The journey works using keyboard navigation.
- Failed requests do not leave the appointment in a partially updated state.

### Problem

Without acceptance criteria, “done” becomes subjective:

- Product says, “The workflow is not what I expected.”
- QA says, “There was no requirement for this edge case.”
- Engineering says, “The requested endpoint is implemented.”
- Security says, “Authorization was never defined.”
- Operations says, “There is no monitoring or support procedure.”

### Solution 1: Rely on verbal agreement

The team discusses behavior in a meeting and starts implementation.

**Pros**
- Fast.
- Useful for trivial changes.
- Allows informal collaboration.

**Cons**
- Details are forgotten or interpreted differently.
- Remote or future team members lack context.
- Edge cases remain undocumented.
- No reliable basis exists for tests or acceptance.

**Problem left behind:** Conversation is valuable, but without recorded confirmation it does not create a durable shared contract.

### Solution 2: Write a checklist of expected results

Example:
- User can cancel an appointment.
- Confirmation is displayed.
- Staff can see cancellation.

**Pros**
- Simple and readable.
- Better than relying on memory.
- Useful for straightforward requirements.

**Cons**
- Often omits preconditions, negative paths, and expected errors.
- May not define security or accessibility expectations.
- Wording can still be ambiguous.

**Problem left behind:** A checklist states desired results, but it may not capture behavior precisely enough to automate or validate complex scenarios.

### Solution 3: Use testable examples, including normal and failure paths

Use **Given/When/Then** or equivalent structured examples.

Include:
- Authorized success.
- Invalid input.
- Unauthorized access.
- Concurrency or retry behavior.
- Policy exceptions.
- Accessibility conditions.
- Privacy-safe error behavior.
- Operationally relevant outcomes.

```gherkin name=appointment-cancellation-criteria.feature
Feature: Appointment cancellation acceptance criteria

  Scenario: Successful cancellation
    Given an authenticated patient owns an appointment that is eligible for cancellation
    When the patient confirms cancellation
    Then the appointment status becomes "Cancelled"
    And the available slot is updated according to clinic policy
    And the patient receives a confirmation

  Scenario: Invalid cancellation request
    Given an authenticated patient submits a request with an invalid appointment identifier
    When the system processes the request
    Then the system returns a safe validation error
    And no appointment data is changed

  Scenario: Concurrent update
    Given an appointment is being modified by clinic staff
    When a patient submits a cancellation request for that appointment
    Then the system prevents conflicting updates
    And the patient receives a clear outcome or retry instruction
```

**Pros**
- Makes expectations clear and verifiable.
- Supports automated acceptance testing.
- Encourages early discussion of edge cases and abuse cases.
- Reduces rework caused by interpretation gaps.

**Cons**
- Takes effort to write well.
- Poor scenarios can duplicate implementation details.
- Not all quality requirements fit neatly into Given/When/Then format.

### When to choose which

- Use **Solution 1** only for trivial, low-risk work.
- Use **Solution 2** for simple changes with obvious outcomes.
- Use **Solution 3** for user-facing, security-sensitive, complex, or business-critical behavior.

---

## 7. MoSCoW Prioritization

### Simple explanation

**MoSCoW** prioritizes requirements into four groups:

- **Must have** — essential for the release to succeed.
- **Should have** — important, but the release can work without it temporarily.
- **Could have** — desirable if capacity allows.
- **Won’t have now** — consciously deferred, not rejected forever.

### Example

For the first release of appointment cancellation:

| Priority | Requirement |
|---|---|
| Must | Patient can cancel an eligible appointment they own |
| Must | Server-side authorization prevents access to other patients’ records |
| Must | Cancellation policy is enforced |
| Should | Patient receives email confirmation |
| Could | Patient provides an optional cancellation reason |
| Won’t now | Patient self-service rescheduling |

### Problem

Without prioritization, every stakeholder may label their request as essential.

This causes:
- Overloaded releases.
- Missed deadlines.
- Reduced quality.
- Inability to make trade-offs.
- “MVP” releases that contain too much to validate effectively.

### Solution 1: Treat all requested requirements as equal

The team attempts to deliver every requested feature.

**Pros**
- Avoids difficult stakeholder conversations initially.
- Can appear responsive.
- May work only when scope is genuinely small.

**Cons**
- Creates unrealistic plans.
- Delays core value.
- Encourages quality shortcuts.
- Makes risk management impossible.
- Often leads to late, unplanned cuts.

**Problem left behind:** Avoiding prioritization does not remove trade-offs; it merely postpones them until less information and less time are available.

### Solution 2: Use informal high/medium/low labels

Example:
- High: cancellation workflow.
- Medium: cancellation reason.
- Low: custom confirmation themes.

**Pros**
- Very simple.
- Better than no ordering.
- Useful for quick backlog triage.

**Cons**
- “High” can mean urgency, value, risk, executive preference, or dependency.
- Too many items become “high.”
- Does not explicitly identify what will not be delivered.

**Problem left behind:** Relative labels create a rough order but do not force a release decision or distinguish essential work from desirable work.

### Solution 3: Apply MoSCoW with clear release criteria

Define “Must” strictly:

> If a Must requirement is missing, the release is unsafe, unlawful, unusable for its core purpose, or fails its stated objective.

For example, authorization is a **Must**, not an optional security enhancement.

Also review priority using:
- User value.
- Business value.
- Risk reduction.
- Compliance obligations.
- Dependencies.
- Effort and cost.
- Learning value.

**Pros**
- Makes trade-offs explicit.
- Protects the minimum viable, safe, and compliant release.
- Helps plan phased delivery.
- Creates a visible deferred-work list.

**Cons**
- Requires stakeholder alignment.
- Categories can be abused if “Must” is not tightly defined.
- It does not calculate expected return or cost of delay.

### When to choose which

- Avoid **Solution 1** except for trivial scope.
- Use **Solution 2** for early backlog sorting.
- Use **Solution 3** when planning a release, MVP, deadline, or constrained investment.

---

## 8. RICE Prioritization

### Simple explanation

**RICE** is a scoring framework that compares opportunities using:

- **Reach:** How many users or events will be affected in a time period?
- **Impact:** How much value will it create for each affected user?
- **Confidence:** How reliable are the estimates?
- **Effort:** How much work will it take?

Formula:

\[
\text{RICE Score} =
\frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}
{\text{Effort}}
\]

### Example

Compare two potential improvements:

| Initiative | Reach / month | Impact | Confidence | Effort (person-months) | RICE score |
|---|---:|---:|---:|---:|---:|
| Online cancellation | 4,000 | 2 | 80% | 2 | 3,200 |
| Custom calendar color themes | 1,000 | 0.25 | 60% | 1 | 150 |

Online cancellation scores higher because it reaches more users, has greater impact, and produces stronger expected value per unit of effort.

### Problem

MoSCoW clarifies whether work is essential for a release, but it does not compare many optional opportunities quantitatively.

A team may have ten “Should have” ideas and limited capacity. It needs a way to make assumptions visible and compare likely value.

### Solution 1: Prioritize by intuition or stakeholder influence

A team chooses work based on:
- The loudest request.
- Seniority.
- Recency.
- Personal enthusiasm.
- Whichever feature is easiest to describe.

**Pros**
- Fast.
- May be acceptable for emergencies or obvious compliance work.
- Uses expert judgment.

**Cons**
- Decisions are difficult to explain.
- Bias and politics can dominate.
- Assumptions remain hidden.
- Teams may invest heavily in low-impact work.

**Problem left behind:** Judgment is necessary, but unsupported judgment is hard to compare, challenge, or learn from.

### Solution 2: Estimate RICE scores

Estimate each factor and compare scores.

Example:

```text
Reach:       4,000 affected users/month
Impact:      2 (high)
Confidence:  0.80
Effort:      2 person-months

Score: (4,000 × 2 × 0.80) / 2 = 3,200
```

**Pros**
- Makes assumptions explicit.
- Encourages consideration of effort, not only desirability.
- Helps compare a large backlog.
- Supports evidence-based discussion.

**Cons**
- Estimates can be uncertain or manipulated.
- Numeric scores can create false precision.
- RICE does not automatically account for legal requirements, security risk, strategic necessity, or dependencies.
- Impact scales need a shared definition.

**Problem left behind:** A score helps compare opportunities, but it cannot replace judgment about mandatory work, risk, sequencing, or strategic direction.

### Solution 3: Use RICE alongside mandatory constraints and qualitative review

Before scoring, separate work that cannot be optional:
- Security remediation.
- Legal or regulatory obligations.
- Critical reliability fixes.
- Contractual commitments.
- Blocking dependencies.

Then use RICE for discretionary product opportunities.

Document:
- Source of reach data.
- Meaning of impact values.
- Confidence rationale.
- Effort assumptions.
- Risks and dependencies excluded from the score.

**Pros**
- Retains RICE’s comparison value without pretending it decides everything.
- Makes uncertainty visible.
- Prevents mandatory security or compliance work from losing to popular features.
- Improves learning when actual results are compared with estimates.

**Cons**
- Requires disciplined data collection.
- Takes more time than intuition.
- Still cannot predict product outcomes with certainty.

### When to choose which

- Use **Solution 1** only for urgent incidents or clear mandatory obligations.
- Use **Solution 2** for comparing a set of discretionary, similarly scoped opportunities.
- Use **Solution 3** for normal roadmap prioritization where risk, compliance, and strategy also matter.

---

# Topic 1.6 Decision Guide

| If you need to… | Use… |
|---|---|
| Create a shared source of truth for a product initiative | A structured, living PRD |
| Prevent related ideas from silently expanding a release | Explicit scope and non-scope |
| Understand the complete user outcome across systems and teams | End-to-end user journeys |
| Break a large outcome into deliverable work | Outcome-oriented epics |
| Express small, user-centered delivery needs | Refined user stories |
| Define what “done” means before implementation | Testable acceptance criteria |
| Decide what is essential for an upcoming release | MoSCoW |
| Compare optional investments by expected value and effort | RICE, with explicit assumptions |

## How this leads to Topic 1.7

A PRD organizes the product problem, scope, journeys, priorities, and acceptance expectations.

The next question is:

> “How do business requirements differ from detailed software requirements, and how can they be documented with formal structure and traceability?”

That leads to **1.7 BRD and SRS — Business Requirements Document and Software Requirements Specification**.

# 1.7 BRD and SRS — Business Requirements Document and Software Requirements Specification

**Goal:** Separate the business need from the detailed software behavior so decision-makers, product teams, engineers, testers, security specialists, and operations teams share a traceable understanding.

A **BRD** explains **why** the organization needs a change and what business outcome it expects.

An **SRS** explains **what the software must do** and the conditions it must satisfy.

In many Agile teams, these are not always separate large documents. The same information may be distributed across a PRD, backlog, architecture documentation, and test specifications. The important part is preserving the distinction between business intent and software specification.

> **Important terminology:** IEEE 830 is a legacy software-requirements-specification standard. Modern requirements-engineering guidance is commonly associated with the ISO/IEC/IEEE 29148 standard family. Organizations should follow the edition, regulatory rules, and contractual templates applicable to their context.

---

## 1. Business Requirements Document (BRD)

### Simple explanation

A **Business Requirements Document (BRD)** describes the business problem, expected outcomes, scope, stakeholders, policies, and value of an initiative.

It answers questions such as:

- What business problem are we solving?
- Why is it important now?
- Who is affected?
- What outcome is expected?
- What business rules or regulations apply?
- How will the organization measure success?
- What is in scope and out of scope?

A BRD should describe the need without prematurely prescribing a particular user interface, database, programming language, or API design.

### Example

For appointment cancellations:

> **Business problem:** Patients must call to cancel appointments, which increases receptionist workload and leaves cancelled slots unfilled.

> **Business requirement:** The clinic shall provide a way for eligible patients to cancel appointments without calling staff.

> **Business outcome:** Reduce phone-based cancellation requests by 30% and reduce unfilled cancelled appointments from 22% to 10% within six months.

### Problem

Without a BRD or equivalent business context, delivery teams may receive requests such as:

- “Build a cancellation button.”
- “Add SMS reminders.”
- “Create a dashboard.”
- “Use AI to match patients to appointments.”

These requests suggest solutions but do not establish:
- The actual business problem.
- Who benefits.
- Whether the solution is worthwhile.
- How the organization will know it succeeded.
- Whether other solutions would be simpler or safer.

### Solution 1: Start directly with technical feature requests

Example:

> Add a `Cancel Appointment` button to the portal.

**Pros**
- Fast.
- Easy to create as a development ticket.
- May work for a small, familiar change.

**Cons**
- Does not explain the business value.
- Encourages implementation before discovery.
- Cannot distinguish essential needs from stakeholder preferences.
- Makes prioritization difficult.
- Can lead to a feature that technically works but does not reduce staff workload or improve patient outcomes.

**Problem left behind:** The team knows a requested solution but not the business need it is supposed to satisfy.

### Solution 2: Write a BRD focused on business outcomes

A basic BRD includes:
- Problem statement.
- Business objective.
- Stakeholders.
- Current process and pain points.
- Scope and non-scope.
- Business requirements and rules.
- Constraints and risks.
- Success metrics.
- High-level timeline or dependencies.

Example:

| BRD section | Example |
|---|---|
| Problem | Patients must call to cancel, increasing call volume and unfilled slots. |
| Objective | Enable eligible self-service cancellation. |
| Stakeholders | Patients, receptionists, clinicians, clinic manager, privacy officer. |
| Business rule | Each clinic may set its own cancellation deadline. |
| Success measure | Reduce cancellation-related phone calls by 30%. |
| Constraint | Personal data must remain within approved hosting regions. |

**Pros**
- Keeps work connected to business value.
- Helps secure investment and stakeholder agreement.
- Makes scope and policy visible.
- Provides a stable reference for later product and technical decisions.

**Cons**
- Can be too high-level for engineers and testers.
- May become stale if business decisions change.
- A document does not prove that the problem is real; it still needs evidence from research and metrics.

**Problem left behind:** The BRD explains why the initiative exists, but delivery teams still need precise, testable software behavior.

### Solution 3: Use a living BRD linked to product and software requirements

Treat the BRD as the business-level source of truth and link it to:
- PRD sections.
- User journeys.
- Epics and stories.
- SRS requirements.
- Technical design.
- Test cases.
- Release metrics.

Example traceability:

```text
BR-01: Reduce manual cancellation workload
  └─ PRD: Self-service cancellation scope
      └─ SRS-FR-12: Patient may cancel an eligible owned appointment
          └─ Story: Patient self-service cancellation
              └─ Test: Authorized patient cancellation succeeds
              └─ Metric: Cancellation-related phone contacts
```

**Pros**
- Preserves business rationale throughout delivery.
- Makes change impact easier to assess.
- Helps auditors, sponsors, and new team members understand decisions.
- Reduces the risk of building technically correct but commercially irrelevant software.

**Cons**
- Requires ownership and document maintenance.
- Traceability can become burdensome if performed manually for every trivial change.
- Teams need agreement on identifiers, tools, and review responsibilities.

### When to choose which

- Use **Solution 1** only for tiny, reversible changes with obvious value.
- Use **Solution 2** for ordinary projects involving multiple stakeholders or meaningful investment.
- Use **Solution 3** for complex, regulated, contractual, high-risk, or long-lived products.

---

## 2. Software Requirements Specification (SRS)

### Simple explanation

A **Software Requirements Specification (SRS)** defines the detailed behavior and quality expectations of the software.

It answers:

- What functions must the system provide?
- Which users or systems can perform each action?
- What rules and validations apply?
- What happens when requests fail?
- What security, accessibility, performance, reliability, and compatibility targets apply?
- How will the requirements be verified?

An SRS should describe **what** is required, not unnecessarily dictate **how** developers implement it.

### Example

Business requirement:

> Eligible patients must be able to cancel appointments without calling the clinic.

Software requirements:

> **SRS-FR-12:** The system shall allow an authenticated patient to cancel an appointment only when the patient owns that appointment.

> **SRS-FR-13:** The system shall reject an online cancellation when the appointment is within the clinic-configured cancellation deadline.

> **SRS-NFR-07:** The system shall enforce authorization on the server for every appointment cancellation request.

> **SRS-NFR-08:** The cancellation workflow shall be operable using a keyboard alone.

### Problem

A BRD may establish an important business objective but leave critical software behavior unclear.

For example, “enable online cancellation” does not answer:
- How does the system identify the patient?
- Can a patient cancel another patient’s appointment?
- How are clinic-specific policies configured?
- What happens if staff modify the appointment while the patient cancels it?
- How quickly must the result be shown?
- What information can safely appear in confirmation messages?

### Solution 1: Use informal developer interpretation

Developers infer detailed behavior from business discussions or individual tickets.

**Pros**
- Fast at the beginning.
- Allows experienced teams to move quickly.
- Useful for prototypes and low-risk internal work.

**Cons**
- Different developers may implement different interpretations.
- QA has no definitive basis for acceptance testing.
- Security and accessibility requirements are easily omitted.
- Future maintainers may not understand why behavior exists.
- Changes are harder to assess safely.

**Problem left behind:** Informal understanding may be enough to start coding, but it is not a reliable specification for correct and secure software behavior.

### Solution 2: Write detailed functional and non-functional requirements

Use uniquely identified, testable statements.

Example:

| ID | Requirement |
|---|---|
| SRS-FR-12 | The system shall allow an authenticated patient to cancel an appointment they own when it meets the configured cancellation policy. |
| SRS-FR-13 | The system shall record the cancellation time, actor type, and policy result. |
| SRS-FR-14 | The system shall display a safe confirmation after a successful cancellation. |
| SRS-NFR-07 | The system shall verify authorization server-side before returning or modifying appointment information. |
| SRS-NFR-08 | The cancellation action shall complete within two seconds at the 95th percentile under expected load. |
| SRS-NFR-09 | The cancellation workflow shall meet the applicable WCAG 2.2 AA success criteria. |

**Pros**
- Reduces ambiguity.
- Supports estimation, implementation, and test design.
- Makes quality expectations explicit.
- Supports compliance and audit evidence.
- Improves change impact analysis.

**Cons**
- Writing strong requirements takes time and domain knowledge.
- Requirements can become unnecessarily detailed.
- Large documents are hard to maintain if not version-controlled.
- A requirement statement alone may not communicate the whole user journey.

**Problem left behind:** Precise requirement statements clarify behavior, but they still need examples and verification methods to prove the system satisfies them.

### Solution 3: Combine SRS statements with examples, models, and verification links

For significant requirements, include:
- Requirement identifier.
- Requirement statement.
- Source or business rationale.
- Priority.
- Acceptance examples.
- Dependencies.
- Security and privacy classification.
- Verification method.
- Traceability to tests.

Example:

| Field | Value |
|---|---|
| ID | SRS-FR-12 |
| Requirement | An authenticated patient shall be able to cancel only an appointment they own and that is eligible under the clinic policy. |
| Source | BR-01: Reduce manual cancellation workload |
| Priority | Must |
| Verification | Automated integration test and user-acceptance test |
| Security | Server-side object-level authorization is mandatory |
| Privacy | Do not reveal appointment details in unauthorized responses |

```gherkin name=srs-fr-12.feature
Feature: SRS-FR-12 — Authorized appointment cancellation

  Scenario: Patient cancels an appointment they own
    Given an authenticated patient owns an appointment that is eligible for cancellation
    When the patient confirms cancellation
    Then the system marks the appointment as cancelled
    And the system records the authenticated actor
    And the patient receives a confirmation

  Scenario: Patient attempts to cancel another patient's appointment
    Given an authenticated patient does not own an appointment
    When the patient submits a cancellation request for that appointment
    Then the system denies the request
    And the response does not disclose appointment information
```

**Pros**
- Makes requirements understandable and testable.
- Connects business rationale to implementation and verification.
- Helps prevent authorization, privacy, and edge-case defects.
- Supports automated regression testing.

**Cons**
- Higher maintenance cost.
- Requires discipline to keep links current.
- Not every small requirement needs the full level of formality.

### When to choose which

- Use **Solution 1** only for short-lived prototypes or tiny low-risk changes.
- Use **Solution 2** for ordinary features where correctness and shared understanding matter.
- Use **Solution 3** for business-critical, security-sensitive, regulated, complex, or long-lived systems.

---

## 3. Business Requirements vs. Software Requirements

### Simple explanation

Business requirements and software requirements operate at different levels.

| Area | Business requirement | Software requirement |
|---|---|---|
| Focus | Business outcome or need | System behavior or quality |
| Main audience | Sponsors, product, business, operations | Engineering, QA, security, operations |
| Typical language | “Reduce manual booking work.” | “The system shall allow authorized patients to cancel eligible appointments.” |
| Detail level | High-level, outcome-focused | Detailed, testable, implementation-neutral |
| Verification | Business metrics and stakeholder acceptance | Tests, reviews, monitoring, acceptance criteria |

### Example

| Level | Requirement |
|---|---|
| Business | Reduce receptionist time spent handling appointment cancellations. |
| Product | Let patients cancel eligible appointments online. |
| Software functional | An authenticated patient can cancel an appointment they own when cancellation policy allows it. |
| Software non-functional | The system must reject unauthorized cancellation attempts without disclosing appointment data. |
| Test | An authenticated patient attempting to cancel another patient’s appointment receives a safe denial response. |
| Metric | Phone-based cancellation requests decrease by 30%. |

### Problem

Teams often confuse goals with requirements.

For example:

> “The system shall reduce cancellations by 20%.”

Software cannot directly guarantee this business result. The result depends on appointment availability, pricing, clinic policy, patient behavior, communication, and external factors.

Likewise:

> “The business requires a React frontend.”

This may be a technical preference or constraint, but it is not normally a business requirement.

### Solution 1: Mix business and technical statements in one unstructured list

Examples:
- Improve patient satisfaction.
- Add cancellation API.
- Use PostgreSQL.
- Reduce call volume.
- Meet accessibility standards.
- Add a cancel button.

**Pros**
- Fast to collect.
- Captures many ideas in one place.
- Can be useful during early discovery.

**Cons**
- Makes prioritization difficult.
- Hides whether an item is a goal, requirement, constraint, assumption, or solution.
- Confuses ownership.
- Makes traceability and testing weak.
- Can cause technical choices to be treated as unquestionable business needs.

**Problem left behind:** The team has captured information, but it cannot reason clearly about why each item exists or how it should be validated.

### Solution 2: Classify information by requirement level and type

Separate:
- Business goals and requirements.
- Product requirements.
- Functional requirements.
- Non-functional requirements.
- Constraints.
- Assumptions.
- Design decisions.
- Test cases and metrics.

**Pros**
- Clarifies purpose and audience.
- Improves ownership and decision-making.
- Helps teams select appropriate validation methods.
- Makes it easier to identify missing details.

**Cons**
- Requires training and consistent terminology.
- Boundaries are not always perfectly clear.
- Classification alone does not establish traceability.

**Problem left behind:** Categorization improves clarity, but teams still need to show how a business need leads to delivered software and measurable value.

### Solution 3: Build a requirements traceability chain

Link each level:

```text
Business objective
  → Product requirement
    → Functional / non-functional software requirement
      → Design and implementation
        → Test case
          → Release metric or production monitoring
```

Example:

| Level | Item |
|---|---|
| Business objective | Reduce receptionist cancellation workload |
| Product requirement | Patients can self-cancel eligible appointments |
| Software requirement | SRS-FR-12: Patient can cancel only owned, eligible appointments |
| Security requirement | SRS-NFR-07: Server-side authorization is enforced |
| Test | Integration test denies cross-account cancellation |
| Metric | Phone-based cancellation contacts per clinic per month |

**Pros**
- Demonstrates why each requirement exists.
- Supports impact analysis when a rule changes.
- Helps ensure every important requirement is tested.
- Useful for audits, safety cases, and regulated products.
- Reduces orphaned features and untested obligations.

**Cons**
- Requires tooling and maintenance.
- Can be excessive for low-risk work.
- Traceability proves relationships, not that the original requirement was the right choice.

### When to choose which

- Use **Solution 1** only for early brainstorms before refinement.
- Use **Solution 2** for most product and engineering teams.
- Use **Solution 3** when changes are costly, risk is high, contracts require evidence, or compliance demands traceability.

---

## 4. Requirement Quality

### Simple explanation

A good requirement should be understandable, necessary, feasible, testable, consistent, and traceable.

Common quality characteristics include:

| Characteristic | Meaning |
|---|---|
| Clear | Readers interpret it consistently. |
| Complete | Necessary conditions and outcomes are present. |
| Consistent | It does not conflict with other requirements. |
| Feasible | It can be delivered within known constraints. |
| Testable | A reviewer can verify whether it is met. |
| Necessary | It supports a real business, user, legal, or technical need. |
| Traceable | Its source, implementation, and tests can be identified. |
| Implementation-neutral | It describes the needed outcome unless a design choice is truly constrained. |

### Example

Weak requirement:

> The system must provide fast, secure appointment cancellation.

Improved requirement:

> The system shall allow an authenticated patient to cancel only an appointment they own when the appointment is eligible under the clinic policy.

> The system shall enforce authorization server-side for every cancellation request.

> Under the documented peak load, 95% of eligible cancellation requests shall complete within two seconds.

### Problem

Poor requirements cause expensive delivery problems:
- Ambiguity creates different implementations.
- Missing exceptions produce production defects.
- Untestable wording prevents objective acceptance.
- Conflicting requirements cause delay.
- Unnecessary technical detail constrains better solutions.

### Solution 1: Accept natural-language requirements without review

Examples:
- The service should be reliable.
- Users must have easy access.
- The platform needs enterprise security.
- The page must load quickly.

**Pros**
- Fast to write.
- Easy for non-specialists to express.
- Useful as a starting point for discussion.

**Cons**
- Vague language cannot be tested consistently.
- Terms such as “easy,” “fast,” and “secure” mean different things to different people.
- Important conditions and exceptions are likely absent.
- Teams may believe agreement exists when it does not.

**Problem left behind:** Natural language captures intent but must be refined before it can guide implementation and acceptance.

### Solution 2: Review requirements against quality criteria

Ask:
- Is the actor clear?
- Is the behavior or outcome clear?
- Are preconditions and rules defined?
- Is the wording measurable?
- Does it conflict with another requirement?
- Can we verify it?
- Is the source known?
- Does it accidentally prescribe a design?

**Pros**
- Catches ambiguity before implementation.
- Improves consistency across requirements.
- Encourages collaboration between product, engineering, QA, security, and operations.
- Can be incorporated into backlog refinement.

**Cons**
- Requires review time.
- Different reviewers may disagree.
- Checklists cannot identify every missing domain rule.

**Problem left behind:** Review improves wording, but teams also need concrete examples and test cases to validate shared interpretation.

### Solution 3: Validate requirements with examples and stakeholder review

Use:
- Given/When/Then scenarios.
- Prototypes.
- User-journey walkthroughs.
- Process models.
- Test-case reviews.
- Threat modeling for sensitive workflows.
- Accessibility reviews.

Example:

```gherkin name=appointment-cancellation-quality.feature
Feature: Safe appointment cancellation

  Scenario: Cancellation is rejected when policy prevents it
    Given an authenticated patient owns an appointment within the clinic cancellation deadline
    When the patient requests cancellation
    Then the system does not change the appointment status
    And the response explains the approved next step
    And the response does not expose internal policy implementation details
```

**Pros**
- Reveals ambiguity that prose review misses.
- Builds agreement across roles.
- Produces a direct bridge to testing.
- Helps validate usability, security, and operational behavior early.

**Cons**
- Takes coordination.
- Examples can become too implementation-specific.
- Teams must keep requirements and examples aligned as policy changes.

### When to choose which

- Use **Solution 1** only to capture an initial idea.
- Use **Solution 2** before committing a requirement to delivery.
- Use **Solution 3** for complex, high-value, user-facing, or risk-sensitive behavior.

---

## 5. IEEE 830 and ISO/IEC/IEEE 29148

### Simple explanation

Standards provide a shared vocabulary and structure for requirements engineering.

- **IEEE 830** historically provided recommended practices for software requirements specifications.
- **ISO/IEC/IEEE 29148** provides broader guidance for requirements engineering, including requirements-information items and the characteristics of good requirements.

The practical lesson is not to create a document merely because a standard exists. It is to create requirements that are:
- Structured.
- Complete enough for their risk level.
- Traceable.
- Verifiable.
- Maintained as the product changes.

### Example

A standards-inspired SRS section might include:

```markdown name=srs-appointment-cancellation.md
# 3. Functional Requirements

## SRS-FR-12: Patient cancellation

The system shall allow an authenticated patient to cancel an appointment
only when all of the following conditions are met:

1. The appointment belongs to the authenticated patient.
2. The appointment is eligible according to the clinic cancellation policy.
3. The appointment has not already been cancelled or completed.

### Verification
Automated integration tests and user-acceptance testing.

### Traceability
BR-01: Reduce receptionist workload from cancellation calls.

# 4. Quality Requirements

## SRS-NFR-07: Authorization

The system shall perform server-side authorization before reading or
modifying appointment information.
```

### Problem

Without a common requirements approach, each team may use a different format and quality level.

This can create:
- Missing non-functional requirements.
- Inconsistent requirement wording.
- Weak traceability.
- Unclear verification responsibilities.
- Difficulty working with suppliers, auditors, or regulated stakeholders.

### Solution 1: Use no shared standard or template

Every team writes requirements in its preferred form.

**Pros**
- Flexible.
- Low setup effort.
- Can work for a small team with shared context.

**Cons**
- Inconsistent quality.
- Harder onboarding and cross-team collaboration.
- Difficult to review requirements systematically.
- Important categories such as safety, security, or verification may be missed.
- Supplier and audit communication becomes harder.

**Problem left behind:** Flexibility reduces overhead but makes the quality of requirements dependent on individual habits.

### Solution 2: Adopt a standard template based on established guidance

Create a template with sections such as:
- Purpose and scope.
- Definitions.
- Stakeholders and users.
- Functional requirements.
- External interfaces.
- Data requirements.
- Non-functional requirements.
- Constraints and assumptions.
- Verification approach.
- Traceability.
- Change history.

**Pros**
- Creates consistent documentation.
- Helps teams avoid missing major requirement categories.
- Supports formal review and supplier communication.
- Improves audit readiness.

**Cons**
- Can become document-heavy.
- Teams may apply the same level of formality to trivial and critical changes.
- Templates cannot replace domain understanding or active stakeholder collaboration.

**Problem left behind:** A template provides structure, but it can become bureaucracy unless it is tailored to the product’s risk and delivery model.

### Solution 3: Tailor standards-based practices to the delivery context

Use a lightweight approach for small work and more formal practices for high-risk work.

| Context | Appropriate approach |
|---|---|
| Small internal improvement | User story, acceptance criteria, linked design note |
| Customer-facing feature | PRD, refined stories, NFRs, test evidence |
| Public API or complex integration | Formal interface requirements, security requirements, contract tests |
| Health, finance, safety, or regulated product | Formal SRS, traceability matrix, change control, verification evidence, reviews |

Preserve essential controls at every level:
- Clear requirement ownership.
- Version history.
- Review and approval appropriate to risk.
- Testable acceptance criteria.
- Secure handling of sensitive requirements and design artifacts.
- Traceability for high-impact obligations.

**Pros**
- Balances agility with rigor.
- Reduces waste from unnecessary documentation.
- Keeps requirements useful to the people building and testing the system.
- Supports secure, compliant delivery where needed.

**Cons**
- Requires mature judgment.
- Teams need explicit criteria for deciding the required level of rigor.
- Inconsistent tailoring can create gaps if governance is weak.

### When to choose which

- Use **Solution 1** only for temporary, isolated, low-risk work.
- Use **Solution 2** when consistency, supplier coordination, or formal reviews are required.
- Use **Solution 3** for most organizations: apply standards-inspired structure proportionally to risk, complexity, and regulatory obligations.

---

## 6. Traceability and Change Control

### Simple explanation

**Traceability** connects a requirement to:
- Its source.
- Related requirements.
- Design decisions.
- Code or configuration.
- Tests.
- Release evidence.
- Production metrics, when relevant.

**Change control** ensures requirement changes are reviewed for impact before implementation.

### Example

A clinic changes its cancellation deadline from 24 hours to 12 hours.

The team traces the change to:
- Business policy.
- Patient portal validation.
- Staff portal behavior.
- API rules.
- Reminder text.
- Localization resources.
- Automated tests.
- Support documentation.
- Audit reporting.
- Monitoring dashboards.

### Problem

Without traceability, a small policy change can silently create inconsistent behavior.

For example:
- The portal uses a 12-hour deadline.
- The API still uses 24 hours.
- The reminder email says 48 hours.
- Tests cover only the old rule.
- Support staff follow an outdated process.

### Solution 1: Change the most obvious place

A developer updates one screen or configuration value.

**Pros**
- Fast.
- May be sufficient for a trivial, isolated copy change.
- Minimal process.

**Cons**
- Hidden dependencies are missed.
- Inconsistent behavior can create user harm, support burden, or compliance failures.
- No evidence exists that the full impact was considered.
- Rollback is harder when changes are poorly recorded.

**Problem left behind:** Local changes may appear correct but leave the system inconsistent.

### Solution 2: Maintain a basic traceability matrix

Example:

| Business requirement | Software requirement | Test | Owner |
|---|---|---|---|
| BR-01: Reduce cancellation calls | SRS-FR-12: Patient cancellation | TC-101: Eligible cancellation succeeds | Product / Engineering |
| BR-02: Protect appointment data | SRS-NFR-07: Server authorization | TC-102: Cross-account cancellation denied | Security / Engineering |
| BR-03: Support accessible access | SRS-NFR-08: Keyboard operability | TC-103: Keyboard-only cancellation | Design / QA |

**Pros**
- Helps identify affected requirements and tests.
- Supports audits and regulated delivery.
- Makes ownership clearer.
- Reduces the chance of untested changes.

**Cons**
- Manual matrices become stale.
- Maintaining links takes effort.
- May be excessive for small changes.

**Problem left behind:** A matrix identifies relationships, but the team still needs a disciplined process to assess, approve, implement, and validate changes.

### Solution 3: Apply risk-based change control with automated links where practical

For each meaningful change:
1. Record the requested change and its rationale.
2. Identify affected business, product, software, security, and test requirements.
3. Assess impact on users, privacy, security, performance, cost, and schedule.
4. Obtain appropriate approval.
5. Update linked documents, implementation, tests, and support materials.
6. Validate the change in a suitable environment.
7. Monitor after release and retain evidence according to policy.

Automate links where possible:
- Link work items to pull requests.
- Link tests to requirement identifiers.
- Include requirements in test-report metadata.
- Maintain documentation in version control.
- Require review approvals for high-risk changes.

**Pros**
- Reduces missed impact.
- Produces an auditable change history.
- Makes risk decisions explicit.
- Supports safe rollbacks and incident investigation.

**Cons**
- Requires tooling and governance.
- Can slow urgent work if no expedited path exists.
- Automation does not replace human review of business and security impact.

### When to choose which

- Use **Solution 1** only for trivial, reversible, isolated changes.
- Use **Solution 2** when several requirements or teams depend on the same behavior.
- Use **Solution 3** for production, regulated, security-sensitive, or business-critical changes.

---

# Topic 1.7 Decision Guide

| If you need to… | Use… |
|---|---|
| Explain why the organization should invest in work | BRD or equivalent business-case requirements |
| Define exact, testable system behavior and quality | SRS |
| Avoid confusing goals, policies, constraints, and implementation details | Requirement classification by level and type |
| Improve requirement clarity before development | Quality review plus examples and stakeholder validation |
| Establish consistent requirements documentation practices | A standards-inspired template tailored to risk |
| Demonstrate why a feature exists and how it was verified | End-to-end traceability |
| Change policy or product behavior safely | Risk-based change control |

## How this leads to Topic 1.8

The BRD establishes the business need, and the SRS specifies what software must do to meet it.

The next question is:

> “How do we define the technical boundaries, integrations, data flows, service expectations, compliance needs, and operating environments required to implement the software safely?”

That leads to **1.8 TRD — Technical Requirements Document**.


# 1.8 TRD — Technical Requirements Document

**Goal:** Define the technical conditions needed to build, integrate, secure, deploy, operate, and support the product.

A **Technical Requirements Document (TRD)** translates product and software requirements into technical boundaries and operational expectations.

It answers:

- What technical constraints must the solution respect?
- Which systems must it integrate with?
- What data is processed, stored, and exchanged?
- What reliability, performance, and support commitments apply?
- Which compliance obligations affect the architecture?
- Which environments are required for safe delivery?

A TRD should support implementation without unnecessarily locking the team into a specific design before alternatives are evaluated.

---

## 1. Technical Constraints

### Simple explanation

A **technical constraint** is a required technical boundary. It limits solution choices.

Examples:
- Must use the organization’s identity provider.
- Must run in an approved cloud region.
- Must support specific browser versions.
- Must integrate with an existing database or API.
- Must use a particular deployment platform.
- Must meet a defined latency budget.

### Example

For the clinic platform:

> The patient portal shall integrate with the organization’s OpenID Connect identity provider.

> Production workloads shall run only in approved regions where required patient-data processing is permitted.

> The public portal shall support the current and previous major versions of Chrome, Edge, Firefox, and Safari.

### Problem

Without explicit constraints, teams can select tools or designs that cannot be approved, deployed, supported, or integrated later.

For example:
- The team chooses a cloud service unavailable in the required data-residency region.
- A frontend library does not support required browsers.
- An external API is incompatible with the required authentication model.
- A solution requires privileges that production security policy does not permit.

### Solution 1: Discover constraints during implementation

The team begins with its preferred architecture and learns about restrictions later.

**Pros**
- Fast initial experimentation.
- Can be acceptable for isolated, disposable prototypes.
- Gives developers freedom to explore.

**Cons**
- Creates expensive rework.
- May delay delivery while contracts, access, or security approval are obtained.
- Risks compliance violations.
- Can create conflict among engineering, operations, security, legal, and procurement.

**Problem left behind:** Early speed is lost if an unrecorded constraint makes the chosen approach infeasible.

### Solution 2: Document known technical constraints before design

Record constraints with their source and reason.

| Constraint | Source | Reason |
|---|---|---|
| Use approved identity provider | Security architecture | Centralized account lifecycle and MFA |
| Store regulated data in approved regions | Legal and privacy | Data-residency obligations |
| Use managed secrets service | Security policy | Prevent secrets in source code and configuration |
| Support specified browser versions | Customer contract | Compatibility obligation |
| Deploy through CI/CD pipeline | Operations policy | Auditable, repeatable releases |

**Pros**
- Prevents invalid solution choices.
- Makes architecture discussions more focused.
- Improves estimates and procurement planning.
- Helps security and operations engage early.

**Cons**
- Constraints can become stale.
- Stakeholders may label preferences as mandatory constraints.
- A list alone does not prove that constraints are achievable together.

**Problem left behind:** The team knows the boundaries but still needs to validate high-risk or conflicting constraints.

### Solution 3: Classify and validate constraints

For each constraint, define:
- **Owner:** Who can clarify or change it?
- **Type:** Legal, security, platform, contractual, technical, or preference.
- **Flexibility:** Fixed, temporary, or negotiable.
- **Validation:** How will compliance be proved?
- **Impact:** What happens if it is unmet?

Example:

| Constraint | Fixed? | Validation |
|---|---:|---|
| Data residency | Yes | Cloud architecture and privacy review |
| Existing identity provider | Usually | Integration proof of concept |
| Browser support | Negotiable | Usage analytics and customer agreement |
| Use of a specific database | Often negotiable | Architecture decision record |

**Pros**
- Prevents unnecessary restrictions.
- Makes trade-offs explicit.
- Identifies risky assumptions early.
- Supports change control.

**Cons**
- Requires stakeholder coordination.
- Can surface difficult organizational decisions.
- Some constraints genuinely cannot be changed.

### When to choose which

- Use **Solution 1** only for non-production experiments.
- Use **Solution 2** for ordinary product design.
- Use **Solution 3** for complex, regulated, multi-team, or high-cost initiatives.

---

## 2. Integrations

### Simple explanation

An **integration requirement** defines how the system exchanges data or behavior with another system.

Integrations may involve:
- Identity providers.
- Payment services.
- Email or SMS providers.
- CRM systems.
- Calendar systems.
- Data warehouses.
- Internal APIs.
- Government or regulatory services.

### Example

The appointment platform integrates with:
- An identity provider for authentication.
- A calendar system for clinician availability.
- An SMS provider for reminders.
- An electronic health-record system for appointment synchronization.

### Problem

Without documented integration requirements, teams often make unsafe or unrealistic assumptions:

- “The calendar API will always respond quickly.”
- “The vendor supports our required authentication flow.”
- “The SMS provider can send messages in every target country.”
- “The external system will accept duplicate requests safely.”
- “The other team will deliver the API on time.”

### Solution 1: Define only the external system name

Example:

> Integrate with the clinic calendar system.

**Pros**
- Provides a high-level dependency list.
- Useful for early roadmap discussion.
- Easy to understand.

**Cons**
- Does not define the exchanged data, direction, timing, ownership, error handling, or security model.
- Does not expose version compatibility.
- Does not establish service expectations.
- Leaves engineering and testing with major unknowns.

**Problem left behind:** The team knows an integration exists but not how it must work reliably or securely.

### Solution 2: Define an integration contract

Document:
- Source and destination systems.
- Business purpose.
- Direction of data flow.
- API or protocol.
- Authentication and authorization method.
- Data schema and versioning.
- Rate limits.
- Timeouts and retry behavior.
- Idempotency rules.
- Error handling and reconciliation.
- Monitoring and ownership.

Example:

| Area | Requirement |
|---|---|
| Purpose | Synchronize cancellation status with clinic calendar |
| Direction | Appointment platform → calendar system |
| Authentication | OAuth 2.0 client credentials with scoped permissions |
| Retry | Retry transient failures using bounded exponential backoff |
| Idempotency | Requests must include an idempotency key |
| Timeout | Calendar calls must time out within five seconds |
| Failure handling | Failed synchronization enters a monitored reconciliation queue |
| Logging | Log correlation ID and outcome, not patient details |

**Pros**
- Reduces integration ambiguity.
- Enables contract and integration testing.
- Clarifies cross-team ownership.
- Improves resilience and incident diagnosis.
- Prevents insecure ad hoc authentication patterns.

**Cons**
- Requires coordination with the external-system owner.
- Contracts may change.
- Documentation must remain versioned and current.

**Problem left behind:** A contract describes intended behavior, but it does not prove that the real dependency behaves reliably under production conditions.

### Solution 3: Validate integrations through sandbox testing and operational controls

Use:
- Vendor sandbox or non-production environment.
- Contract tests.
- Synthetic monitoring.
- Rate-limit and timeout tests.
- Failure injection where feasible.
- Reconciliation workflows.
- Versioned API compatibility checks.
- Staged rollout with monitoring.

Security controls:
- Use least-privilege service identities.
- Store credentials in a secrets manager, never source control.
- Rotate credentials and support revocation.
- Validate webhook signatures.
- Use strict allow-lists for callback hosts, ports, and paths.
- Avoid logging tokens, secrets, or sensitive payloads.

**Pros**
- Finds integration failures before broad release.
- Improves reliability and recovery.
- Validates security assumptions.
- Supports safe vendor upgrades and API changes.

**Cons**
- Requires test environments and operational investment.
- Vendor sandboxes may not fully match production.
- Reconciliation logic adds complexity.

### When to choose which

- Use **Solution 1** only for preliminary dependency mapping.
- Use **Solution 2** for every production integration.
- Use **Solution 3** for critical, sensitive, high-volume, or externally controlled integrations.

---

## 3. Data Requirements

### Simple explanation

**Data requirements** define what data the system needs, where it comes from, how it is classified, how long it is retained, who can access it, and how it is protected.

They include:
- Data entities and fields.
- Data ownership.
- Data quality rules.
- Classification.
- Retention and deletion.
- Encryption.
- Access controls.
- Audit needs.
- Data migration.
- Backup and recovery.

### Example

Appointment data may include:

| Data item | Classification | Example rule |
|---|---|---|
| Appointment ID | Internal | Must be unique and immutable |
| Patient contact details | Personal data | Access limited to authorized roles |
| Appointment notes | Sensitive data | Minimize collection and encrypt at rest |
| Cancellation timestamp | Operational/audit data | Retain according to policy |
| Communication consent | Compliance data | Track consent source, version, and withdrawal |

### Problem

Without data requirements, systems tend to collect too much, protect inconsistently, and retain data indefinitely.

This increases:
- Privacy risk.
- Breach impact.
- Storage cost.
- Compliance burden.
- Difficulty deleting or correcting data.
- Inconsistent reports and integrations.

### Solution 1: Let implementation define the data model

Developers create tables and fields as features are built.

**Pros**
- Fast initially.
- Flexible for prototypes.
- Can support rapid experimentation with synthetic data.

**Cons**
- Data definitions become inconsistent.
- Duplicate sources of truth emerge.
- Sensitive fields may be collected without justification.
- Retention, deletion, and access control are often missing.
- Later migrations become expensive.

**Problem left behind:** The system can store data, but it lacks governance, quality rules, and clear ownership.

### Solution 2: Define entities, classification, ownership, and lifecycle

For each data type, document:
- Purpose.
- Source.
- Classification.
- Data owner.
- Allowed consumers.
- Validation rules.
- Retention duration.
- Deletion or anonymization process.
- Backup and recovery requirement.
- Cross-border transfer restrictions.

Example:

| Field | Purpose | Access | Retention |
|---|---|---|---|
| Patient email | Cancellation confirmation | Patient and authorized staff | Per privacy policy |
| Cancellation reason | Operational analysis | Authorized staff | Minimized and time-limited |
| Audit event | Security investigation | Restricted security/operations roles | Per audit policy |

**Pros**
- Supports privacy by design.
- Reduces unnecessary data collection.
- Makes access rules and retention explicit.
- Improves reporting consistency and integration design.
- Helps identify data-protection obligations early.

**Cons**
- Needs input from domain, privacy, security, and operations teams.
- Data policies may differ by jurisdiction.
- Documentation requires maintenance as fields and uses change.

**Problem left behind:** Defined governance is necessary, but the team must still implement technical controls and validate that they work.

### Solution 3: Enforce data requirements through architecture and tests

Apply controls such as:
- Schema validation and database constraints.
- Server-side authorization.
- Encryption in transit and at rest.
- Envelope encryption or managed key services for sensitive data.
- Access logging and audit trails.
- Data minimization.
- Pseudonymization where feasible.
- Retention jobs with monitored deletion outcomes.
- Tested backup restoration.
- Restricted production-data access.
- Sanitized or synthetic data in lower environments.

**Pros**
- Turns policies into enforceable behavior.
- Reduces accidental data exposure.
- Improves integrity and recovery readiness.
- Produces evidence for audits and incident response.

**Cons**
- Adds architecture and operational complexity.
- Encryption and access controls require careful key and permission management.
- Data deletion can be difficult when backups and legal retention interact.

### When to choose which

- Use **Solution 1** only for isolated prototypes using non-sensitive synthetic data.
- Use **Solution 2** for all production systems.
- Use **Solution 3** for any system handling personal, financial, regulated, confidential, or security-relevant data.

---

## 4. SLAs and SLOs

### Simple explanation

A **Service-Level Agreement (SLA)** is an external or contractual commitment, often including remedies or consequences.

A **Service-Level Objective (SLO)** is an internal reliability target that guides engineering and operations.

A **Service-Level Indicator (SLI)** is the metric used to measure them.

Example:
- **SLI:** Percentage of successful appointment-cancellation requests.
- **SLO:** 99.9% successful requests in a rolling 30-day period.
- **SLA:** Contractual commitment that the service will meet 99.5% monthly availability.

### Problem

Without defined service expectations, teams and customers have different assumptions:

- Users expect 24/7 availability.
- Engineering assumes planned maintenance is acceptable.
- Support does not know who responds to incidents.
- Product cannot decide whether reliability work outranks new features.
- Customers cannot assess whether the service meets their needs.

### Solution 1: Use vague reliability wording

Examples:
- The system should be highly available.
- The service should be reliable.
- Outages should be minimized.

**Pros**
- Easy to state.
- Useful as an early aspiration.
- Requires no measurement design.

**Cons**
- Not testable.
- Does not define acceptable downtime.
- Does not define which user journeys matter most.
- Creates disputes during incidents.
- Offers no basis for capacity or resilience investment.

**Problem left behind:** Everyone agrees reliability matters, but no one shares a measurable definition of acceptable service.

### Solution 2: Define measurable SLOs and SLIs

Example:

| Service journey | SLI | SLO |
|---|---|---|
| Appointment search | Percentage of successful requests under one second | 99% over 30 days |
| Cancellation | Percentage of successful eligible cancellations | 99.9% over 30 days |
| Notification processing | Percentage of notifications processed within five minutes | 99.5% over 30 days |
| Data recovery | Recovery-point objective | No more than 15 minutes of data loss |

Also define:
- Measurement window.
- Excluded events.
- Dependency treatment.
- Alert thresholds.
- Ownership.

**Pros**
- Makes reliability measurable.
- Supports monitoring and incident priorities.
- Helps teams balance feature work against service health.
- Creates clear operational expectations.

**Cons**
- Requires instrumentation and trustworthy data.
- Targets can be unrealistic or too weak.
- Measuring only availability can hide slow or degraded user experience.

**Problem left behind:** SLOs measure service health, but customer contracts and critical incidents require clear external commitments and response processes.

### Solution 3: Use SLOs internally and SLAs externally, with error budgets and incident processes

Use:
- **SLOs** to guide engineering reliability decisions.
- **SLAs** only when legal, commercial, and support commitments are clear.
- **Error budgets** to decide when reliability work should pause risky feature delivery.
- Incident severity definitions, escalation paths, communication expectations, and post-incident reviews.

Example:

> If the cancellation-success SLO exceeds its error budget, the team pauses non-essential releases affecting that workflow until reliability is restored.

Security considerations:
- Do not expose internal infrastructure details in public status messages.
- Ensure incident communication does not disclose sensitive data.
- Restrict access to observability systems using least privilege.
- Preserve audit logs needed for investigation.

**Pros**
- Connects reliability targets to real operational decisions.
- Avoids making unsupported contractual promises.
- Encourages proactive reliability work.
- Improves incident response and customer trust.

**Cons**
- Requires organizational maturity.
- Error-budget policies need leadership support.
- SLAs may impose financial or legal obligations.

### When to choose which

- Use **Solution 1** only during early discovery.
- Use **Solution 2** for any important production service.
- Use **Solution 3** for customer-facing, business-critical, regulated, or contract-backed services.

---

## 5. Compliance Requirements

### Simple explanation

**Compliance requirements** define obligations from laws, regulations, contracts, policies, and industry standards.

Examples can include:
- Privacy and data-protection laws.
- Accessibility obligations.
- Financial controls.
- Healthcare regulations.
- Data-residency requirements.
- Records-retention rules.
- Security certifications.
- Contractual customer commitments.

Compliance is not a feature added at the end. It affects requirements, architecture, data design, operations, logging, and vendor selection.

### Example

For personal appointment data, the TRD might require:

- Personal data is processed only for documented purposes.
- Access is role-based and logged.
- Data is encrypted in transit and at rest.
- Production data is not copied into local developer environments.
- Users can exercise applicable access, correction, and deletion rights.
- Incident-response processes support required notification timelines.
- Vendors processing personal data are approved before use.

### Problem

Without compliance requirements, teams may discover too late that:
- Required records are not retained.
- Data is stored in an unapproved region.
- Access cannot be audited.
- A vendor agreement is missing.
- The system cannot support data-subject requests.
- Accessibility barriers prevent lawful or equitable access.

### Solution 1: Treat compliance as a final approval step

The team builds the product and submits it for review near release.

**Pros**
- Appears to reduce early overhead.
- May work for a low-risk internal prototype.

**Cons**
- Compliance findings can require major redesign.
- Release dates may be missed.
- Teams may take unsafe shortcuts under pressure.
- Legal, privacy, and security specialists have little opportunity to influence design.
- The organization may incur regulatory or contractual risk.

**Problem left behind:** Late review detects problems but does not prevent architecture from embedding non-compliant assumptions.

### Solution 2: Add a compliance checklist to the TRD

Examples:
- Data classification completed.
- Approved hosting region selected.
- Vendor security review completed.
- Accessibility standard identified.
- Retention policy defined.
- Audit-log requirements identified.
- Privacy notice and consent requirements reviewed.

**Pros**
- Makes obligations visible early.
- Helps teams involve appropriate specialists.
- Provides a repeatable baseline.
- Supports release readiness.

**Cons**
- Checklists can become superficial.
- They may miss product-specific risks.
- Checking a box does not prove controls work in production.

**Problem left behind:** A checklist identifies expected obligations, but critical workflows still need risk-based analysis and technical verification.

### Solution 3: Build compliance controls into the design and delivery lifecycle

For material obligations:
1. Identify the legal, contractual, or policy source.
2. Translate it into technical and operational requirements.
3. Assign an accountable owner.
4. Define evidence and verification.
5. Review changes that affect compliance.
6. Monitor controls in production where relevant.

Example:

| Obligation | Technical requirement | Evidence |
|---|---|---|
| Data residency | Store regulated data only in approved regions | Infrastructure configuration and deployment review |
| Access accountability | Log privileged access to sensitive records | Audit-log review and test evidence |
| Retention | Delete expired data according to policy | Scheduled-job monitoring and deletion reports |
| Accessibility | Meet applicable accessibility criteria | Automated checks, manual tests, and user validation |

**Pros**
- Prevents compliance from becoming a release-time surprise.
- Produces usable evidence.
- Connects obligations to real controls.
- Improves security, privacy, accessibility, and operational maturity.

**Cons**
- Requires specialist involvement.
- Regulations can be complex and jurisdiction-specific.
- Evidence collection and periodic reviews create ongoing work.

### When to choose which

- Avoid **Solution 1** for production systems.
- Use **Solution 2** as a baseline for routine initiatives.
- Use **Solution 3** for regulated, customer-facing, sensitive-data, contractual, or high-impact systems.

---

## 6. Environments

### Simple explanation

An **environment** is an isolated deployment context used for a different stage of delivery.

Typical environments include:
- **Local development:** Individual developer work.
- **Development/shared integration:** Early integration testing.
- **Test or QA:** Repeatable functional and regression testing.
- **Staging/pre-production:** Production-like validation.
- **Production:** Live customer service.
- **Disaster-recovery environment:** Used to validate recovery capability, where justified.

### Example

| Environment | Purpose | Data policy |
|---|---|---|
| Local | Developer testing | Synthetic data only |
| Development | Shared integration | Synthetic or anonymized data |
| Test | Automated and exploratory tests | Controlled test data |
| Staging | Production-like release validation | Sanitized data where necessary |
| Production | Live service | Real data, strict access controls |

### Problem

Without clear environment requirements, teams may:
- Test directly in production.
- Use production data in development systems.
- Configure environments manually and inconsistently.
- Discover deployment issues only after release.
- Give excessive environment access to too many people.

### Solution 1: Use local development and production only

Developers test locally, then deploy directly to production.

**Pros**
- Lowest immediate infrastructure cost.
- Fast for a tiny internal tool.
- Fewer systems to maintain.

**Cons**
- High production risk.
- Local behavior may differ from production.
- No safe place for integration, security, migration, or load testing.
- Rollbacks and incident recovery are harder.
- Encourages unsafe use of production data and credentials.

**Problem left behind:** Simple environments reduce setup effort but make every deployment a high-risk experiment.

### Solution 2: Create separate development, test, staging, and production environments

Define each environment’s:
- Purpose.
- Data classification.
- Access model.
- Configuration source.
- Deployment route.
- Test expectations.
- Change controls.

**Pros**
- Enables safer testing and release validation.
- Reduces direct production experimentation.
- Supports role separation and least privilege.
- Helps detect configuration and migration issues before release.

**Cons**
- Costs more to operate.
- Configuration drift can occur.
- Teams may make staging too different from production.
- More environments can slow delivery if promotions are manual.

**Problem left behind:** Separate environments improve safety, but inconsistency and manual configuration can still cause production-only failures.

### Solution 3: Use environment parity, infrastructure-as-code, and secure promotion pipelines

Apply:
- Infrastructure-as-code reviewed in version control.
- Automated environment provisioning.
- Configuration stored separately from code.
- Secrets stored in environment-specific secrets management.
- Controlled deployment promotions.
- Database migration testing.
- Feature flags for gradual exposure.
- Production-like staging where the risk justifies it.
- Synthetic or sanitized test data.
- Least-privilege access and audited break-glass procedures.

Example promotion flow:

```text
Pull request
  → automated tests and security scans
  → development deployment
  → integration and acceptance tests
  → staging validation
  → approved production deployment
  → monitoring and rollback readiness
```

**Pros**
- Reduces configuration drift.
- Improves repeatability and auditability.
- Protects secrets and production data.
- Enables safer, more frequent releases.
- Supports rollback and progressive delivery.

**Cons**
- Requires automation and platform investment.
- Infrastructure-as-code must itself be secured and reviewed.
- Feature flags, pipelines, and environment management add operational complexity.

### When to choose which

- Use **Solution 1** only for disposable, non-sensitive experiments.
- Use **Solution 2** for ordinary production applications.
- Use **Solution 3** for services requiring repeatable, secure, reliable delivery.

---

# Topic 1.8 Decision Guide

| If you need to… | Use… |
|---|---|
| Prevent architecture choices that cannot be approved or deployed | Document and validate technical constraints |
| Connect safely and reliably to other systems | Versioned integration contracts, sandbox validation, and monitoring |
| Control sensitive, regulated, or business-critical information | Data classification, lifecycle requirements, and technical enforcement |
| Define reliability targets and service commitments | SLIs, SLOs, and—where justified—SLAs |
| Turn laws, policies, and contracts into buildable controls | Risk-based compliance requirements with evidence |
| Test and release safely without exposing production data | Segregated environments, infrastructure-as-code, and controlled pipelines |

## How this leads to Topic 1.9

The TRD establishes the technical boundaries, operational conditions, data rules, integrations, and environments needed to build the system safely.

The next question is:

> “How do we ensure every requirement is clear, testable, traceable, versioned, and safely changed over time?”

That leads to **1.9 Requirements Quality**.

# 1.9 Requirements Quality

**Goal:** Ensure requirements are clear, valuable, feasible, testable, traceable, and safely managed as the product changes.

A requirement is only useful if the team can understand it consistently, implement it correctly, verify it objectively, and update it without losing important context.

This topic covers:

1. Ambiguity.
2. INVEST.
3. Traceability matrix.
4. Change control.
5. Versioning.

---

## 1. Ambiguity

### Simple explanation

A requirement is **ambiguous** when different people can interpret it differently.

Ambiguous words often include:

- Fast.
- Easy.
- Secure.
- User-friendly.
- Reliable.
- Flexible.
- Appropriate.
- Quickly.
- Supported.
- Minimal.
- As needed.

These words are not automatically wrong, but they need measurable context.

### Example

Ambiguous:

> The booking page must load quickly.

Different interpretations:
- Product manager: under three seconds.
- Developer: faster than the current page.
- User: fast enough on a mobile connection.
- Operations team: p95 response under one second.
- Accessibility specialist: usable before every nonessential asset has loaded.

Improved:

> Under expected peak load, the booking page shall become interactive within 2.5 seconds at the 95th percentile on supported devices and network conditions defined in the performance test plan.

### Problem

Ambiguity causes late disagreement:

- Engineering implements one interpretation.
- QA tests another.
- Product expects a third.
- Users experience a fourth.

This leads to rework, defects, missed deadlines, and unsafe gaps. In security-sensitive areas, ambiguity can become a vulnerability.

For example:

> “Only appropriate staff may view appointments.”

Questions left unanswered:
- Which roles are appropriate?
- Is access based on clinic, patient relationship, or assigned appointment?
- Does a temporary staff member qualify?
- Are emergency overrides permitted?
- Must access be logged?
- What should happen when authorization cannot be determined?

### Solution 1: Accept broad statements as final requirements

Example:

> The application must be secure and easy to use.

**Pros**
- Quick to write.
- Communicates broad intent.
- Useful during early exploration.

**Cons**
- Cannot be tested objectively.
- Encourages inconsistent implementation.
- Makes acceptance subjective.
- Can hide critical omissions.
- Provides weak evidence for compliance or audits.

**Problem left behind:** Broad intent is useful, but it does not define the behavior or quality the team must deliver.

### Solution 2: Replace vague terms with measurable conditions

Improve the requirement by specifying:

- Actor.
- Context.
- Trigger.
- Expected behavior.
- Boundaries.
- Measurable outcome.
- Failure behavior.
- Verification method.

Example:

> The system shall allow only authenticated users assigned to the same clinic as an appointment to view its details. The system shall enforce this authorization on the server for every request and shall record denied access attempts without logging appointment content.

**Pros**
- Reduces interpretation differences.
- Enables test design.
- Clarifies ownership and security boundaries.
- Supports consistent implementation.

**Cons**
- Requires more analysis.
- Not every quality characteristic can be reduced to one number.
- Overly detailed wording can become difficult to read.

**Problem left behind:** A precise statement improves clarity, but important behavior often still needs examples to reveal edge cases.

### Solution 3: Validate wording with examples and reviews

Use:
- Given/When/Then scenarios.
- User-journey walkthroughs.
- Prototype reviews.
- Threat modeling.
- Accessibility reviews.
- Test-case reviews.

```gherkin name=appointment-authorization.feature
Feature: Appointment authorization

  Scenario: Staff member views an appointment in their clinic
    Given an authenticated receptionist is assigned to Clinic A
    And an appointment belongs to Clinic A
    When the receptionist requests the appointment details
    Then the system returns the authorized appointment details

  Scenario: Staff member attempts to view another clinic's appointment
    Given an authenticated receptionist is assigned to Clinic A
    And an appointment belongs to Clinic B
    When the receptionist requests the appointment details
    Then the system denies access
    And the response does not reveal appointment information
    And the denied request is recorded according to the audit policy
```

**Pros**
- Reveals misunderstandings before coding.
- Covers normal and failure paths.
- Creates a direct path to automated and manual testing.
- Improves shared understanding across product, engineering, QA, and security.

**Cons**
- Requires collaboration time.
- Examples need maintenance as policies change.
- Teams can create too many low-value scenarios if they do not prioritize risk.

### When to choose which

- Use **Solution 1** only to capture early intent.
- Use **Solution 2** before planning or implementing work.
- Use **Solution 3** for complex, sensitive, high-risk, or user-facing requirements.

---

## 2. INVEST for User Stories

### Simple explanation

**INVEST** is a checklist for assessing whether a user story is ready to be refined and delivered.

| Letter | Meaning | Question |
|---|---|---|
| I | Independent | Can this be delivered with minimal dependency on other stories? |
| N | Negotiable | Does it describe an outcome rather than dictate every implementation detail? |
| V | Valuable | Does it create value for a user, business, or required risk reduction? |
| E | Estimable | Does the team understand it well enough to estimate? |
| S | Small | Can it be delivered and validated within a short iteration? |
| T | Testable | Can the team objectively verify it is complete? |

### Example

Weak story:

> As a user, I want a complete appointment-management system with booking, cancellation, rescheduling, payments, reminders, calendar synchronization, and reporting.

This is not small, estimable, independent, or easily testable.

Improved stories:
1. As a patient, I want to view my eligible upcoming appointments so that I can identify the one I need to cancel.
2. As a patient, I want to cancel an eligible appointment that I own so that I can free the slot without calling.
3. As a receptionist, I want to see cancellation status so that I can contact patients on the waiting list.

### Problem

A backlog can contain stories that appear user-centered but still create delivery problems:

- Too large to estimate.
- Coupled to many other stories.
- Too vague to test.
- Technically prescriptive.
- Missing actual user or business value.

These stories create unpredictable delivery and increase the chance of work being “almost done” for long periods.

### Solution 1: Treat every user-story sentence as delivery-ready

Example:

> As a patient, I want appointment management.

**Pros**
- Fast backlog creation.
- Easy to understand at a high level.
- Useful as an idea or epic title.

**Cons**
- Too broad for delivery.
- Does not identify a usable increment.
- Lacks acceptance conditions.
- Hides dependencies, policies, and risks.
- Cannot be estimated reliably.

**Problem left behind:** A simple story format does not automatically make an item small, valuable, or testable.

### Solution 2: Review stories against INVEST

Refine the story by asking:

- **Independent:** Can the story be sliced differently to reduce coupling?
- **Negotiable:** Does it express a need rather than a database, API, or UI mandate?
- **Valuable:** Who benefits, and what changes for them?
- **Estimable:** What is unknown? Do we need research or a technical spike?
- **Small:** Can it be completed in one iteration?
- **Testable:** What acceptance criteria prove success?

**Pros**
- Improves backlog quality.
- Reveals missing discovery and dependencies.
- Encourages vertical, outcome-based slices.
- Helps teams plan more reliably.

**Cons**
- Not every story can be fully independent.
- Some essential infrastructure, migration, or security work does not fit neatly as a user story.
- Teams can misuse INVEST as a rigid rule rather than a conversation guide.

**Problem left behind:** INVEST improves individual story quality, but related stories still need to be organized into a coherent journey and technical plan.

### Solution 3: Use INVEST with story mapping, technical work, and risk controls

Keep user stories focused on outcomes, while explicitly tracking supporting work:

| Item type | Example |
|---|---|
| User story | Patient cancels an eligible owned appointment |
| Security requirement | Server-side authorization is required for every cancellation request |
| Technical task | Add transaction handling to prevent conflicting appointment updates |
| Research spike | Validate calendar-provider behavior during concurrent updates |
| Operational task | Add a dashboard for cancellation failure rates |

A secure story should never defer essential controls to a later “security story” if the feature cannot be safe without them.

**Pros**
- Preserves user value while making technical and security work visible.
- Reduces hidden dependencies.
- Supports realistic planning.
- Avoids treating accessibility, observability, and security as optional follow-up work.

**Cons**
- Requires disciplined backlog management.
- More item types can feel complex.
- Teams must ensure technical tasks remain connected to product outcomes.

### When to choose which

- Use **Solution 1** for early idea capture only.
- Use **Solution 2** for routine backlog refinement.
- Use **Solution 3** for meaningful delivery work involving technical, security, operational, or compliance dependencies.

---

## 3. Traceability Matrix

### Simple explanation

A **traceability matrix** records relationships between requirements and the evidence that they were designed, built, tested, and released correctly.

It answers:

> “Why does this requirement exist, where is it implemented, and how do we know it works?”

Typical traceability links include:

```text
Business objective
  → Product requirement
    → Software requirement
      → Design decision
        → User story / implementation
          → Test case
            → Release and operational evidence
```

### Example

| Business ID | Software requirement | Design / story | Test | Evidence |
|---|---|---|---|---|
| BR-01: Reduce manual cancellations | SRS-FR-12: Patient can cancel eligible owned appointment | US-34: Patient cancellation flow | TC-112: Eligible cancellation succeeds | CI result and release record |
| BR-02: Protect patient data | SRS-NFR-07: Server-side authorization | ADR-08: Authorization policy | TC-113: Cross-account cancellation denied | Security test report |
| BR-03: Support accessible booking | SRS-NFR-08: Keyboard operation | US-35: Accessible cancellation controls | TC-114: Keyboard-only completion | Accessibility review |

### Problem

Without traceability, teams struggle to answer:

- Why is this feature needed?
- Which requirements are affected by a policy change?
- Have all critical requirements been tested?
- Which test evidence supports release approval?
- Is a reported defect linked to a requirement gap?
- Which compliance obligation requires this control?

This is especially dangerous when requirements affect money, privacy, access control, safety, contracts, or regulations.

### Solution 1: Keep requirements, code, and tests separate

Requirements live in documents, implementation lives in source control, and tests live in a test tool—with no links between them.

**Pros**
- Low setup cost.
- Allows each team to use preferred tools.
- May be sufficient for a tiny, short-lived project.

**Cons**
- Changes are hard to assess.
- Tests can become disconnected from requirements.
- Audits and release reviews require manual investigation.
- Important requirements can be missed.
- Teams may not know whether a feature was deliberately omitted or accidentally forgotten.

**Problem left behind:** Separate artifacts are manageable initially but fail to provide confidence as complexity grows.

### Solution 2: Maintain a manual traceability matrix

Create a table linking requirements, stories, and tests.

**Pros**
- Makes relationships visible.
- Supports impact analysis.
- Works with simple documentation tools.
- Useful in regulated or contractual projects.

**Cons**
- Easily becomes outdated.
- Adds manual maintenance burden.
- Can become too detailed to use effectively.
- Errors in the matrix can create false confidence.

**Problem left behind:** A manual matrix improves visibility but may not stay accurate as delivery accelerates.

### Solution 3: Automate links where practical and apply traceability by risk

Use tooling and conventions to connect:
- Requirement IDs in backlog items.
- Pull requests to work items.
- Automated tests to requirement identifiers.
- Release records to pull requests and test results.
- Incident tickets to impacted services and requirements.

Use stronger traceability for:
- Security controls.
- Privacy requirements.
- Regulatory obligations.
- Contractual commitments.
- Financial transactions.
- Safety-critical behavior.
- Complex integrations.

Use lighter traceability for:
- Minor UI wording changes.
- Low-risk internal improvements.
- Easily reversible experiments.

**Pros**
- Reduces manual effort.
- Improves change impact analysis.
- Produces stronger audit and release evidence.
- Helps prevent untested high-risk requirements.
- Supports incident investigation and root-cause analysis.

**Cons**
- Requires tool integration and conventions.
- Automation can link the wrong items if identifiers are misused.
- Excessive traceability creates bureaucracy and reduces adoption.

### When to choose which

- Use **Solution 1** only for minimal, isolated work.
- Use **Solution 2** when a project needs straightforward evidence but lacks integrated tooling.
- Use **Solution 3** for production systems, shared platforms, regulated work, or important security and compliance requirements.

---

## 4. Change Control

### Simple explanation

**Change control** is the process for evaluating, approving, implementing, validating, and communicating a change to requirements.

It does not mean rejecting change. It means making the impact of change explicit before committing effort or introducing risk.

### Example

A clinic changes its policy:

> Patients may now cancel up to 12 hours before an appointment instead of 24 hours.

This could affect:
- Patient portal behavior.
- Mobile experience.
- API validation.
- Staff workflows.
- Reminder messages.
- Calendar integration.
- Automated tests.
- Accessibility labels and error explanations.
- Support documentation.
- Metrics and reporting.
- Audit rules.

### Problem

Without change control, requirement changes appear informally in messages or meetings and are implemented only partially.

This can cause:
- Inconsistent behavior across channels.
- Missed security or privacy review.
- Broken integrations.
- Outdated tests and documentation.
- Unclear accountability.
- Unsafe emergency changes.

### Solution 1: Change requirements informally

A stakeholder sends a message:

> “Please change the deadline to 12 hours.”

A developer updates the first visible rule.

**Pros**
- Fast.
- Minimal administrative effort.
- Can be suitable for a trivial, isolated, reversible correction.

**Cons**
- Hidden impacts are missed.
- No clear record of why the change occurred.
- QA may not know what to test.
- Documentation and support content may remain wrong.
- A security, compliance, or operational consequence may be overlooked.

**Problem left behind:** Speed is achieved by shifting risk into production and future maintenance.

### Solution 2: Use a change request with impact review

A change request includes:
- Requested change.
- Business rationale.
- Priority and deadline.
- Affected requirements.
- User and operational impact.
- Security, privacy, accessibility, and performance impact.
- Estimate.
- Owner and approval.
- Validation and rollout plan.

**Pros**
- Makes decisions transparent.
- Identifies affected systems and tests.
- Improves planning and communication.
- Supports auditability.
- Reduces accidental scope expansion.

**Cons**
- Can be too slow for urgent incidents.
- Creates overhead for low-risk work.
- Quality depends on reviewers understanding the actual system.

**Problem left behind:** A formal review improves safety, but teams need proportionality and an expedited path for production incidents.

### Solution 3: Apply risk-based change control with emergency safeguards

Use different levels of review:

| Change type | Example | Control level |
|---|---|---|
| Low risk | Correct a typo in help text | Peer review and standard deployment |
| Moderate risk | Change standard cancellation deadline | Requirement impact review, tests, staged rollout |
| High risk | Change authorization policy | Security review, test evidence, approval, monitoring, rollback plan |
| Emergency | Patch an actively exploited vulnerability | Expedited approval, logged rationale, rapid deployment, post-change review |

For emergency production changes:
- Use least-privilege emergency access.
- Require an auditable change record.
- Avoid bypassing validation unless immediate harm makes it unavoidable.
- Create follow-up work for tests, documentation, root-cause analysis, and permanent remediation.
- Remove temporary permissions promptly.

**Pros**
- Balances speed and safety.
- Gives urgent production work a defined path.
- Makes high-risk changes appropriately visible.
- Encourages post-release monitoring and rollback readiness.

**Cons**
- Requires clear risk criteria.
- Stakeholders may label ordinary requests “urgent.”
- Needs governance and leadership support.

### When to choose which

- Use **Solution 1** only for trivial, isolated, easily reversible changes.
- Use **Solution 2** for normal requirement changes.
- Use **Solution 3** for production systems, sensitive data, authorization changes, regulated work, and incident response.

---

## 5. Versioning

### Simple explanation

**Versioning** records how a requirement, document, API, policy, or product behavior changes over time.

Versioning answers:

- Which version is currently approved?
- What changed?
- Why did it change?
- Who approved it?
- Which release implements the change?
- Which old behavior remains supported, and until when?

### Example

| Version | Date | Change | Reason |
|---|---|---|---|
| 1.0 | 2026-10-01 | Patients can cancel more than 24 hours before appointment time | Initial release |
| 1.1 | 2026-11-15 | Clinic-specific cancellation deadlines supported | Business policy variation |
| 1.2 | 2026-12-10 | Unauthorized cancellation attempts must create audit events | Security review finding |

### Problem

Without versioning, teams may work from conflicting copies:

- Product reads an older PRD.
- Engineering follows a changed ticket.
- QA uses an old acceptance test.
- Support follows an outdated policy.
- A customer integration uses a retired API behavior.

This creates defects and makes incident investigation difficult.

### Solution 1: Replace documents without recording history

The team edits a document in place and keeps no change history.

**Pros**
- Simple.
- Low overhead.
- Might work for a personal note or disposable prototype.

**Cons**
- Cannot identify when or why behavior changed.
- Rollback is difficult.
- Reviews and approvals are not auditable.
- Users may rely on obsolete exports or copies.
- Conflicting versions proliferate.

**Problem left behind:** The current document may look correct, but the organization loses essential decision history.

### Solution 2: Use manual version numbers and change logs

Example:

```markdown name=requirements-changelog.md
# Requirements Change Log

## Version 1.2 — 2026-12-10
- Added audit-event requirement for denied cancellation attempts.
- Updated authorization acceptance criteria.
- Approved by Security and Product.

## Version 1.1 — 2026-11-15
- Added clinic-specific cancellation deadlines.
- Updated patient portal and API requirements.
```

**Pros**
- Makes changes visible.
- Supports basic review and communication.
- Works in documents, wikis, or shared storage.
- Useful when regulated records require explicit approval history.

**Cons**
- Manual version updates are easy to forget.
- Copies can still diverge.
- Diffing complex documents may be difficult.
- A change log does not automatically connect to code and tests.

**Problem left behind:** Manual versioning creates history, but teams need reliable collaboration and links to delivery artifacts.

### Solution 3: Use version control and compatibility policies

Store requirements and technical artifacts in a controlled system with:
- Version history.
- Named owners.
- Review and approval workflows.
- Immutable release tags where appropriate.
- Links to pull requests, tests, and deployments.
- Clear compatibility and deprecation policies.

For APIs, define:
- Versioning approach.
- Backward compatibility expectations.
- Deprecation period.
- Migration guidance.
- Security update policy.
- Client communication plan.

Example:

> API version `v1` remains supported for 12 months after `v2` becomes generally available, except when a critical security vulnerability requires accelerated retirement. Breaking changes require a new version or documented migration path.

**Pros**
- Creates reliable history and review evidence.
- Supports collaboration and rollback.
- Makes differences between versions visible.
- Enables safer API evolution.
- Helps teams coordinate requirements, code, tests, and releases.

**Cons**
- Requires process and tool adoption.
- Versioning strategies can become complex.
- Supporting older interfaces increases maintenance and security exposure.

### When to choose which

- Use **Solution 1** only for temporary personal working notes.
- Use **Solution 2** for small teams or formal documents that need a visible approval record.
- Use **Solution 3** for shared product documentation, APIs, production systems, and requirements with audit or release implications.

---

## 6. Requirement Validation

### Simple explanation

**Requirement validation** checks whether the team has documented the *right* requirements before building them.

It differs from verification:

- **Validation:** Are we solving the right problem?
- **Verification:** Did we build the requirement correctly?

### Example

A team verifies that the cancellation button works exactly as specified.

But validation reveals a more important issue: patients do not find the cancellation link because it is buried in a reminder email. The software requirement was implemented correctly, but it did not fully solve the user problem.

### Problem

Teams may write precise, testable requirements that are still wrong, unnecessary, or low-value.

Examples:
- A feature is based on one loud stakeholder request.
- A policy was misunderstood.
- The user problem has changed.
- A new solution creates more friction than the original process.
- The implementation is compliant with the written requirement but not with the actual law or contract.

### Solution 1: Validate only after implementation

Release the feature and see whether users complain.

**Pros**
- Produces real-world evidence.
- Avoids excessive up-front analysis.
- Can work for low-risk, easily reversible experiments.

**Cons**
- High-cost or harmful mistakes reach users.
- Security, privacy, compliance, and accessibility defects may be unacceptable to release.
- Rework is more expensive after design and implementation.
- Customer trust can be damaged.

**Problem left behind:** Production feedback is valuable, but it is an unsafe first validation step for many requirements.

### Solution 2: Review requirements with stakeholders before implementation

Review:
- Problem statement.
- Scope and non-scope.
- User journeys.
- Business rules.
- Acceptance criteria.
- Constraints.
- Risks.

**Pros**
- Finds misunderstandings earlier.
- Builds stakeholder agreement.
- Relatively low cost.
- Supports formal approvals where required.

**Cons**
- Stakeholders may agree without representing real users.
- Reviews can become passive sign-off exercises.
- It does not test usability or technical feasibility.

**Problem left behind:** Agreement is helpful but does not prove that users can understand or successfully use the planned solution.

### Solution 3: Validate requirements through evidence and experiments

Use appropriate methods:
- User interviews and observation.
- Clickable prototypes.
- Usability testing.
- Technical proof-of-concepts.
- Threat modeling.
- Data and analytics review.
- Small pilot releases.
- Controlled rollout.
- Accessibility testing with representative users.

**Pros**
- Tests assumptions before large investment.
- Reveals usability and feasibility problems early.
- Builds stronger evidence for prioritization.
- Reduces risk of building the wrong solution.

**Cons**
- Takes time and coordination.
- Research samples can be limited.
- Experiments must protect participant privacy and avoid misleading users.
- Not every uncertainty can be eliminated before delivery.

### When to choose which

- Use **Solution 1** only for low-risk, reversible learning experiments with safe rollout controls.
- Use **Solution 2** for all meaningful requirements.
- Use **Solution 3** for new workflows, large investments, uncertain assumptions, and high-impact or user-facing changes.

---

# Topic 1.9 Decision Guide

| If you need to… | Use… |
|---|---|
| Remove unclear language from requirements | Measurable wording plus examples |
| Determine whether a user story is ready for delivery | INVEST refinement |
| Show why a requirement exists and prove it was tested | Risk-based traceability |
| Safely modify an approved requirement | Change control with impact analysis |
| Prevent teams from working from conflicting requirements | Version control, change logs, and approval history |
| Confirm that a requirement solves a real user or business problem | Stakeholder review plus research, prototypes, or pilots |

## How this leads to Topic 1.10

Requirements quality ensures the team has a clear, testable, traceable, and change-controlled understanding of the work.

The next question is:

> “How much work will this take, which risks may affect delivery, and how should the team sequence work toward an MVP and roadmap?”

That leads to **1.10 Estimation and Planning**.

# 1.10 Estimation and Planning

**Goal:** Make informed delivery decisions under uncertainty: estimate effort, sequence work, reduce risk, define a viable first release, and communicate a realistic plan.

Planning does not eliminate uncertainty. It makes uncertainty visible so the team can learn, adapt, and avoid false commitments.

This topic covers:

1. Story points.
2. T-shirt sizing.
3. PERT estimation.
4. Roadmaps.
5. Minimum Viable Product (MVP).
6. Risk registers.

---

## 1. Story Points

### Simple explanation

**Story points** are a relative estimate of a backlog item’s overall size. They usually reflect:

- Complexity.
- Amount of work.
- Uncertainty.
- Risk.
- Dependencies.

They do **not** represent hours or individual productivity.

A team might decide:
- A simple content change = 1 point.
- A standard validated form change = 3 points.
- A new workflow with integration and security rules = 8 points.
- A poorly understood cross-system capability = too large or uncertain to estimate; investigate first.

### Example

For an appointment platform:

| Story | Relative size | Why |
|---|---:|---|
| Update confirmation-email wording | 1 | Small isolated content change |
| Add cancellation-reason options | 3 | UI, validation, storage, reporting |
| Patient self-service cancellation | 5 | Authorization, policy validation, audit trail, UI, tests |
| Synchronize cancellations with external calendar | 8 | Third-party integration, retries, reconciliation, monitoring |
| Replace identity provider | Too uncertain | Requires discovery before estimation |

### Problem

Teams often estimate in hours too early:

> “This will take two days.”

That estimate may ignore:
- Requirement ambiguity.
- Security review.
- Accessibility work.
- Testing.
- Dependencies.
- Environment issues.
- Integration behavior.
- Code review and release work.
- Operational monitoring.

The estimate becomes a promise even when it was based on incomplete knowledge.

### Solution 1: Estimate directly in hours

Example:

> Add appointment cancellation: 16 hours.

**Pros**
- Easy for stakeholders to understand.
- Useful for small, familiar, isolated tasks.
- Can support short-term capacity planning.

**Cons**
- Creates false precision.
- Encourages comparison between individuals.
- Ignores uncertainty and risk.
- Can cause pressure to cut testing, security, or documentation when the estimate is wrong.
- Treats complex work as predictable before it is understood.

**Problem left behind:** Hours may be necessary for calendar planning, but they are often a poor first tool for estimating uncertain product work.

### Solution 2: Estimate relatively with story points

Compare each story to a known reference story.

For example:

> “Adding a validated text field with tests is our 2-point reference. Is cancellation more or less complex than that?”

Teams often use a scale such as:

```text
1, 2, 3, 5, 8, 13, 21
```

The gaps grow intentionally. If the team cannot distinguish between 13 and 14 points, the estimate is too precise to be meaningful.

**Pros**
- Reflects uncertainty and complexity.
- Encourages team discussion.
- Reduces focus on individual speed.
- Helps identify stories that should be split or researched.
- Supports forecasting based on the team’s historical throughput.

**Cons**
- Does not directly answer “when will it be done?”
- Different teams’ points are not comparable.
- Can be misused as a productivity target.
- Requires stable enough team practices to make historical data useful.

**Problem left behind:** Relative sizing improves estimates, but a large or unknown story still needs decomposition or research before the team can plan it safely.

### Solution 3: Use story points with refinement, splitting, and empirical forecasting

Use the process:

1. Refine the requirement and acceptance criteria.
2. Identify dependencies, security concerns, and non-functional work.
3. Split oversized stories into vertical slices.
4. Create time-boxed research spikes for critical unknowns.
5. Estimate the resulting stories relatively.
6. Forecast based on historical completed work, not optimistic guesses.
7. Revisit forecasts as evidence changes.

Do not treat velocity as an individual performance metric. It is a local planning signal for one team under particular conditions.

**Pros**
- Combines estimation with learning.
- Prevents oversized work from entering delivery unchanged.
- Produces more reliable forecasts over time.
- Makes uncertainty explicit instead of hiding it.

**Cons**
- Requires consistent definitions of done.
- Forecasts remain estimates, not guarantees.
- Changes in team composition, dependencies, or scope reduce the usefulness of historic velocity.

### When to choose which

- Use **Solution 1** for very small, well-understood operational tasks.
- Use **Solution 2** for team-level planning of uncertain delivery work.
- Use **Solution 3** for ongoing product development where forecasting and learning matter.

---

## 2. T-Shirt Sizing

### Simple explanation

**T-shirt sizing** gives a quick, coarse estimate using categories such as:

```text
XS, S, M, L, XL
```

It is useful before the team knows enough for detailed estimates.

A common interpretation:

| Size | Meaning |
|---|---|
| XS | Small, familiar, low risk |
| S | Limited change with few dependencies |
| M | Multiple components or moderate uncertainty |
| L | Significant workflow or integration work |
| XL | Too large or uncertain; split or research before commitment |

### Example

| Initiative | T-shirt size | Reason |
|---|---|---|
| Improve cancellation confirmation wording | XS | Content-only change |
| Add a cancellation-reason field | S | UI, validation, and persistence |
| Add patient self-service cancellation | M | Workflow, authorization, audit, notifications |
| Calendar synchronization | L | External dependency and reconciliation |
| Multi-region patient portal | XL | Major architecture, compliance, localization, and operational work |

### Problem

Early planning often happens before the team has enough detail for story points, hours, or implementation estimates.

Forcing detailed estimates at this stage creates misleading precision:

> “The multi-region portal will take 1,460 hours.”

The team may not yet know:
- Which regions are in scope.
- Data-residency obligations.
- Localization requirements.
- Identity-provider behavior.
- Operational support model.
- Integration constraints.

### Solution 1: Give a detailed estimate immediately

**Pros**
- Appears decisive.
- Provides a number for a budget or schedule discussion.
- May satisfy stakeholders seeking certainty.

**Cons**
- Accuracy is usually poor when scope is unclear.
- The number can become a commitment.
- Teams may optimize for defending the estimate rather than reducing uncertainty.
- Important discovery work may be skipped.

**Problem left behind:** A detailed early estimate looks useful but often hides that the team does not yet understand the work.

### Solution 2: Use T-shirt sizing for early comparison

Estimate relative initiative size rather than duration.

Example:

| Candidate initiative | Size | Decision |
|---|---|---|
| Cancellation workflow | M | Candidate for near-term planning |
| Appointment reminders | M | Compare against cancellation value |
| Calendar integration | L | Plan discovery and dependency work |
| Full scheduling-platform replacement | XL | Break into phases before roadmap commitment |

**Pros**
- Fast.
- Encourages comparison instead of false precision.
- Helps identify initiatives requiring discovery.
- Useful for portfolio, roadmap, and early prioritization discussions.

**Cons**
- Does not provide delivery dates.
- Categories can mean different things to different people.
- Large work may remain large if the team does not follow up with decomposition.

**Problem left behind:** Coarse sizing supports early decisions, but delivery planning needs more detailed understanding for selected initiatives.

### Solution 3: Use T-shirt sizes as a funnel into discovery and detailed planning

Use a progression:

```text
Idea → T-shirt size → Discovery / feasibility validation
→ Epic decomposition → Story-point estimates → Delivery forecast
```

For **L** or **XL** items:
- Identify major unknowns.
- Define architectural, security, legal, or operational risks.
- Run research spikes or proof-of-concepts.
- Split work into valuable, independently releasable increments.
- Re-size the resulting epics and stories.

**Pros**
- Preserves speed during early planning.
- Avoids overcommitting to poorly understood initiatives.
- Connects portfolio decisions to evidence-based delivery planning.
- Makes discovery a deliberate investment.

**Cons**
- Requires stakeholders to accept uncertainty.
- Adds a planning stage before commitment.
- Teams can misuse it by leaving everything labeled XL indefinitely.

### When to choose which

- Avoid **Solution 1** when scope or risks are unclear.
- Use **Solution 2** for early portfolio and roadmap discussions.
- Use **Solution 3** when moving a selected initiative toward delivery commitment.

---

## 3. PERT Estimation

### Simple explanation

**PERT**—Program Evaluation and Review Technique—uses three estimates to account for uncertainty:

- **Optimistic (O):** Best credible outcome.
- **Most likely (M):** Expected outcome under normal conditions.
- **Pessimistic (P):** Reasonable adverse outcome, not an extreme disaster.

The weighted expected estimate is:

\[
E = \frac{O + 4M + P}{6}
\]

This weights the most likely value more heavily.

### Example

A calendar integration has these estimates:

- Optimistic: 5 days — API works as documented; test environment is ready.
- Most likely: 10 days — normal integration, test, monitoring, and review work.
- Pessimistic: 25 days — undocumented edge cases, rate limits, and reconciliation work appear.

\[
E = \frac{5 + (4 \times 10) + 25}{6}
= \frac{70}{6}
\approx 11.7 \text{ days}
\]

The meaningful lesson is not “it will take exactly 11.7 days.” The lesson is that uncertainty is substantial and should be managed.

### Problem

A single estimate hides uncertainty.

For example:

> “The integration will take 10 days.”

That statement does not tell stakeholders:
- What assumptions make 10 days plausible.
- What could extend delivery.
- Whether external dependencies are ready.
- Whether security, performance, or compliance work is included.
- How likely the deadline is.

### Solution 1: Give one best-guess estimate

**Pros**
- Simple.
- Easy to communicate.
- Quick to produce.

**Cons**
- Hides variability.
- Encourages stakeholders to treat a guess as a commitment.
- Does not expose risks or contingency needs.
- Can reward optimism over realism.

**Problem left behind:** A single number is convenient but fails to communicate the uncertainty that drives delivery risk.

### Solution 2: Use optimistic, likely, and pessimistic estimates

Discuss each scenario explicitly.

Example:

| Estimate | Calendar-integration scenario |
|---|---|
| Optimistic | Existing API client works; vendor sandbox matches production |
| Most likely | Standard implementation, tests, retries, monitoring, and review |
| Pessimistic | Vendor API differences, security review findings, data-reconciliation work |

**Pros**
- Makes assumptions visible.
- Encourages risk discussion.
- Produces a more realistic planning range.
- Helps identify what should be validated early.

**Cons**
- Estimates can still be biased.
- The formula may create false mathematical confidence.
- Not useful when the team has not yet identified the work or major dependencies.

**Problem left behind:** A three-point estimate reveals uncertainty, but it does not reduce it or define how the team will respond if risks materialize.

### Solution 3: Use PERT with risk reduction and staged planning

For uncertain work:

1. Record optimistic, likely, and pessimistic cases.
2. Identify what creates the pessimistic case.
3. Add validation tasks that reduce the highest risks.
4. Update estimates after research or proof-of-concepts.
5. Communicate a range and confidence level, not only an expected value.
6. Add schedule contingency appropriate to risk.

Example:

| Risk | Validation action |
|---|---|
| Vendor API may not support required event updates | Build a time-boxed sandbox proof-of-concept |
| Cancellation messages may violate consent rules | Privacy review before implementation |
| High volume may exceed vendor rate limits | Load test and define queueing strategy |
| Failed updates may create inconsistent calendars | Design and test reconciliation process |

**Pros**
- Converts estimation uncertainty into actionable learning.
- Supports more credible stakeholder communication.
- Reduces the chance of discovering major blockers late.
- Aligns planning with risk management.

**Cons**
- Requires time for discovery.
- Some uncertainty remains until production use.
- Stakeholders may resist ranges when they want a fixed date.

### When to choose which

- Use **Solution 1** only for small, familiar work.
- Use **Solution 2** for uncertain tasks with understood boundaries.
- Use **Solution 3** for integrations, migrations, compliance work, major dependencies, and high-risk initiatives.

---

## 4. Product Roadmaps

### Simple explanation

A **product roadmap** communicates the intended direction, outcomes, priorities, and likely sequencing of product work.

A useful roadmap is not simply a dated feature list. It should show:
- Product goals.
- Themes or outcomes.
- Major initiatives.
- Dependencies.
- Risks.
- Time horizons.
- What the team is learning.

### Example

| Time horizon | Outcome | Initiative | Evidence of success |
|---|---|---|---|
| Now | Reduce cancellation call volume | Self-service cancellation | 30% fewer cancellation calls |
| Next | Fill newly opened slots faster | Waiting-list workflow | 20% fewer unfilled cancelled slots |
| Later | Reduce scheduling administration | Calendar synchronization | Fewer manual availability updates |

### Problem

Without a roadmap, stakeholders may see only a backlog of disconnected requests. This makes it difficult to understand:
- Why work is prioritized.
- Which outcomes the team is pursuing.
- How initiatives support business strategy.
- What dependencies exist.
- Which commitments are firm versus exploratory.

### Solution 1: Create a feature-and-date roadmap

Example:

```text
January: Cancellation
February: Reminders
March: Calendar integration
April: Reporting
```

**Pros**
- Easy to understand.
- Useful for high-level communication.
- Can support coordinated launches.

**Cons**
- Frames plans as fixed feature promises.
- Encourages teams to ship outputs regardless of outcomes.
- Makes adaptation appear like failure.
- Hides uncertainty, dependencies, and learning.
- Can lead to overcommitment.

**Problem left behind:** A feature schedule is simple, but it treats software delivery as predictable even when discovery and dependencies are unresolved.

### Solution 2: Organize the roadmap around themes and outcomes

Example themes:
- Reduce administrative workload.
- Increase patient self-service.
- Improve booking reliability.
- Strengthen privacy and security.
- Support expansion into additional regions.

For each theme, state:
- Desired outcome.
- Candidate initiatives.
- Measures of success.
- Major dependencies.
- Current confidence.

**Pros**
- Keeps focus on value rather than output.
- Allows the team to adjust solutions while retaining strategic direction.
- Makes trade-offs more explicit.
- Supports evidence-based prioritization.

**Cons**
- Less precise for stakeholders needing exact launch dates.
- Requires good outcome metrics.
- Can become vague if initiatives and decision points are omitted.

**Problem left behind:** Outcome roadmaps improve strategic alignment, but stakeholders still need clear communication about confidence, sequencing, and commitments.

### Solution 3: Use an outcome-based roadmap with horizons, confidence, and review points

Use horizons such as:
- **Now:** Committed work with understood scope.
- **Next:** Likely work, subject to validation and capacity.
- **Later:** Directional opportunities, not promises.

For each initiative, document:
- Intended outcome.
- Success metric.
- T-shirt size or forecast range.
- Key risks and dependencies.
- Validation milestone.
- Decision point: continue, change, pause, or stop.

Example:

| Horizon | Initiative | Confidence | Decision point |
|---|---|---:|---|
| Now | Patient cancellation | High | Release after acceptance, accessibility, and security validation |
| Next | Waiting-list matching | Medium | Continue after consent and workflow pilot |
| Later | Multi-region support | Low | Reassess after data-residency feasibility review |

**Pros**
- Communicates direction without false certainty.
- Distinguishes commitments from hypotheses.
- Makes risk and dependency management visible.
- Supports iterative planning and stakeholder trust.

**Cons**
- Requires regular updates.
- Some stakeholders may still demand fixed dates.
- Teams need discipline to retire invalidated roadmap items.

### When to choose which

- Use **Solution 1** only when scope, dependencies, and dates are genuinely fixed.
- Use **Solution 2** for strategic communication and outcome-based planning.
- Use **Solution 3** for most evolving product environments.

---

## 5. Minimum Viable Product (MVP)

### Simple explanation

A **Minimum Viable Product (MVP)** is the smallest safe, usable product increment that tests an important hypothesis and creates meaningful value for a target user.

“MVP” does **not** mean:
- Lowest-quality product.
- Insecure product.
- Inaccessible product.
- Unmaintainable prototype pushed to customers.
- Every desirable feature removed without preserving the core user outcome.

### Example

Hypothesis:

> If eligible patients can cancel appointments online, clinics will receive fewer cancellation phone calls and fill more open slots.

A possible MVP includes:
- Secure patient authentication.
- A list of eligible upcoming appointments.
- Cancellation according to clinic policy.
- Clear confirmation.
- Staff visibility.
- Audit events.
- Basic monitoring.
- Accessibility for the critical journey.

It might exclude:
- Self-service rescheduling.
- Automated waiting-list matching.
- Personalized recommendations.
- Advanced reporting.
- Push notifications.

### Problem

Teams often attempt to launch a complete solution before learning whether the core problem and proposed workflow matter.

This delays feedback and increases cost. Conversely, teams can cut too much and release a “minimum” product that cannot safely or meaningfully test the hypothesis.

### Solution 1: Build a complete product before release

**Pros**
- Can produce a comprehensive first impression.
- May be necessary where partial operation is impossible.
- Reduces the need for users to switch between old and new workflows.

**Cons**
- Delays learning and value.
- Increases cost before validation.
- Makes scope and defects accumulate.
- Raises deployment and rollback risk.
- May include features users do not need.

**Problem left behind:** Comprehensive delivery aims for completeness, but it postpones evidence about whether the chosen solution solves the right problem.

### Solution 2: Remove as many features as possible

Example:

> Add a cancel button with no authentication, no policy checks, no confirmation, and no staff notification.

**Pros**
- Very fast to build.
- Demonstrates a narrow interaction.
- May be useful only as a private design prototype.

**Cons**
- Unsafe for real users.
- Cannot produce trustworthy product evidence.
- May create privacy, authorization, accessibility, and operational failures.
- Can damage user trust.
- Does not represent a viable workflow.

**Problem left behind:** Removing essential controls makes delivery faster, but it invalidates the product’s safety and usefulness.

### Solution 3: Define a hypothesis-driven, safe, end-to-end MVP

Start with:
1. A target user.
2. A problem.
3. A hypothesis.
4. A measurable outcome.
5. The smallest end-to-end workflow that can test it safely.

Example:

| Element | MVP definition |
|---|---|
| Target user | Authenticated patient with an upcoming appointment |
| Problem | Must call clinic to cancel |
| Hypothesis | Online cancellation reduces call volume |
| Core outcome | Patient cancels an eligible appointment successfully |
| Success metric | 30% reduction in cancellation calls after rollout |
| Guardrails | No increase in unauthorized access, double-booking, or support complaints |
| Excluded work | Rescheduling and automated waiting-list matching |

Required quality is part of the MVP:
- Server-side authorization.
- Input validation.
- Safe error handling.
- Accessibility of the core journey.
- Audit logging appropriate to data sensitivity.
- Monitoring, rollback, and support readiness.
- Privacy review for communications and data collection.

**Pros**
- Tests a valuable hypothesis early.
- Delivers a usable outcome.
- Limits investment while preserving trust and safety.
- Creates a foundation for measured iteration.

**Cons**
- Requires difficult prioritization.
- Some users may still need the existing process for unsupported cases.
- A successful MVP can require substantial follow-up work before broad scaling.

### When to choose which

- Use **Solution 1** only when partial delivery is genuinely impossible.
- Avoid **Solution 2** for any real customer workflow.
- Use **Solution 3** for most product discovery and early-release decisions.

---

## 6. Risk Register

### Simple explanation

A **risk register** is a structured list of potential events that could affect scope, schedule, cost, security, compliance, quality, or user outcomes.

A risk is not the same as an issue:

- **Risk:** Something that might happen.
- **Issue:** Something happening now.

A useful risk register records:
- Description.
- Likelihood.
- Impact.
- Overall exposure.
- Owner.
- Mitigation.
- Contingency.
- Status and review date.

### Example

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---:|---:|---|---|
| Calendar provider rate limits block synchronization | Medium | High | Validate limits; queue requests; implement backoff and reconciliation | Engineering |
| Consent records are incomplete | Medium | High | Privacy review; validate existing data; require consent checks | Product / Privacy |
| Staff cannot adopt the new workflow quickly | Medium | Medium | Pilot with representative clinics; create training and support materials | Operations |
| Unauthorized appointment access due to ID tampering | Low | Critical | Server-side authorization tests; threat model; security review | Security / Engineering |

### Problem

Without explicit risk management, teams react only after problems occur.

Examples:
- An integration is delayed because the vendor has not approved credentials.
- A privacy rule blocks messaging near release.
- A performance issue appears under peak load.
- A key domain expert becomes unavailable.
- An access-control defect reaches production.

### Solution 1: Discuss risks informally in meetings

**Pros**
- Low effort.
- Encourages awareness.
- Suitable for small, low-risk work.

**Cons**
- Risks are forgotten.
- No owner is accountable.
- Mitigations are not tracked.
- Teams may repeatedly discuss the same risk without acting.
- Stakeholders cannot see whether exposure is increasing or decreasing.

**Problem left behind:** Conversation identifies concerns but does not create a plan to manage them.

### Solution 2: Maintain a risk register

For each risk, record likelihood and impact using a shared scale.

Example:

| Score | Likelihood | Impact |
|---:|---|---|
| 1 | Rare | Minimal |
| 2 | Unlikely | Minor |
| 3 | Possible | Moderate |
| 4 | Likely | Major |
| 5 | Almost certain | Critical |

A simple exposure score can be:

\[
\text{Risk Exposure} = \text{Likelihood} \times \text{Impact}
\]

A risk rated likelihood **4** and impact **5** has exposure **20**, so it needs urgent attention.

**Pros**
- Makes uncertainty visible.
- Helps prioritize mitigation effort.
- Assigns ownership.
- Supports stakeholder communication.
- Links planning to technical, operational, security, and compliance risks.

**Cons**
- Scores are subjective.
- Registers can become stale or overly large.
- Listing a risk does not reduce it.
- Excessive focus on low-value risks can slow delivery.

**Problem left behind:** Recording risks improves visibility, but the register is useful only if the team acts on the highest exposures and reassesses them regularly.

### Solution 3: Use active, risk-based management with mitigation and contingency plans

For significant risks:
1. Assign a specific owner.
2. Define a preventive **mitigation**.
3. Define a reactive **contingency**.
4. Add a validation or review date.
5. Track early warning indicators.
6. Escalate when exposure exceeds agreed tolerance.
7. Convert realized risks into issues with an action plan.

Example:

| Risk | Mitigation | Contingency | Early warning |
|---|---|---|---|
| Calendar API rate limits | Load-test sandbox; queue and throttle requests | Disable nonessential synchronization; reconcile later | Rising `429` responses |
| Authorization flaw | Threat model; automated object-level authorization tests | Disable affected endpoint; investigate access logs | Unexpected denied/allowed access patterns |
| Consent data incomplete | Audit consent records before rollout | Limit reminders to verified-consent users | High percentage of missing consent |
| Adoption is low | Pilot, usability testing, staff training | Retain staffed cancellation path; revise workflow | Low self-service completion rate |

Security risks should not be accepted casually. For high-impact risks:
- Use compensating controls.
- Obtain documented approval from the accountable risk owner.
- Define time-limited exceptions.
- Monitor the exception.
- Track remediation to completion.

**Pros**
- Turns risk awareness into practical action.
- Enables earlier mitigation, reducing cost and delay.
- Supports informed decisions about scope and sequencing.
- Improves release readiness and incident response.

**Cons**
- Requires recurring review.
- Risk management cannot remove all uncertainty.
- Some mitigations increase cost or reduce short-term delivery speed.

### When to choose which

- Use **Solution 1** only for very small, low-risk work.
- Use **Solution 2** for normal projects and product initiatives.
- Use **Solution 3** for high-impact, uncertain, security-sensitive, regulated, integration-heavy, or deadline-critical work.

---

# Topic 1.10 Decision Guide

| If you need to… | Use… |
|---|---|
| Estimate team work relative to complexity and uncertainty | Story points |
| Compare large, early-stage initiatives quickly | T-shirt sizing |
| Communicate uncertainty for a bounded but risky task | PERT estimates with ranges |
| Show strategic direction without making false feature promises | Outcome-based roadmap with time horizons |
| Validate a core hypothesis with minimal but safe investment | Hypothesis-driven MVP |
| Identify, own, mitigate, and monitor delivery uncertainty | Active risk register |

## How this leads to Topic 1.11

Estimation and planning help the team decide what to build, in what order, with what level of investment, and with which risks managed.

The next question is:

> “What privacy, security, data-protection, and compliance obligations must be defined before the product is designed and released?”

That leads to **1.11 Compliance, Privacy, and Security Requirements**.

# 1.11 Compliance, Privacy, and Security Requirements

**Goal:** Define legal, privacy, and security obligations early enough that the product can be designed, built, tested, deployed, and operated safely.

These requirements protect users, the organization, and the product from:

- Unauthorized access.
- Data loss or disclosure.
- Fraud and misuse.
- Regulatory or contractual violations.
- Unsafe vendor integrations.
- Weak incident response.
- Loss of user trust.

This topic covers:

1. GDPR and privacy requirements.
2. Threat modeling.
3. Data classification.

> **Note:** Laws and regulatory obligations depend on jurisdiction, industry, organization, and the data involved. A product team should involve qualified legal, privacy, security, and compliance professionals before relying on any interpretation.

---

## 1. GDPR and Privacy Requirements

### Simple explanation

The **General Data Protection Regulation (GDPR)** is a European Union data-protection law governing many kinds of personal-data processing involving people in the EU/EEA. Similar privacy laws exist in other regions.

For product requirements, the key lesson is:

> Treat personal data as a product and engineering concern from discovery onward—not as a legal review just before release.

Privacy requirements commonly address:

- What personal data is collected.
- Why it is collected.
- The lawful basis or authority for processing.
- Data minimization.
- Transparency and privacy notices.
- Consent, where applicable.
- Access control.
- Retention and deletion.
- Data-subject rights.
- Vendor and international-transfer controls.
- Incident response and breach handling.

### Example

An appointment-cancellation feature needs:
- Patient identity.
- Appointment reference.
- Cancellation time.
- Clinic policy.
- Optional communication preference.

It may **not** need:
- Detailed medical notes.
- Full patient history.
- Marketing preferences unrelated to the cancellation.
- More location data than necessary.

A privacy-aware requirement could be:

> The system shall collect and process only the personal data necessary to identify an authenticated patient, validate appointment ownership, apply cancellation policy, and provide confirmation.

---

### Problem

Without privacy requirements, teams often collect data because it is “potentially useful.”

Examples:
- Logging complete request bodies for debugging.
- Copying production data into lower environments.
- Retaining cancelled-account data forever.
- Asking for consent when another lawful basis applies—or assuming consent when it is not valid.
- Sending sensitive details in unencrypted email or notification previews.
- Using vendors without understanding where or how data is processed.

The result can be:
- Privacy breaches.
- Excessive breach impact.
- Loss of user trust.
- Expensive redesign.
- Legal or contractual exposure.

---

### Solution 1: Add a privacy notice after the feature is built

The team builds a feature, then adds a generic privacy-policy link before release.

**Pros**
- Low initial effort.
- Better than providing no privacy information.
- May help for simple, low-risk informational content.

**Cons**
- Does not determine whether the data collection is necessary.
- Does not define data access, retention, deletion, or vendor controls.
- Cannot fix an architecture that already stores unnecessary sensitive data.
- Does not ensure consent, transparency, or rights handling is meaningful.
- Encourages privacy as a documentation task instead of a product-design concern.

**Problem left behind:** Telling users that data is processed does not make the processing necessary, secure, transparent, or lawful.

---

### Solution 2: Define privacy requirements during product and technical design

For each data category, document:

- **Purpose:** Why is it needed?
- **Data subject:** Whose data is this?
- **Source:** Where does it come from?
- **Classification:** Personal, sensitive, confidential, public, or internal.
- **Legal or policy basis:** What permits this processing?
- **Access:** Which roles and systems need it?
- **Retention:** How long is it required?
- **Deletion or anonymization:** What happens at end of life?
- **Sharing:** Which processors, vendors, or integrations receive it?
- **Security controls:** Encryption, authorization, logging, and monitoring.

Example:

| Data | Purpose | Access | Retention | Requirement |
|---|---|---|---|---|
| Patient email | Send cancellation confirmation | Patient and authorized notification service | Defined by policy | Do not expose email in logs |
| Appointment reference | Identify appointment | Patient and clinic staff | Operational retention period | Use authorization checks before access |
| Consent record | Record communication choice | Authorized staff and compliance roles | Defined by policy | Record source, timestamp, and policy version |
| Cancellation audit event | Investigate and reconcile changes | Restricted operations/security roles | Audit-retention period | Store minimal necessary details |

**Pros**
- Applies privacy by design and by default.
- Reduces unnecessary collection.
- Supports secure architecture and test planning.
- Clarifies responsibilities for vendors and internal teams.
- Makes privacy review more efficient.

**Cons**
- Requires early cross-functional involvement.
- Privacy rules can vary across markets and sectors.
- Data inventories and retention requirements must be maintained.
- Teams may over-document low-risk changes if they lack proportionality.

**Problem left behind:** Defined privacy requirements establish intent, but they do not guarantee that systems enforce the requirements in practice.

---

### Solution 3: Enforce privacy through product design, technical controls, and operational processes

Turn privacy requirements into controls:

- **Data minimization:** Collect only fields required for the stated purpose.
- **Purpose limitation:** Prevent reuse of data for unrelated functions without review.
- **Least-privilege access:** Grant users and services only the access they need.
- **Server-side authorization:** Check permissions on every protected request.
- **Encryption:** Use HTTPS/TLS in transit and approved encryption at rest.
- **Environment isolation:** Use synthetic or sanitized data outside production.
- **Retention automation:** Delete, anonymize, or archive data according to policy.
- **Audit logging:** Record sensitive or privileged access without logging sensitive payloads.
- **Vendor controls:** Review processors and restrict integration permissions.
- **Rights workflows:** Support applicable access, correction, deletion, and export requests.
- **Incident readiness:** Define detection, containment, investigation, communication, and recovery steps.

Example acceptance criteria:

```gherkin name=privacy-safe-cancellation.feature
Feature: Privacy-safe appointment cancellation

  Scenario: Cancellation confirmation minimizes exposed information
    Given an authenticated patient cancels an eligible appointment
    When the system sends a confirmation notification
    Then the notification contains only the information necessary to confirm the cancellation
    And it does not include sensitive details in the subject line or message preview

  Scenario: Unauthorized users cannot learn appointment details
    Given a user is not authorized to access an appointment
    When the user requests cancellation for that appointment
    Then the system denies the request
    And the response does not reveal whether the appointment exists
    And no sensitive appointment details are written to logs
```

**Pros**
- Converts privacy principles into enforceable behavior.
- Reduces the probability and impact of data exposure.
- Produces evidence for audits and incident response.
- Preserves user trust as the system evolves.

**Cons**
- Requires engineering, security, legal, support, and operations coordination.
- Retention and deletion can be technically complex when backups, legal holds, and integrations exist.
- Controls require monitoring and periodic review to remain effective.

### When to choose which

- Use **Solution 1** only as a supplementary communication measure—not as a privacy strategy.
- Use **Solution 2** for all production features processing personal data.
- Use **Solution 3** for sensitive, regulated, large-scale, customer-facing, or multi-vendor systems.

---

## 2. Privacy by Design and Default

### Simple explanation

**Privacy by design** means considering privacy throughout the product lifecycle.

**Privacy by default** means the default settings should collect, expose, and retain the least personal data necessary for the intended purpose.

Example:
- A patient opts into optional appointment-reminder channels rather than being automatically subscribed to unrelated marketing.
- A staff dashboard shows only the appointment information needed for that role.
- Analytics use aggregated or pseudonymous data where possible.

### Problem

Teams often design for maximum data collection and broad visibility because it seems useful:

> “Let’s store everything in case we need it later.”

This creates:
- Larger breach impact.
- More difficult access control.
- More retention and deletion obligations.
- More sensitive logs and backups.
- More distrust from users.

### Solution 1: Collect broadly, restrict later

The team captures many fields and plans to decide later which ones are needed.

**Pros**
- Appears flexible.
- May help ad hoc analysis in the short term.
- Avoids immediate debate about future use cases.

**Cons**
- Violates data-minimization principles in many contexts.
- Increases security and privacy risk immediately.
- Makes later deletion, classification, and access reviews harder.
- Encourages secondary uses that users may not expect.

**Problem left behind:** More data may feel useful, but it expands risk faster than it expands justified value.

### Solution 2: Minimize data during requirements definition

Ask for every field:
- What product outcome needs this?
- Is it necessary or merely convenient?
- Can the workflow work with less data?
- Can it be derived temporarily rather than stored?
- Can it be aggregated, pseudonymized, or anonymized?
- Who needs it and for how long?

Example:

| Proposed field | Decision | Reason |
|---|---|---|
| Patient name | Keep | Needed to identify appointment in patient and staff context |
| Detailed medical history | Exclude | Not needed for cancellation |
| Cancellation timestamp | Keep | Needed for audit and operational reporting |
| Exact device fingerprint | Exclude unless justified | High privacy impact; not needed for core workflow |
| Optional cancellation reason | Make optional and restricted | Useful for operations but not required to cancel |

**Pros**
- Reduces exposure and compliance burden.
- Simplifies data models and access rules.
- Lowers storage and support cost.
- Improves user trust.

**Cons**
- Future use cases may require a later data-model change.
- Teams need sufficient domain knowledge to distinguish need from convenience.
- Some regulatory or audit requirements may require retaining data that users do not directly see.

**Problem left behind:** Minimizing collection reduces risk, but default user settings and internal access patterns can still expose more than necessary.

### Solution 3: Apply minimization to collection, defaults, access, and retention

Use privacy-preserving defaults:

- Optional sharing starts disabled.
- Reports hide sensitive fields unless a role genuinely requires them.
- Analytics avoid direct identifiers unless necessary.
- Screens display partial identifiers where full values are unnecessary.
- Exports require explicit authorization and are logged.
- Sensitive fields are omitted from standard logs.
- Retention is time-limited and automated.
- Access permissions expire or are reviewed regularly.

**Pros**
- Makes safer behavior the normal path.
- Reduces accidental disclosure.
- Limits harm if an account, system, or vendor is compromised.
- Supports least privilege and easier compliance management.

**Cons**
- Requires careful UX to avoid confusing users.
- Some users may need deliberate configuration for advanced scenarios.
- Role design and retention automation require ongoing governance.

### When to choose which

- Avoid **Solution 1** for production systems.
- Use **Solution 2** for every feature that collects personal or confidential data.
- Use **Solution 3** for products with sensitive data, multiple roles, exports, analytics, or regulatory obligations.

---

## 3. Threat Modeling

### Simple explanation

**Threat modeling** is a structured way to identify how a system could be misused, attacked, or fail in a security-relevant way.

It asks:

- What are we protecting?
- Who might misuse or attack it?
- Where are the trust boundaries?
- How could data or actions be manipulated?
- What controls reduce the risk?
- How will we verify those controls?

Threat modeling is not only for security specialists. Product, engineering, operations, and domain experts all understand different risks.

### Example

For appointment cancellation, assets include:
- Appointment details.
- Patient identities.
- Staff accounts.
- Consent records.
- Audit logs.
- Notification credentials.

Potential threats include:
- A patient modifies an appointment ID to cancel another patient’s appointment.
- An attacker floods the public cancellation endpoint.
- A forwarded cancellation link reveals private details.
- A staff member uses excessive privileges to view records.
- An integration token is exposed in logs or source control.
- A failed calendar update leaves inconsistent appointment status.

### Problem

Without threat modeling, teams usually focus on expected user behavior:

> “A patient signs in and cancels their appointment.”

Attackers and mistakes do not follow the happy path:
- They change identifiers.
- They replay requests.
- They exploit error messages.
- They automate traffic.
- They abuse role permissions.
- They target integrations and secrets.
- They exploit unusual concurrency conditions.

### Solution 1: Depend only on standard framework protections

The team uses a modern framework and assumes built-in protections are enough.

**Pros**
- Framework defaults can prevent common vulnerabilities.
- Low effort.
- A necessary baseline for secure development.

**Cons**
- Frameworks cannot define product-specific authorization rules.
- Secure defaults can be disabled or misconfigured.
- They do not identify sensitive data flows, abuse cases, or business-logic attacks.
- They do not determine which roles should access which records.

**Problem left behind:** Framework protections reduce generic risk but do not analyze how this specific product can be abused.

### Solution 2: Run a lightweight threat-modeling workshop

For each important workflow:

1. Draw the components and data flows.
2. Identify assets.
3. Identify users, systems, vendors, and trust boundaries.
4. Ask how each flow could be misused.
5. Record threats, mitigations, owners, and verification methods.

A simple threat table:

| Asset / flow | Threat | Mitigation |
|---|---|---|
| Patient views appointment | Identifier manipulation exposes another record | Server-side object-level authorization |
| Cancellation request | Replay creates duplicate changes | Idempotency and concurrency controls |
| Notification service | Token compromise | Secrets manager, scoped identity, rotation |
| Public endpoint | Automated overload | Rate limiting, request limits, monitoring |
| Audit logs | Sensitive data exposure | Structured logging and redaction |

**Pros**
- Finds product-specific threats early.
- Improves communication across teams.
- Creates input for security requirements and tests.
- Can be completed quickly for a well-scoped feature.

**Cons**
- Quality depends on participant knowledge.
- Teams may miss subtle threats.
- It must be updated when architecture or workflows change.
- A workshop alone does not enforce mitigation.

**Problem left behind:** A threat list identifies risks, but teams need a systematic way to ensure mitigations are designed, implemented, tested, and monitored.

### Solution 3: Integrate threat modeling into design, delivery, and operations

For high-risk workflows:

- Add threats to the risk register.
- Turn mitigations into security requirements.
- Link controls to architecture decisions.
- Create authorization, validation, and abuse-case tests.
- Run dependency and secret scanning in CI.
- Review infrastructure and identity permissions.
- Monitor suspicious behavior and security events.
- Revisit the model after major changes, incidents, or new integrations.

Example:

| Threat | Required control | Verification |
|---|---|---|
| Cross-account appointment access | Server-side ownership and tenant checks | Automated integration tests using multiple accounts |
| Session theft | Secure cookie attributes, session rotation after login, short session lifetime | Security review and automated configuration tests |
| Injection via request input | Allow-list validation and parameterized queries | Unit, integration, and security tests |
| Excessive cancellation requests | Rate limits, throttling, and alerting | Load tests and production metrics |
| Secret exposure | Secrets manager and secret scanning | CI checks and access audit |

**Pros**
- Turns security discussion into repeatable engineering work.
- Improves auditability and incident readiness.
- Reduces the likelihood of security controls being deferred.
- Helps prioritize controls by actual product risk.

**Cons**
- Requires security capability, tooling, and time.
- Can become overly heavyweight if applied identically to trivial changes.
- Threat models must evolve with the product.

### When to choose which

- Use **Solution 1** as a baseline only.
- Use **Solution 2** for ordinary customer-facing features, APIs, integrations, and data flows.
- Use **Solution 3** for sensitive data, financial actions, privileged administration, public endpoints, complex integrations, or regulated systems.

---

## 4. STRIDE: A Threat-Modeling Starting Point

### Simple explanation

**STRIDE** is a common mnemonic for thinking about threat categories:

| Category | Meaning | Example |
|---|---|---|
| **S**poofing | Pretending to be another user or system | Attacker uses a stolen session |
| **T**ampering | Changing data or requests without authorization | User modifies an appointment ID |
| **R**epudiation | Denying an action without evidence | Staff member denies cancelling an appointment |
| **I**nformation disclosure | Exposing confidential data | Error response reveals another patient’s details |
| **D**enial of service | Making a service unavailable | Automated traffic overwhelms booking search |
| **E**levation of privilege | Gaining higher permissions | Receptionist accesses administrator-only data |

### Problem

A generic prompt like “Is this secure?” is too broad. Teams often remember authentication but overlook:
- Auditability.
- Data disclosure through errors and logs.
- Abuse through high request volume.
- Role escalation.
- Tampering with request values.
- Third-party system impersonation.

### Solution 1: Focus only on login and passwords

The team asks:

> “Do users need to sign in?”

**Pros**
- Authentication is essential.
- Easy to understand.
- Prevents some unauthorized access.

**Cons**
- Authenticated users can still access data they should not see.
- Does not prevent request tampering, data leaks, or denial of service.
- Does not address integration identity, auditability, or abuse.
- Can create a false sense of security.

**Problem left behind:** Authentication identifies a user, but it does not define or enforce every allowed action.

### Solution 2: Review each workflow using STRIDE questions

For an appointment cancellation flow:

| STRIDE area | Review question | Example control |
|---|---|---|
| Spoofing | Can an attacker impersonate a patient or service? | MFA for administrators; secure sessions; scoped service identities |
| Tampering | Can request parameters change another appointment? | Server-side authorization; allow-list validation |
| Repudiation | Can the organization prove who made a change? | Immutable or protected audit events |
| Information disclosure | Can errors, logs, URLs, or messages expose data? | Safe errors; redacted logs; privacy-safe notifications |
| Denial of service | Can an attacker overload the workflow? | Rate limits; quotas; timeouts; queue controls |
| Elevation of privilege | Can users gain access beyond their role? | Role checks; tenant isolation; least privilege |

**Pros**
- Provides a repeatable prompt set.
- Helps non-security specialists contribute.
- Reveals threats that feature-focused design misses.
- Works well for APIs, workflows, and integrations.

**Cons**
- It is not exhaustive.
- Teams can apply it mechanically without understanding the system.
- It does not directly prioritize threats by business impact.

**Problem left behind:** STRIDE finds categories of threats, but the team still needs to assess likelihood, impact, and mitigation priority.

### Solution 3: Combine STRIDE with risk prioritization and abuse-case tests

For each credible threat:
1. Estimate likelihood and impact.
2. Identify existing controls.
3. Add missing mitigations.
4. Define verification.
5. Test abuse cases.
6. Monitor in production where appropriate.

Example abuse-case acceptance tests:

```gherkin name=appointment-cancellation-security.feature
Feature: Secure appointment cancellation

  Scenario: Cross-account cancellation is denied
    Given Patient A is authenticated
    And an eligible appointment belongs to Patient B
    When Patient A attempts to cancel Patient B's appointment
    Then the system denies the request
    And the response does not reveal appointment details
    And no appointment status is changed

  Scenario: Replayed cancellation request is safe
    Given an eligible appointment has already been cancelled successfully
    When the same cancellation request is retried
    Then the system returns a safe idempotent result
    And it does not create duplicate audit events or notifications

  Scenario: Excessive requests are throttled
    Given a client exceeds the approved cancellation-request rate
    When the client submits another request
    Then the system applies the configured rate limit
    And the event is observable to operations without logging sensitive request data
```

**Pros**
- Links security risk directly to implementation and validation.
- Prevents security requirements from remaining abstract.
- Helps teams prioritize meaningful protections.
- Produces repeatable regression coverage.

**Cons**
- Requires test environments and security-aware test data.
- Automated tests cannot prove every attack path is impossible.
- Monitoring must avoid creating new privacy risks.

### When to choose which

- Avoid **Solution 1** as a complete approach.
- Use **Solution 2** as a practical starting point for design reviews.
- Use **Solution 3** for important workflows and all high-impact threats.

---

## 5. Data Classification

### Simple explanation

**Data classification** labels data according to its sensitivity and required protection.

A simple classification scheme might include:

| Classification | Meaning | Example |
|---|---|---|
| Public | Approved for public release | Published product documentation |
| Internal | Non-public business information | Internal feature roadmap |
| Confidential | Sensitive business or personal data | Customer contact details |
| Restricted | Highly sensitive data requiring strict controls | Credentials, health data, payment data, private keys |

Organizations use different names and levels. The key is that every classification has clear handling rules.

### Example

For an appointment platform:

| Data type | Classification | Required handling |
|---|---|---|
| Public help content | Public | Standard publishing review |
| Internal architecture diagram | Internal | Access limited to employees and approved contractors |
| Patient email address | Confidential | Encrypt in transit and at rest; restrict access |
| Authentication token | Restricted | Store in secrets manager; never log or commit |
| Appointment notes | Restricted | Strong access controls, audit logging, minimal retention |

### Problem

Without classification, teams often apply inconsistent protection:

- Sensitive data is stored in ordinary logs.
- Production exports are sent through unsafe channels.
- Developers use real customer data locally.
- Access rights are broader than necessary.
- Backups are retained indefinitely without understanding sensitivity.
- A low-risk document receives excessive controls while credentials receive inadequate protection.

### Solution 1: Treat all data the same

The team protects everything with the same minimal approach—or tries to lock down everything identically.

**Pros**
- Simple to explain.
- Avoids some debates about classification.
- A baseline security level is better than none.

**Cons**
- Minimal controls may be inadequate for sensitive data.
- Uniform maximum controls can slow ordinary work unnecessarily.
- Teams cannot prioritize security investment.
- Vendors and integrations may receive data without appropriate safeguards.
- Incident response cannot quickly determine the impact of exposure.

**Problem left behind:** One-size-fits-all handling either under-protects important data or creates avoidable friction everywhere.

### Solution 2: Define data classes and handling rules

For each class, define:
- Who may access it.
- Where it may be stored.
- Whether encryption is required.
- Whether it may be used in lower environments.
- Logging restrictions.
- Sharing and export rules.
- Retention requirements.
- Incident escalation requirements.

Example:

| Control | Public | Internal | Confidential | Restricted |
|---|---|---|---|---|
| Access control | Optional | Authenticated workforce | Need-to-know | Strict least privilege |
| Encryption at rest | Optional by policy | Recommended | Required | Required with managed keys |
| Use in test environments | Yes | Controlled | Sanitized only | No real data |
| Log content | Allowed if approved | Minimize | Do not log values | Never log values |
| External sharing | Approved channels | Approved recipients | Contract and approval required | Exceptional approval only |

**Pros**
- Gives teams practical rules.
- Supports consistent design and operations.
- Improves risk assessment and incident response.
- Helps determine which security controls are necessary.

**Cons**
- Classification policy requires governance.
- Users may misclassify data.
- Data can change classification when combined with other data.
- Too many levels make adoption difficult.

**Problem left behind:** Defined labels are useful, but classification must be enforced through systems, workflows, and regular review.

### Solution 3: Automate and enforce classification-aware controls

Apply classification in practice:

- Tag data stores and documents.
- Restrict access using role- and attribute-based controls.
- Prevent restricted data from entering logs and telemetry.
- Scan source repositories and build artifacts for secrets.
- Block uploads or exports that violate policy.
- Use data-loss-prevention controls where appropriate.
- Enforce encryption and key-management rules.
- Use synthetic or sanitized data in non-production environments.
- Monitor privileged access to confidential and restricted data.
- Test backup restoration and deletion processes.

Example requirement:

> Production data classified as Confidential or Restricted shall not be copied to developer workstations or lower environments. Test environments shall use synthetic data or approved sanitization processes.

**Pros**
- Reduces reliance on human memory.
- Prevents common accidental disclosures.
- Supports audits and incident investigation.
- Makes secure handling the default workflow.

**Cons**
- Requires platform tooling and maintenance.
- Automated classification can create false positives or false negatives.
- Controls must be designed carefully to avoid blocking legitimate emergency work.

### When to choose which

- Avoid **Solution 1** for systems handling any non-public data.
- Use **Solution 2** for all production products and organizational information systems.
- Use **Solution 3** for sensitive, regulated, large-scale, multi-team, or cloud-integrated environments.

---

## 6. Security Requirements for Identity and Access

### Simple explanation

Identity and access requirements define:
- Who can authenticate.
- How they authenticate.
- Which actions and data they can access.
- How permissions are reviewed and removed.
- How privileged actions are audited.

Authentication answers:

> “Who are you?”

Authorization answers:

> “What are you allowed to do?”

Both are required.

### Example

For appointment cancellation:

- Patients may cancel only appointments they own.
- Receptionists may manage appointments only for their assigned clinic.
- Administrators may configure cancellation policy but cannot automatically read all patient notes unless their role requires it.
- Service-to-service identities may only invoke the specific API operations needed for synchronization.

### Problem

Teams sometimes implement login but omit robust authorization:

> “The user is signed in, so allow the request.”

This can cause:
- Insecure direct object references.
- Cross-tenant data exposure.
- Privilege escalation.
- Overly broad administrative roles.
- Stale access after role changes.
- Excessive API-token permissions.

### Solution 1: Authenticate users and trust client-side role checks

For example, a frontend hides the “Cancel” button for unauthorized users.

**Pros**
- Simple user experience control.
- Prevents accidental clicks in the interface.
- Useful as a supplementary usability measure.

**Cons**
- Client-side logic can be bypassed.
- Attackers can call APIs directly or modify requests.
- Does not protect data or actions on the server.
- Does not enforce tenant, ownership, or contextual permissions.

**Problem left behind:** Hiding an interface option does not enforce security.

### Solution 2: Define server-side role-based authorization

Document roles and permitted actions.

| Role | Example permissions |
|---|---|
| Patient | View and manage own eligible appointments |
| Receptionist | Manage appointments in assigned clinic |
| Clinician | View assigned schedule and relevant patient details |
| Administrator | Manage configuration and user administration |
| Integration service | Synchronize limited appointment status fields |

Enforce authorization on the server for every request.

**Pros**
- Provides a clear model.
- Prevents many common access-control failures.
- Supports test cases and audits.
- Easier to manage than ad hoc permissions.

**Cons**
- Roles can become too broad.
- Real-world permissions may depend on tenant, ownership, location, time, or assignment.
- Role explosion can occur if every variation becomes a separate role.

**Problem left behind:** Role-based access improves control, but complex workflows often require contextual decisions beyond a simple role name.

### Solution 3: Apply least privilege with contextual authorization and lifecycle controls

Consider:
- Tenant or organization membership.
- Record ownership.
- Assigned clinic or team.
- Appointment state.
- Time-bound access.
- Explicit delegated authority.
- Break-glass access for emergencies, with strict auditing.
- Service identity scopes.
- Access review and revocation processes.

Security requirements:
- Enforce authorization server-side on every protected resource and action.
- Deny by default.
- Generate a new session identifier after login.
- Use secure session-cookie settings appropriate to the application flow.
- Use short-lived, scoped credentials for services.
- Log privileged and denied actions without storing sensitive payloads.
- Rate-limit authentication and sensitive actions.
- Require stronger authentication for high-risk administrative operations.

**Pros**
- Better matches real business rules.
- Reduces blast radius from compromised accounts.
- Supports multi-tenant and sensitive-data systems.
- Improves auditability and incident response.

**Cons**
- More difficult to design and test.
- Policy engines and permission models can add complexity.
- Emergency-access processes need careful governance to remain both usable and safe.

### When to choose which

- Never rely on **Solution 1** for enforcement.
- Use **Solution 2** for straightforward internal systems with stable roles.
- Use **Solution 3** for customer data, multi-tenant systems, privileged functions, regulated data, and external integrations.

---

# Topic 1.11 Decision Guide

| If you need to… | Use… |
|---|---|
| Define lawful, transparent, minimal personal-data processing | Privacy requirements and privacy-by-design review |
| Reduce unnecessary collection and default exposure | Data minimization and privacy-preserving defaults |
| Find product-specific security threats before implementation | Threat-modeling workshop |
| Review threats systematically | STRIDE with risk prioritization |
| Apply appropriate handling to sensitive information | Data classification and handling rules |
| Prevent unauthorized access to records and actions | Server-side, least-privilege authorization |
| Ensure privacy and security controls remain effective over time | Automated controls, testing, monitoring, audits, and change review |

## How this leads to Topic 1.12

Privacy, security, compliance, and data-classification requirements define the safeguards the product must satisfy.

The next question is:

> “How do we turn all requirements—functional, non-functional, security, accessibility, and business rules—into precise test cases that prove the system behaves correctly?”

That leads to **1.12 Test Cases from Requirements**.

# 1.12 Test Cases from Requirements — Part 1 of 2

**Goal:** Convert requirements into clear, repeatable evidence that the system behaves correctly, securely, accessibly, and reliably.

A **test case** describes:
- What is being tested.
- Required setup or preconditions.
- Test steps or action.
- Expected result.
- Actual result and execution evidence.

This topic covers:

1. Acceptance criteria → Given/When/Then (BDD).
2. Equivalence classes.
3. Boundary-value analysis.
4. Test-case structure and traceability to requirements.

---

## 1. Acceptance Criteria → Given/When/Then (BDD)

### Simple explanation

**Acceptance criteria** define conditions that must be true for a requirement or user story to be accepted.

**Behavior-Driven Development (BDD)** expresses those conditions as examples:

```text
Given [starting context]
When [action or event]
Then [expected observable outcome]
```

This format helps product, engineering, QA, security, and operations agree on behavior before implementation.

### Example

Requirement:

> An authenticated patient may cancel an eligible appointment they own.

BDD acceptance scenario:

```gherkin name=appointment-cancellation.feature
Feature: Patient appointment cancellation

  Scenario: Patient cancels an eligible appointment they own
    Given an authenticated patient owns an appointment
    And the appointment is eligible for cancellation under clinic policy
    When the patient confirms cancellation
    Then the appointment status becomes "Cancelled"
    And the system records the cancellation actor and timestamp
    And the patient receives a confirmation
```

### Problem

A requirement can be clear enough for a business discussion but still leave implementation and testing questions unanswered.

For example:

> “Allow patients to cancel appointments online.”

Questions include:
- Must the patient authenticate?
- Can they cancel another person’s appointment?
- What makes an appointment eligible?
- What happens after the cancellation deadline?
- What if the appointment has already been cancelled?
- Is the action safe if the request is retried?
- What may appear in the confirmation message?

### Solution 1: Test only the happy path

A tester checks:

1. Sign in as a patient.
2. Cancel an appointment.
3. Confirm that it is cancelled.

**Pros**
- Fast.
- Confirms the central workflow works at least once.
- Useful as an initial smoke test.

**Cons**
- Misses policy exceptions.
- Misses invalid input and failure behavior.
- Misses authorization flaws.
- Misses concurrency and retry behavior.
- Misses accessibility, privacy, and audit requirements.

**Problem left behind:** A successful happy-path test proves only that one expected scenario works—not that the system is safe or robust.

### Solution 2: Write acceptance criteria for normal and exceptional behavior

Add criteria for:
- Success.
- Ineligible actions.
- Invalid data.
- Authorization failures.
- Already-completed actions.
- Error handling.
- Communication outcomes.

```gherkin name=appointment-cancellation-acceptance.feature
Feature: Appointment cancellation acceptance criteria

  Scenario: Cancellation is blocked after the deadline
    Given an authenticated patient owns an appointment
    And the appointment is within the clinic cancellation deadline
    When the patient attempts cancellation
    Then the system does not change the appointment status
    And the system explains the approved next step

  Scenario: Another patient's appointment cannot be cancelled
    Given an authenticated patient does not own an appointment
    When the patient requests cancellation for that appointment
    Then the system denies the request
    And the response does not reveal appointment details
```

**Pros**
- Makes business rules explicit.
- Produces a shared definition of done.
- Gives QA a clear starting point.
- Finds ambiguity before implementation.
- Supports automated acceptance tests.

**Cons**
- May still omit non-functional requirements.
- Large numbers of scenarios can become hard to maintain.
- Poorly written scenarios can duplicate UI implementation details.

**Problem left behind:** Functional examples explain expected behavior, but critical quality requirements—security, performance, accessibility, and resilience—also need explicit test coverage.

### Solution 3: Add risk-based quality and abuse-case scenarios

Extend tests beyond normal functional behavior.

```gherkin name=appointment-cancellation-quality.feature
Feature: Safe and accessible appointment cancellation

  Scenario: Cancellation remains safe when retried
    Given an eligible appointment was cancelled successfully
    When the same cancellation request is retried
    Then the system returns a safe idempotent result
    And it does not create duplicate cancellation events or notifications

  Scenario: Unauthorized access is safely denied
    Given a patient is authenticated
    And the appointment belongs to another patient
    When the patient attempts to cancel the appointment
    Then the system denies the request
    And no appointment details are disclosed
    And the authorization failure is recorded according to policy

  Scenario: Cancellation works using keyboard navigation
    Given a patient is on the cancellation page
    When the patient uses only keyboard navigation
    Then every required control is reachable in a logical order
    And focus remains visible
    And the patient can complete or cancel the action without a pointer device
```

For production-quality testing, also consider:
- Performance tests for critical actions.
- Rate-limit and abuse tests for public endpoints.
- Audit-log verification.
- Dependency failure and retry tests.
- Localization and time-zone tests.
- Monitoring and alerting validation.

**Pros**
- Connects requirements to real operational and security risk.
- Reduces the likelihood of production-only failures.
- Makes accessibility and privacy part of acceptance, not later remediation.
- Creates stronger regression coverage.

**Cons**
- Requires test environments, suitable data, and specialist expertise.
- Not every low-risk story needs extensive scenarios.
- Teams must avoid turning every acceptance test into a slow end-to-end test.

### When to choose which

- Use **Solution 1** only as an initial smoke test.
- Use **Solution 2** for ordinary functional requirements.
- Use **Solution 3** for critical journeys, sensitive data, public APIs, authorization, payments, regulated workflows, and high-impact changes.

---

## 2. Equivalence Classes

### Simple explanation

**Equivalence partitioning** divides possible inputs into groups—called **equivalence classes**—that the system should handle the same way.

Instead of testing every possible value, test at least one representative value from each meaningful group.

### Example

Suppose an appointment cancellation policy allows cancellation only when the appointment is more than 24 hours away.

Possible input classes:

| Class | Example | Expected result |
|---|---|---|
| Valid eligible appointment | Appointment in 48 hours | Cancellation allowed |
| Invalid/ineligible appointment | Appointment in 12 hours | Cancellation rejected |
| Already cancelled appointment | Status is `Cancelled` | Safe idempotent response or rejection |
| Completed appointment | Status is `Completed` | Cancellation rejected |
| Nonexistent appointment ID | Unknown ID | Safe not-found or validation response |
| Unauthorized appointment | Belongs to another patient | Access denied without disclosure |

### Problem

Testing every possible input is impossible.

For example, appointment IDs, dates, user accounts, languages, and request payloads can have millions or billions of combinations.

If a team tests only a few arbitrary examples, important categories may be missed:
- Missing values.
- Invalid formats.
- Unauthorized records.
- Duplicate requests.
- Unsupported states.
- Overlong input.
- Malicious input.

### Solution 1: Test a few examples chosen casually

Example:
- Cancel one valid appointment.
- Cancel one expired appointment.

**Pros**
- Fast.
- Better than no testing.
- Can catch obvious defects.

**Cons**
- Coverage is accidental.
- Does not show which input types were considered.
- Important invalid or malicious classes may be omitted.
- Different testers may choose inconsistent examples.

**Problem left behind:** A few examples might work, but there is no systematic reason to believe the important input categories were covered.

### Solution 2: Define valid and invalid equivalence classes

For each input, identify groups expected to behave the same way.

Example: cancellation-reason input.

| Equivalence class | Example input | Expected behavior |
|---|---|---|
| Valid optional input | `"Unable to attend"` | Save safely |
| Empty input | `""` | Allow if optional |
| Missing input | No field supplied | Allow if optional |
| Valid maximum length | 500 characters | Accept |
| Too long | 501 characters | Reject with safe validation message |
| Unsupported characters or control characters | Malformed input | Reject or normalize according to policy |
| Script-like input | `<script>...</script>` | Store/display safely without execution |

**Pros**
- Provides systematic coverage with fewer tests.
- Makes validation rules explicit.
- Helps identify missing requirements.
- Supports both manual and automated testing.

**Cons**
- Requires analysis skill.
- Classes may not be truly equivalent if hidden rules exist.
- Does not automatically identify edge values between classes.

**Problem left behind:** Equivalence classes cover representative categories, but defects often occur exactly at the boundaries between valid and invalid values.

### Solution 3: Combine equivalence classes with security-aware input validation

For every untrusted input:
- Define expected type, format, allowed values, and maximum size.
- Use allow-list validation rather than trying to block every harmful value.
- Apply server-side validation even if the UI validates input.
- Use parameterized queries or safe ORM APIs for data access.
- Encode output according to display context to prevent XSS.
- Do not expose internal validation rules or record contents in error messages.

Example tests:

```gherkin name=cancellation-reason-validation.feature
Feature: Cancellation reason validation

  Scenario Outline: Valid optional cancellation reasons are accepted
    Given an authenticated patient cancels an eligible appointment
    When the patient provides the cancellation reason "<reason>"
    Then the cancellation request is processed safely

    Examples:
      | reason             |
      | Unable to attend   |
      |                    |

  Scenario: Oversized cancellation reason is rejected
    Given an authenticated patient cancels an eligible appointment
    When the patient provides a cancellation reason longer than the configured maximum
    Then the system returns a safe validation error
    And the appointment cancellation state is not partially changed

  Scenario: Displayed reason is output-encoded
    Given a cancellation reason contains text that resembles HTML or script
    When authorized staff view the cancellation record
    Then the reason is displayed as text
    And no script or markup is executed
```

**Pros**
- Improves both correctness and security.
- Makes input requirements testable.
- Reduces injection, data-corruption, and denial-of-service risks.
- Supports reusable validation rules.

**Cons**
- Requires agreement on valid formats and limits.
- Overly restrictive validation can exclude legitimate names, languages, or accessibility input methods.
- Security tests need safe, controlled environments.

### When to choose which

- Use **Solution 1** only for quick exploratory checks.
- Use **Solution 2** for ordinary input-validation and business-rule testing.
- Use **Solution 3** for externally supplied input, sensitive workflows, APIs, search, uploads, and anything persisted or displayed to other users.

---

## 3. Boundary-Value Analysis

### Simple explanation

**Boundary-value analysis** tests values at and around a limit because defects often occur where behavior changes.

For a numeric range from `1` through `100`, important values include:

```text
0, 1, 2, 99, 100, 101
```

For a text field allowing up to 500 characters:

```text
499, 500, 501 characters
```

For an appointment cancellation deadline of 24 hours, important times include:

```text
24 hours + 1 second
24 hours exactly
23 hours, 59 minutes, 59 seconds
```

### Example

Requirement:

> Patients may cancel an appointment online only when the appointment begins more than 24 hours from the cancellation request time.

Potential tests:

| Appointment start time | Expected result |
|---|---|
| 24 hours + 1 second away | Allowed |
| Exactly 24 hours away | Rejected, if “more than” is literal |
| 23 hours, 59 minutes, 59 seconds away | Rejected |
| 48 hours away | Allowed |
| Already started | Rejected |

### Problem

Teams often test ordinary values but not limits.

For example, if a field accepts values from 1 to 100, testing `50` does not prove:
- `1` is accepted.
- `100` is accepted.
- `0` is rejected.
- `101` is rejected.
- Empty input has defined behavior.
- Very large input does not cause performance or storage problems.

### Solution 1: Test a typical middle value

Example:
- Enter a cancellation reason with 100 characters when the maximum is 500.

**Pros**
- Fast.
- Confirms the standard case.
- Useful as one representative test.

**Cons**
- Misses off-by-one defects.
- Does not test validation at the limit.
- Does not reveal overflow, truncation, or timeout behavior.
- Can leave legal or policy boundaries unverified.

**Problem left behind:** Typical values show ordinary behavior but not the exact points where the system must make a decision.

### Solution 2: Test just below, at, and just above each boundary

For each limit, test:
1. A value just below the boundary.
2. The exact boundary.
3. A value just above the boundary.

Example: maximum cancellation reason length of 500 characters.

| Input | Expected result |
|---|---|
| 499 characters | Accepted |
| 500 characters | Accepted |
| 501 characters | Rejected safely |
| 0 characters | Accepted if optional; rejected if required |
| Extremely large payload | Rejected early within request-size limit |

**Pros**
- Efficiently finds common defects.
- Clarifies inclusive versus exclusive requirements.
- Works well for length, count, date, amount, and threshold rules.
- Encourages precise specification wording.

**Cons**
- Does not cover all invalid categories.
- Multiple interacting boundaries can create many combinations.
- Teams may not know the correct boundary if the requirement is vague.

**Problem left behind:** Single-variable boundary checks are powerful, but systems often have interacting rules, time zones, concurrency, and external dependencies.

### Solution 3: Combine boundary analysis with state, time, and concurrency testing

For important workflows, test boundaries involving:

- **Time:** Time zones, daylight-saving transitions, clock skew, expiry.
- **State:** Draft → confirmed → cancelled → completed.
- **Authorization:** Before and after a role or clinic assignment changes.
- **Capacity:** Last available slot, one over capacity.
- **Concurrency:** Two users attempting the same action.
- **Rate limits:** Just below, at, and above allowed request volume.

Example:

```gherkin name=appointment-cancellation-boundaries.feature
Feature: Appointment cancellation policy boundaries

  Scenario: Cancellation is allowed just before the policy threshold
    Given an authenticated patient owns an appointment scheduled 24 hours and 1 second from now
    When the patient confirms cancellation
    Then the cancellation succeeds

  Scenario: Cancellation is rejected at the exact policy threshold
    Given an authenticated patient owns an appointment scheduled exactly 24 hours from now
    When the patient confirms cancellation
    Then the cancellation is rejected according to clinic policy

  Scenario: Concurrent cancellation is safe
    Given an eligible appointment is active
    When two cancellation requests for that appointment are processed concurrently
    Then the appointment is cancelled only once
    And audit records and notifications are not duplicated
```

For time-based rules:
- Store instants unambiguously.
- Clearly define the authoritative time source.
- Specify the relevant clinic or user time zone.
- Test daylight-saving transitions if the product serves applicable regions.
- Avoid trusting a client-provided timestamp for policy enforcement.

**Pros**
- Finds defects that appear only under realistic conditions.
- Improves resilience against race conditions and abuse.
- Protects business rules involving deadlines and capacity.
- Helps ensure consistent behavior across time zones and devices.

**Cons**
- More expensive to automate and maintain.
- Requires controllable clocks, test data, and concurrency tooling.
- Not every low-risk field needs this depth of testing.

### When to choose which

- Use **Solution 1** only as a basic normal-case test.
- Use **Solution 2** for every explicit numeric, length, date, or capacity limit.
- Use **Solution 3** for time-sensitive, stateful, multi-user, high-value, or security-sensitive workflows.

---

## Part 1 Decision Guide

| If you need to… | Use… |
|---|---|
| Turn a story into observable behavior | Acceptance criteria and Given/When/Then examples |
| Cover normal, invalid, and unauthorized inputs without testing everything | Equivalence classes |
| Find off-by-one and policy-threshold defects | Boundary-value analysis |
| Test security and operational behavior, not only features | Abuse cases, concurrency scenarios, and quality-focused acceptance tests |

**Next:** Part 2 covers **test-case structure**, **test data and environments**, and **traceability from requirements to tests and release evidence**.