---

# Group 4 — Testing Learning Material

Testing reduces uncertainty about whether software behaves correctly, securely, and reliably as it changes.

```text
Fast, focused tests         Unit
      ↑
Real component boundaries   Integration
      ↑
User-visible workflows      System / E2E
```

Use more fast tests than slow tests. Do not treat the pyramid as a rigid metric: choose the level that best exposes the risk.

---

## 4.1 Testing fundamentals

### Problem
Without a testing model, teams rely on manual checking and production feedback. Bugs are found late, fixes are expensive, and “coverage” may become a meaningless target.

### Solution 1 — Test pyramid
Use many unit tests, fewer integration tests, and a small number of E2E tests.

**Pros**
- Fast feedback.
- Lower maintenance cost.
- Failures are easier to diagnose.

**Cons**
- Unit tests can miss configuration, database, and UI failures.

**Remaining limitation:** isolated tests do not prove deployed components work together.

### Solution 2 — Layered verification and validation
- **Verification:** “Did we build the product correctly?” Examples: unit tests, linting, contract tests.
- **Validation:** “Did we build the correct product?” Examples: UAT, usability testing, production monitoring.

**Pros**
- Covers both implementation correctness and user needs.
- Encourages realistic checks at higher levels.

**Cons**
- Requires product, QA, and engineering collaboration.

### Solution 3 — Shift-left testing
Test requirements, designs, security assumptions, and code as early as possible.

```text
Requirement review → design review → static checks → unit → integration → E2E → production monitoring
```

**Pros**
- Earlier defects cost less to fix.
- Security and accessibility become design concerns.

**Cons**
- Requires time before implementation begins.

### Decision guide
- Use **unit tests** for logic and edge cases.
- Use **integration tests** for boundaries: database, queues, HTTP, authentication.
- Use **E2E tests** for critical user journeys only.
- Use **coverage** as a signal for untested code, not proof of quality.

### Validation
- Track branch coverage for critical logic, not just line coverage.
- Review whether tests assert behavior rather than implementation details.
- Include accessibility, authorization, error paths, and invalid input in test design.

---

## 4.2 Test strategy and plan

### Problem
Without an agreed strategy, teams test inconsistently, environments drift, test data becomes unsafe, and release decisions become subjective.

### Solution 1 — Basic test plan
Document scope, owners, environments, and test types.

**Pros**
- Establishes shared expectations.
- Prevents obvious gaps.

**Cons**
- Can become a stale document if it is too broad.

**Remaining limitation:** a checklist alone does not focus effort on the riskiest failures.

### Solution 2 — Risk-based test strategy
Prioritize testing by impact and likelihood.

```text
Risk = likelihood of failure × impact if it fails
```

Example high-risk areas:
- Payment, authorization, personal data, data deletion.
- Public APIs and backward compatibility.
- Login, password reset, account recovery.

**Pros**
- Directs effort to where failure matters most.
- Avoids spending equal effort on low-value paths.

**Cons**
- Requires informed risk assessment and periodic review.

### Solution 3 — Explicit entry and exit criteria
Define:
- **Entry criteria:** conditions before testing begins.
- **Exit criteria:** conditions required for release.

Example:
- Entry: deployment succeeds, test environment is healthy, approved test data exists.
- Exit: critical tests pass, no unresolved critical defects, security gates pass.

**Pros**
- Creates objective release readiness.
- Makes blocked work visible.

**Cons**
- Criteria must be practical; impossible thresholds encourage bypassing controls.

### Decision guide
- Use a **lightweight plan** for small changes.
- Add **risk assessment** for user-facing, regulated, security-sensitive, or high-revenue systems.
- Use formal **entry/exit criteria** for production releases and shared platforms.

### Validation
- Keep production-like environments separate from production.
- Use synthetic or anonymized test data; never copy personal data without legal and security approval.
- Manage secrets through a secret manager, not source control.
- Version test environments and infrastructure configuration.

---

## 4.3 Unit testing

### Problem
Business rules embedded in code can regress silently. Manual testing is slow and cannot practically cover every boundary condition.

### Solution 1 — Arrange-Act-Assert (AAA)
Structure each test into setup, action, and expected result.

**Pros**
- Readable and consistent.
- Makes the behavior under test clear.

**Cons**
- Does not itself guarantee good boundaries or meaningful assertions.

**Remaining limitation:** tests can still depend on databases, clocks, random values, or network services.

### Solution 2 — Isolation
Test one unit of behavior while replacing external dependencies with controlled collaborators.

**Pros**
- Fast and deterministic.
- Failures identify the faulty logic quickly.

**Cons**
- Excessive mocking can make tests mirror implementation rather than behavior.

### Solution 3 — Test-driven development (TDD)
Write a failing behavioral test, implement the smallest change to pass it, then refactor.

```text
Red → Green → Refactor
```

**Pros**
- Encourages small, testable design.
- Protects behavior while refactoring.

**Cons**
- Not a substitute for integration or security testing.
- Works poorly when requirements are unclear or tests are overly implementation-specific.

### TypeScript example
```typescript name=discount-service.test.ts
import { describe, expect, it } from "vitest";

function calculateDiscount(subtotalCents: number, isMember: boolean): number {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0) {
    throw new RangeError("subtotalCents must be a non-negative safe integer.");
  }

  return isMember ? Math.floor(subtotalCents * 0.9) : subtotalCents;
}

describe("calculateDiscount", () => {
  it("applies a 10% discount for members", () => {
    // Arrange
    const subtotalCents = 2_500;

    // Act
    const totalCents = calculateDiscount(subtotalCents, true);

    // Assert
    expect(totalCents).toBe(2_250);
  });

  it("rejects invalid currency amounts", () => {
    expect(() => calculateDiscount(-1, false)).toThrow(RangeError);
  });
});
```

### Decision guide
- Use **AAA** for every unit test.
- Use **isolation** when the dependency is slow, unreliable, costly, or external.
- Use **TDD** when implementing complex rules or making risky refactors.

### Validation
- Test boundaries: zero, maximum supported value, empty input, invalid input, authorization outcomes.
- Use integer minor currency units rather than floating-point money.
- Keep tests deterministic: inject clocks and random generators where needed.
- Avoid testing private implementation details.

---

## 4.4 Test doubles (implementation level)

### Problem
Real dependencies can make tests slow, expensive, nondeterministic, or unsafe—for example, charging a payment provider during a unit test.

### Solution 1 — Simple doubles
- **Dummy:** passed only to satisfy a parameter.
- **Stub:** returns predefined values.
- **Spy:** records calls for later assertions.
- **Mock:** verifies expected interactions.
- **Fake:** working lightweight implementation, such as an in-memory repository.

**Pros**
- Enables isolated, fast tests.
- Allows error and edge-case simulation.

**Cons**
- Can diverge from real behavior.

**Remaining limitation:** a passing unit test may still fail when calling the real dependency.

### Solution 2 — Prefer fakes and contract tests for important boundaries
Use fakes for simple domain dependencies and contract/integration tests for external boundaries.

**Pros**
- Less brittle than interaction-heavy mocks.
- Better confidence at integration points.

**Cons**
- Requires maintaining contracts and test infrastructure.

### Mocking pitfalls
- Mocking internal methods couples tests to implementation.
- Mocking HTTP clients without checking real request format misses integration failures.
- Verifying every call makes refactoring unnecessarily difficult.
- In-memory database fakes may behave differently from production databases.

### Decision guide
- Use a **stub** to control dependency output.
- Use a **spy** when the observable outcome is an important side effect.
- Use a **mock** only when the interaction itself is contractual.
- Use a **fake** when a small realistic implementation is cheap and trustworthy.
- Add **integration tests** whenever the real dependency behavior matters.

### Validation
- Never point tests at production services.
- Use test-specific credentials with least privilege.
- Ensure test doubles cannot accidentally send emails, make payments, or mutate real data.
- Test authorization logic with both permitted and denied identities.

---

## 4.5 Integration testing

### Problem
Components that pass isolated tests can fail together due to SQL differences, serialization, migrations, authentication, network configuration, or API incompatibility.

### Solution 1 — In-process integration tests
Test multiple application layers together, replacing only external infrastructure where appropriate.

**Pros**
- More realistic than unit tests.
- Usually still fast enough for pull requests.

**Cons**
- May miss actual database, broker, or container behavior.

**Remaining limitation:** substitutes may not reflect production infrastructure.

### Solution 2 — Real ephemeral dependencies with Testcontainers
Run real dependencies, such as PostgreSQL or Redis, in isolated containers during tests.

**Pros**
- Tests actual database and service behavior.
- Reproducible local and CI environments.
- Reduces “works on my machine” failures.

**Cons**
- Slower than unit tests.
- Requires container runtime support in developer and CI environments.

### Solution 3 — Consumer-driven contract testing
Use a tool such as Pact to verify that API consumers and providers agree on request and response contracts.

**Pros**
- Finds breaking API changes before deployment.
- Faster and more focused than full end-to-end environments.

**Cons**
- Does not prove the complete deployed journey works.
- Requires disciplined contract versioning.

### Decision guide
- Use **in-process tests** for application wiring and request handling.
- Use **Testcontainers** for persistence, cache, queue, and database semantics.
- Use **contract tests** for independently deployed services.
- Keep a small number of full environment tests for critical paths.

### Validation
- Apply migrations from scratch in tests.
- Use isolated databases per test or transaction cleanup to avoid state leakage.
- Validate authentication, authorization, schema validation, rate limiting, and error mappings.
- Do not log secrets, tokens, or personal data on failures.
- Pin container image versions and scan them for known vulnerabilities.

---

## 4.6 System and E2E testing

### Problem
Integration tests may still miss browser behavior, routing, rendering, cookies, client-side validation, and user-visible workflow failures.

### Solution 1 — UI automation with Playwright
Automate a browser against a deployed or locally hosted application.

**Pros**
- Exercises the product as users experience it.
- Supports modern browser engines and accessibility-focused locators.
- Can test login, navigation, uploads, and critical workflows.

**Cons**
- Slower and more expensive to maintain.
- Can become flaky if tests depend on timing or shared state.

**Remaining limitation:** browser automation alone cannot fully diagnose whether a failure is UI, API, data, or environment related.

### Solution 2 — Stable test design
Use:
- User-facing locators such as role and label.
- Explicit application-ready conditions, not arbitrary sleep calls.
- Isolated test accounts and data.
- API setup for preconditions when the UI is not what is being tested.
- Trace, screenshot, and video artifacts for failures.

**Pros**
- Reduces flakes.
- Produces actionable failure evidence.

**Cons**
- Requires intentional testability design.

### Decision guide
- Use E2E tests for a small number of business-critical workflows.
- Use integration tests for permutations and detailed error cases.
- Avoid E2E tests for pure business-rule coverage.

### Validation
- Test keyboard-only use and visible focus behavior.
- Prefer locators based on accessible names; this improves both resilience and accessibility.
- Use non-production accounts, isolated tenants, and least-privileged credentials.
- Run a smoke suite on every deployment; run broader suites nightly or before release.
- Quarantine flaky tests only temporarily and create an owner and fix deadline.

---

## 4.7 Acceptance testing / BDD

### Problem
Requirements written only in prose are ambiguous. Teams can implement technically correct behavior that does not meet user expectations.

### Solution 1 — Acceptance criteria
Define clear examples of expected user-visible behavior before implementation.

**Pros**
- Aligns product, engineering, and QA.
- Reduces ambiguity.

**Cons**
- Can become vague if written as generic statements such as “works correctly.”

**Remaining limitation:** prose criteria may still be interpreted differently.

### Solution 2 — Executable specifications / BDD
Express examples in a shared format:

```text
Given an authenticated administrator
When they deactivate a user account
Then the user cannot create a new session
And existing sessions are revoked
```

**Pros**
- Creates a common product vocabulary.
- Scenarios can become automated acceptance tests.

**Cons**
- Excessive scenario detail can duplicate implementation and become costly to maintain.

### Solution 3 — User acceptance testing (UAT)
Representative business users validate that the solution supports real workflows.

**Pros**
- Validates business fitness, not only technical correctness.
- Finds workflow and usability issues.

**Cons**
- UAT should not be the first time testing occurs.
- Requires prepared data, scenarios, and decision-makers.

### Decision guide
- Use **acceptance criteria** for all user stories.
- Use **BDD** for complex rules, regulated behavior, or shared domain language.
- Use **UAT** before release when business approval is required.

### Validation
- Include denied access, error recovery, and accessibility scenarios.
- Avoid putting sensitive customer data into scenarios or test reports.
- Treat examples as behavior specifications, not UI implementation scripts.

---

## 4.8 Non-functional testing

### Problem
A system can be functionally correct yet unsafe, inaccessible, too slow, unstable under load, or unusable in supported environments.

### Solution 1 — Targeted non-functional checks
Add focused testing by risk:

- **Performance:** load, stress, soak.
- **Security:** SAST, dependency scanning, DAST, penetration tests.
- **Accessibility:** automated scans and manual keyboard/screen-reader checks.
- **Internationalization:** locale, date, number, currency, pluralization, right-to-left layout.
- **Compatibility:** supported browsers, devices, operating systems.
- **Resilience/chaos:** controlled dependency failures and recovery.

**Pros**
- Directly tests production quality attributes.
- Finds failures functional tests do not detect.

**Cons**
- Requires realistic environments, telemetry, and clear thresholds.

**Remaining limitation:** one-off tests do not ensure quality remains stable over time.

### Solution 2 — Continuous quality gates and monitoring
Run automated checks in CI and monitor real service-level indicators after deployment.

**Pros**
- Detects regressions continuously.
- Connects testing to operational behavior.

**Cons**
- Thresholds must be meaningful to avoid alert fatigue or bypasses.

### Decision guide
- Use **load tests** for expected concurrent demand.
- Use **stress tests** to find failure behavior beyond capacity.
- Use **soak tests** to expose leaks and degradation over time.
- Use **SAST** on code changes; use **DAST** against approved test environments.
- Use **manual accessibility testing** for interactions automation cannot judge.
- Use **chaos experiments** only in controlled environments with rollback plans.

### Validation
- Establish performance budgets, such as p95 latency and error-rate targets.
- Require HTTPS, secure headers, authentication, authorization, input validation, and secret scanning.
- Never run intrusive security testing against systems without explicit authorization.
- Test reduced motion, zoom, keyboard use, color contrast, and assistive technology.
- Ensure monitoring avoids collecting unnecessary personal data.

---

## 4.9 Advanced techniques

### Problem
Example-based tests may miss unexpected input combinations, weak assertions, parser flaws, and edge cases that humans did not anticipate.

### Solution 1 — Property-based testing
Generate many inputs and assert universal properties.

Example properties:
- Sorting preserves the number of items.
- Encoding then decoding returns the original valid value.
- A total is never negative.

**Pros**
- Finds edge cases efficiently.
- Encourages precise invariants.

**Cons**
- Failures can be harder to understand without good shrinking and diagnostics.

**Remaining limitation:** generated valid inputs may not expose vulnerabilities caused by malformed or adversarial data.

### Solution 2 — Fuzzing
Feed malformed, random, or adversarial inputs to parsers, APIs, and file handlers.

**Pros**
- Effective for crashes, hangs, parsing flaws, and input-validation defects.

**Cons**
- Requires strict isolation and resource limits.
- May produce difficult-to-reproduce failures unless inputs are saved.

### Solution 3 — Mutation testing
Intentionally alter code and determine whether tests fail.

**Pros**
- Measures assertion strength better than line coverage.
- Finds tests that execute code but do not verify behavior.

**Cons**
- Computationally expensive.
- Not ideal for every pull request.

### Solution 4 — Snapshot and exploratory testing
- **Snapshot tests:** compare rendered or serialized output to an approved baseline.
- **Exploratory testing:** a tester learns, designs, and executes tests dynamically.

**Pros**
- Snapshots catch unexpected output changes.
- Exploratory testing finds usability and workflow issues.

**Cons**
- Snapshots can become noisy approvals.
- Exploratory sessions require notes and skilled testers.

### Decision guide
- Use **property-based testing** for transformations and business invariants.
- Use **fuzzing** for parsers, uploads, URLs, and untrusted input.
- Use **mutation testing** periodically for critical modules.
- Use **snapshots** for stable, meaningful output—not large opaque objects.
- Use **exploratory testing** for new features and high-uncertainty workflows.

### Validation
- Bound generated input sizes and execution time.
- Store fuzzing seeds and minimized failing cases.
- Never fuzz production without explicit approval and safety controls.
- Review snapshot diffs as carefully as code diffs.

---

## 4.10 Regression and CI test automation

### Problem
As software grows, rerunning everything becomes slow. Teams either delay feedback or skip testing, allowing regressions to reach production.

### Solution 1 — Full automated regression suite
Run all relevant tests before releases or on a schedule.

**Pros**
- Broad confidence.
- Detects interactions missed by targeted testing.

**Cons**
- Slow and expensive at scale.

**Remaining limitation:** developers still need fast feedback before merging.

### Solution 2 — Test selection and parallelization
Select tests based on changed files, dependencies, labels, or risk; split independent tests across workers.

**Pros**
- Faster pull-request feedback.
- Better CI utilization.

**Cons**
- Incorrect selection can miss regressions.
- Parallel tests must avoid shared state.

### Solution 3 — Quality gates
Require key checks before merge or deployment:
- Build succeeds.
- Required tests pass.
- No critical vulnerabilities.
- Required code review and policy checks pass.
- Coverage does not decline below agreed thresholds for changed critical code.

**Pros**
- Prevents known-bad changes from progressing.
- Creates consistent standards.

**Cons**
- Overly strict or unreliable gates encourage bypassing them.

### Decision guide
- Run **unit, lint, type, and security checks** on every pull request.
- Run **targeted integration and E2E smoke tests** on every pull request or deployment.
- Run **full regression, broad compatibility, and soak suites** nightly or before release.
- Parallelize only tests that are data-isolated and deterministic.

### Validation
- Make CI logs, traces, and artifacts easy to access.
- Retry infrastructure failures, not genuine assertion failures; retries must not hide flakes.
- Use ephemeral credentials and redact secrets in output.
- Track queue time, execution time, flake rate, and failure causes.
- Cache dependencies safely; verify lockfiles and dependency integrity.

---

## 4.11 Defect management

### Problem
Without a defect process, issues are duplicated, impact is unclear, urgent work interrupts planned work, and recurring causes remain unresolved.

### Solution 1 — Consistent bug reports and lifecycle
A useful report includes:
- Clear title and observed behavior.
- Expected behavior.
- Reproduction steps.
- Environment and version.
- Evidence: logs, screenshots, traces, sanitized payloads.
- Impact and workaround.

Typical lifecycle:

```text
New → Triaged → In progress → Resolved → Verified → Closed
                  ↓
              Deferred / Duplicate / Cannot reproduce
```

**Pros**
- Improves prioritization and reproducibility.
- Creates an auditable history.

**Cons**
- Process overhead if every minor observation requires extensive documentation.

**Remaining limitation:** reporting does not prevent recurrence.

### Solution 2 — Severity, priority, and root cause analysis
- **Severity:** technical/user impact if unresolved.
- **Priority:** order in which the organization should address it.

Example:
- A rare data-loss defect: high severity, high priority.
- A cosmetic issue in a soon-to-be-retired page: low severity, low priority.
- A common workaroundable defect before a major launch: moderate severity, high priority.

Root cause analysis should identify system contributors, not blame individuals.

**Pros**
- Prevents repeated classes of defects.
- Improves processes, test coverage, and design.

**Cons**
- Deep analysis is not necessary for every low-impact bug.

### Decision guide
- Use a lightweight report for routine defects.
- Require detailed reproduction and security handling for high-impact issues.
- Perform root cause analysis for security incidents, outages, repeated regressions, data loss, and major escapes.

### Validation
- Do not include secrets, access tokens, or unnecessary personal data in bug trackers.
- Restrict security vulnerability reports to appropriate audiences.
- Link fixes to tests that would have caught the defect.
- Track time to triage, reopen rate, defect escape rate, and recurring root causes.

---

## 4.12 Test metrics and reporting

### Problem
Without measurable signals, teams cannot see whether quality is improving, where defects originate, or whether delivery speed is becoming unsafe.

### Solution 1 — Basic test metrics
Useful measures include:
- Pass/fail status.
- Duration.
- Flake rate.
- Test count by level.
- Code coverage, especially branch coverage in critical modules.

**Pros**
- Easy to collect.
- Helps identify unstable or slow suites.

**Cons**
- Metrics can be gamed; high coverage does not prove useful assertions.

**Remaining limitation:** test metrics alone do not show delivery and operational performance.

### Solution 2 — Defect and delivery metrics
- **Defect density:** defects relative to size or scope, interpreted carefully.
- **Escaped defects:** defects found after release.
- **Change failure rate:** deployments causing incidents, rollback, or hotfix.
- **DORA metrics:** deployment frequency, lead time for changes, change failure rate, time to restore service.

**Pros**
- Connects engineering practices with customer outcomes.
- Reveals bottlenecks and operational risk.

**Cons**
- Context matters: raw comparisons across teams can be misleading and harmful.

### Solution 3 — Action-oriented reporting
Report trends, risk, and decisions—not vanity numbers.

```text
Signal: E2E flake rate increased from 1% to 8%.
Impact: release confidence and CI time are declining.
Action: assign owners, isolate shared test data, remove fixed delays.
Success measure: flake rate below 2% for four weeks.
```

**Pros**
- Converts metrics into improvement work.
- Encourages learning rather than blame.

**Cons**
- Requires consistent definitions and trustworthy data.

### Decision guide
- Use **coverage** to find untested areas, not as a standalone target.
- Use **flake rate and duration** to improve CI reliability.
- Use **escaped defects and change failure rate** to assess release quality.
- Use **DORA metrics** to identify delivery-system constraints.

### Validation
- Segment metrics by service, risk level, and test type.
- Avoid measuring individual developer productivity through test counts or defect counts.
- Protect sensitive operational data and restrict access appropriately.
- Set alerts on meaningful trend changes, not every isolated failure.
- Review metrics regularly and retire measures that do not drive useful decisions.

---

# 4.1 Testing Fundamentals

## Goal

Understand **why tests exist**, which test level to use, and why coverage alone does not prove software quality.

---

## 1. Problem: Finding defects too late

Without automated testing, a team commonly discovers defects:

- During manual QA
- After deployment
- Through user reports
- During incidents or security investigations

Late discovery costs more because the original context is gone and a defect can affect users, data, revenue, or trust.

```text
No early tests:

Requirement → Code → Deploy → User finds defect
                              ↑
                         expensive fix

With early tests:

Requirement → Test/design review → Code → Automated tests → Deploy
                                      ↑
                                 faster fix
```

Testing does **not** prove software has no defects. It provides evidence that important behavior works for the scenarios tested.

---

## 2. Solution 1: The test pyramid

Use multiple test levels, with more tests at lower, faster levels.

```text
              /\
             /E2E\       Few: critical user workflows
            /─────\
           /Integr.\     Some: boundaries and component interaction
          /───────\
         /  Unit   \     Many: rules, calculations, validation
        /──────────\
```

### Unit tests

Test a small piece of logic in isolation.

Examples:
- Tax or discount calculation
- Password policy validation
- Permission decision rules
- Date and currency formatting rules

**Pros**
- Very fast
- Cheap to run frequently
- Easy to diagnose when failing
- Good for edge cases

**Cons**
- Cannot prove real services work together
- Can become tightly coupled to implementation if poorly designed

### Integration tests

Test multiple real components together.

Examples:
- API endpoint with authentication and a real test database
- Repository behavior against PostgreSQL
- Service publishing to a queue
- API client serialization and error handling

**Pros**
- Finds configuration and boundary defects
- Verifies real infrastructure behavior
- Higher confidence than isolated tests

**Cons**
- Slower than unit tests
- Requires environment and test-data management
- Failures can be harder to diagnose

### End-to-end (E2E) tests

Test a complete user workflow through the real user interface.

Examples:
- User signs in and updates their profile
- Administrator disables an account
- Customer completes a checkout flow

**Pros**
- Validates user-visible behavior
- Finds browser, routing, cookie, and UI integration issues
- Confirms critical workflows work across layers

**Cons**
- Slowest test type
- More prone to flaky failures
- More expensive to maintain
- Poor fit for every edge case

### Limitation of the pyramid

A pyramid alone does not tell you *what* to test. You still need to select tests based on risk.

For example, a password-reset flow may deserve E2E coverage even if it is used less often than a low-risk page, because failure has high security and business impact.

---

## 3. Solution 2: Verification and validation

The pyramid addresses *where* to test. Verification and validation address *what question* a test answers.

| Concept | Key question | Examples |
|---|---|---|
| **Verification** | Did we build the software correctly? | Unit tests, linting, type checking, API contract tests |
| **Validation** | Did we build the correct software? | UAT, usability sessions, accessibility review, production feedback |

```text
Requirement says:
"Only administrators can deactivate accounts."

Verification:
Does the authorization code deny non-administrators?

Validation:
Does deactivation achieve the intended business outcome,
including revoking existing sessions and communicating the outcome clearly?
```

### Pros
- Avoids treating technical correctness as customer success.
- Encourages collaboration among product, engineering, security, and QA.
- Helps uncover ambiguous requirements before code is written.

### Cons
- Validation often needs real users or business stakeholders.
- It cannot be fully replaced by automated tests.

### Remaining limitation

Verification and validation can still occur too late if they only happen after feature development is complete.

---

## 4. Solution 3: Shift-left testing

**Shift-left** means moving quality activities earlier in the delivery lifecycle.

```text
Later feedback
Requirements → Design → Build → Test → Deploy → Monitor
     ↑            ↑        ↑
Earlier feedback: examples, threat modeling, accessibility review,
input rules, test design, static analysis
```

### Practical shift-left activities

| Stage | Useful activity |
|---|---|
| Requirements | Define acceptance criteria and invalid-input cases |
| Design | Review authorization boundaries, threat model, API contracts |
| Development | Type checking, linting, unit tests, secret scanning |
| Pull request | Code review, dependency scan, integration tests |
| Deployment | Smoke tests, migration validation, monitoring |
| Production | Error-rate, latency, and security-event monitoring |

### Pros
- Finds misunderstandings before implementation becomes expensive.
- Makes security and accessibility part of design, not release blockers.
- Reduces rework and production defects.

### Cons
- Requires collaboration earlier in planning.
- Teams may initially perceive it as slowing delivery.

### Why it helps

A five-minute review of an authorization requirement is much cheaper than remediating a production privilege-escalation defect.

---

## 5. Solution 4: Coverage as a diagnostic signal

**Code coverage** reports which code executes during tests.

Common forms:

- **Line coverage:** which executable lines ran.
- **Branch coverage:** which decision outcomes ran, such as both sides of an `if`.
- **Function coverage:** which functions ran.

```text
if (user.isAdmin) {
  deactivateAccount();
} else {
  denyRequest();
}

A test that covers only the administrator case can show line coverage,
but it does not verify that non-administrators are denied.
```

### Pros
- Identifies code that no test exercises.
- Helps reveal untested branches in critical logic.
- Useful as a trend and pull-request review signal.

### Cons
- High coverage does not mean correct behavior.
- Tests may execute code without meaningful assertions.
- Coverage targets can incentivize low-value tests.

### Better coverage question

Instead of asking:

> “Is coverage above 80%?”

Ask:

> “Have we tested the important behaviors, permissions, failure paths, and boundaries?”

### Decision guide

| Situation | Recommended focus |
|---|---|
| Pure business logic | High unit and branch coverage |
| Database or queue behavior | Integration tests with real dependencies |
| Login, account recovery, payment, deletion | E2E smoke coverage plus security-focused integration tests |
| New requirement | Acceptance examples before implementation |
| Security-sensitive endpoint | Authorization, invalid input, rate limiting, audit behavior |
| Accessibility-sensitive UI | Keyboard, semantic roles, focus, contrast, assistive technology checks |

---

## 6. TypeScript example: meaningful branch coverage

This example tests a permission rule, including the critical deny-by-default path.

```typescript name=account-permissions.test.ts
import { describe, expect, it } from "vitest";

type Role = "administrator" | "member";

interface Actor {
  role: Role;
  userId: string;
}

interface Account {
  id: string;
  ownerId: string;
}

function canDeactivateAccount(actor: Actor, account: Account): boolean {
  // Deny by default: only administrators may deactivate accounts.
  return actor.role === "administrator" && actor.userId !== account.id;
}

describe("canDeactivateAccount", () => {
  const account: Account = {
    id: "account-123",
    ownerId: "user-456",
  };

  it("allows an administrator to deactivate another account", () => {
    const actor: Actor = {
      role: "administrator",
      userId: "admin-789",
    };

    expect(canDeactivateAccount(actor, account)).toBe(true);
  });

  it("denies a non-administrator", () => {
    const actor: Actor = {
      role: "member",
      userId: "user-456",
    };

    expect(canDeactivateAccount(actor, account)).toBe(false);
  });

  it("denies an administrator attempting to deactivate their own account", () => {
    const actor: Actor = {
      role: "administrator",
      userId: "account-123",
    };

    expect(canDeactivateAccount(actor, account)).toBe(false);
  });
});
```

### Why this test is useful

It checks the success path and two denial paths:

```text
Administrator + another account → allowed
Member + any account            → denied
Administrator + own account     → denied
```

This is stronger than testing only that an administrator can deactivate an account.

> In a real application, enforce authorization again at the API or service boundary. Client-side checks are only usability controls and cannot secure a server.

---

## 7. Security, accessibility, performance, and operations

### Security
Test:
- Unauthenticated access is denied.
- Unauthorized roles are denied.
- Inputs are validated at trust boundaries.
- Sensitive details are not exposed in error messages.
- Rate limits and account-lockout behavior work for authentication flows.
- Audit events are generated where required without logging secrets.

### Accessibility
Test:
- Important workflows work using only a keyboard.
- Inputs have accessible labels and error messages.
- Focus moves predictably after validation failures.
- Automated browser checks use accessible locators, such as role and label.

### Performance
- Keep the majority of tests fast so developers run them often.
- Do not use fixed delays in automated tests.
- Measure slow tests and move expensive checks to appropriate CI stages.

### Scalability and operations
- Run unit tests on every change.
- Run integration and smoke tests in CI.
- Store E2E diagnostics—traces, screenshots, and logs—securely and redact sensitive data.
- Monitor production because tests cannot cover every real-world condition.

---

## 8. Summary

```text
Unit tests        → Fast confidence in logic
Integration tests → Confidence at technical boundaries
E2E tests         → Confidence in critical user journeys
Verification      → Built correctly
Validation        → Built the right thing
Shift-left        → Find defects earlier
Coverage          → Find gaps, not proof of quality
```

**Recommended default:** write fast unit tests for rules, integration tests for infrastructure boundaries, and a small E2E suite for high-risk user journeys.

---

# 4.2 Test Strategy and Plan

## Goal

Decide **what to test, where, with what data, and when a release is safe enough**.

A test strategy is not a large document. It is a risk-based agreement that prevents important gaps.

---

## 1. Problem: Testing happens inconsistently

Without a test strategy:

- Teams test whatever is easiest rather than what is riskiest.
- Critical paths such as authentication or data deletion may lack coverage.
- Test environments differ from production.
- Test data may expose personal or sensitive information.
- Release decisions become subjective: “It seems fine.”

```text
No strategy:

Feature complete → ad hoc testing → uncertain release decision

With a strategy:

Risk assessment → test scope → environments/data → quality gates → release decision
```

---

## 2. Solution 1: Define scope

Start by documenting what is **in scope** and **out of scope**.

Example for an account-deactivation feature:

| In scope | Out of scope |
|---|---|
| Administrator authorization | Redesigning account-management UI |
| Session revocation | Historical account migration |
| Audit log event | Bulk deactivation feature |
| API validation and error handling | Unrelated notification templates |

### Pros
- Prevents assumptions.
- Makes effort estimable.
- Helps reviewers identify missed requirements.

### Cons
- Scope may become stale when requirements change.

### Remaining limitation
Scope says what to test, but it does not identify what deserves the most effort.

---

## 3. Solution 2: Use risk-based testing

Prioritize based on the chance of failure and impact if it fails.

```text
Risk = likelihood × impact
```

| Area | Likelihood | Impact | Priority |
|---|---:|---:|---|
| Authorization bypass | Medium | Critical | Highest |
| Session revocation failure | Medium | High | High |
| Validation error wording | Medium | Low | Medium |
| Icon alignment | Low | Low | Low |

### High-risk areas

Typically require deeper testing:

- Authentication, authorization, and session management
- Payments and financial calculations
- Data deletion, export, retention, and migration
- Personally identifiable or regulated data
- Public APIs and backward compatibility
- High-traffic or revenue-critical workflows
- Third-party integrations

### Pros
- Focuses time where failure matters most.
- Supports pragmatic decisions under delivery constraints.
- Makes residual risk visible to stakeholders.

### Cons
- Risk estimates are subjective.
- Teams must revisit risk when architecture or threats change.

### Remaining limitation
Knowing risk does not define when testing may begin or when a release can proceed.

---

## 4. Solution 3: Define entry and exit criteria

### Entry criteria

Conditions required before test execution starts.

Example:

```text
- Build succeeds.
- Test environment is deployed and healthy.
- Required migrations have run.
- Test accounts and synthetic data are available.
- API contract is published or agreed.
- Required secrets are injected through secure environment configuration.
```

### Exit criteria

Conditions required before release approval.

Example:

```text
- Unit, integration, and required E2E tests pass.
- No unresolved critical or high-severity defects.
- Authorization and input-validation tests pass.
- Dependency and secret scanning report no unapproved critical findings.
- Performance budget is met for the affected endpoint.
- Accessibility checks pass for affected user flows.
- Rollback procedure is documented and verified.
```

### Pros
- Makes release decisions objective.
- Identifies blockers early.
- Avoids relying on personal confidence.

### Cons
- Overly rigid criteria can delay low-risk changes.
- Criteria that are regularly bypassed lose credibility.

### Decision guide

| Change type | Suggested exit criteria |
|---|---|
| Documentation-only change | Build and link validation |
| Internal low-risk feature | Unit tests, type checks, linting |
| API change | Unit, integration, contract, backward-compatibility tests |
| Authentication change | Security tests, integration tests, E2E smoke test, threat review |
| Database migration | Migration test, backup/rollback validation, performance checks |
| Public UI workflow | Unit/integration tests, E2E smoke test, accessibility validation |

---

## 5. Solution 4: Use appropriate environments

A test environment must be realistic enough to test the risk, while remaining safe and cost-effective.

```text
Developer machine → CI environment → Staging / pre-production → Production
       fast              repeatable          production-like        monitored
```

### Environment options

| Environment | Best use | Main limitation |
|---|---|---|
| Local development | Fast feedback | May differ from CI and production |
| CI ephemeral environment | Repeatable automated tests | May not model full production scale |
| Shared test/staging | Cross-service and stakeholder testing | Shared state causes instability |
| Production | Monitoring, canary checks | Must avoid unsafe experiments |

### Pros
- Reduces configuration-related surprises.
- Enables reproducible tests.
- Supports safer pre-release validation.

### Cons
- Production-like environments cost time and money.
- Shared environments create data collisions and flaky tests.

### Recommended approach

- Use containers or Testcontainers for local and CI dependencies.
- Use short-lived, isolated environments for pull requests when practical.
- Keep infrastructure configuration version-controlled.
- Maintain environment parity for security configuration, database engine/version, and critical integrations.
- Never use production credentials in test environments.

---

## 6. Solution 5: Manage test data securely

### Problem with uncontrolled test data

Using copied production data creates major risk:

```text
Production data copied to test environment
        ↓
Personal data, secrets, payment data, or identifiers exposed
        ↓
Privacy, compliance, and security incident risk
```

### Safer data approaches

| Approach | Use when | Limitation |
|---|---|---|
| Synthetic data | Default choice | May miss real-world data patterns |
| Masked/anonymized data | Realistic shapes are essential | Must be verified; weak masking can be reversible |
| Generated fixture data | Unit/integration tests | Requires maintenance |
| Ephemeral per-test data | Parallel tests | Setup cost and cleanup complexity |

### Security requirements

- Prefer synthetic data by default.
- Do not store credentials, API keys, tokens, or production secrets in fixtures.
- Use test identities with least privilege.
- Ensure logs and screenshots redact personal data and tokens.
- Apply data retention and deletion policies to test systems.
- Isolate tenants, accounts, and database schemas for parallel tests.

---

## 7. TypeScript example: risk-based test plan as code

A small structured risk register can make testing decisions visible and reviewable.

```typescript name=feature-test-strategy.ts
type RiskLevel = "low" | "medium" | "high" | "critical";

interface TestRisk {
  area: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  requiredChecks: readonly string[];
}

const accountDeactivationRisks: readonly TestRisk[] = [
  {
    area: "Authorization",
    likelihood: "medium",
    impact: "critical",
    requiredChecks: [
      "Unit test deny-by-default permission rules",
      "Integration test API returns 403 for unauthorized users",
      "E2E test administrator workflow",
    ],
  },
  {
    area: "Session revocation",
    likelihood: "medium",
    impact: "high",
    requiredChecks: [
      "Integration test active sessions are invalidated",
      "Verify revoked tokens cannot access protected endpoints",
    ],
  },
  {
    area: "Audit logging",
    likelihood: "low",
    impact: "medium",
    requiredChecks: [
      "Integration test audit event is written",
      "Verify logs do not contain secrets or access tokens",
    ],
  },
] as const;

export function requiredChecksFor(
  risks: readonly TestRisk[],
): readonly string[] {
  return risks.flatMap((risk) => risk.requiredChecks);
}

console.log(requiredChecksFor(accountDeactivationRisks));
```

### Why this adds value

The plan makes the connection explicit:

```text
Risk → required checks → release evidence
```

It also makes security testing a defined requirement rather than an optional final step.

---

## 8. Decision guide

### Use a lightweight strategy when

- The change is small and isolated.
- The risk is low.
- Existing patterns and automated checks already cover the area.

Example: correcting validation text.

### Use a detailed strategy when

- Changing authentication, authorization, or payment behavior.
- Adding a database migration.
- Integrating with an external service.
- Handling sensitive data.
- Releasing a public API or high-traffic feature.
- Working in a regulated domain.

### Prefer which test type?

```text
Business rule or input validation?
→ Unit test

Database, queue, authentication middleware, or API behavior?
→ Integration test

Service-to-service API compatibility?
→ Contract test

Critical user workflow in a browser?
→ E2E test

Business stakeholder acceptance?
→ UAT / acceptance scenario
```

---

## 9. Validation considerations

### Security
- Test authentication and authorization separately.
- Verify unauthorized requests are denied by default.
- Validate input at API boundaries.
- Scan source, dependencies, containers, and infrastructure configuration.
- Use secret managers and environment variables; never hardcode credentials.

### Accessibility
For affected UI flows, verify:

- Keyboard-only navigation.
- Accessible names for controls.
- Error messages announced and associated with inputs.
- Focus management after errors, dialogs, and navigation.
- Contrast and zoom behavior.

### Performance and scalability
- Define measurable budgets, such as p95 response time and error rate.
- Test expected concurrent use for critical endpoints.
- Test database migrations against realistic volumes before production.
- Include queue backlog, timeouts, retries, and rate limits in service tests.

### Operations
- Define monitoring before release: error rates, latency, failed logins, and dependency health.
- Document rollback steps for schema and deployment changes.
- Store test artifacts securely and redact sensitive content.
- Record known risks explicitly when accepting an exception to a quality gate.

---

## 10. Summary

```text
Scope             → What is and is not tested
Risk-based testing → Where to invest effort
Entry criteria     → When testing can start
Exit criteria      → When release is acceptable
Environments       → Where confidence is established
Test data          → How tests remain safe and realistic
```

**Recommended default:** create a short, risk-based test strategy for each meaningful change; increase detail for security-sensitive, externally integrated, data-changing, or high-impact work.

---

# 4.3 Unit Testing

## Goal

Use fast, isolated tests to verify business rules, input validation, and error handling close to the code that implements them.

---

## 1. Problem: Logic defects are expensive to find late

Without unit tests, small mistakes in calculations, validation, permissions, and state transitions may only be found through manual QA or production incidents.

```text
No unit tests:
Code → integration environment → manual test → defect found late

With unit tests:
Code → fast local test → defect found immediately
```

Examples of logic suited to unit testing:

- Price, tax, and discount calculations
- Permission decisions
- Input validation
- Date and time rules
- State transitions
- Error mapping
- Data transformations

Unit tests do **not** prove that a browser, database, or external API works correctly. They prove that a focused unit of behavior works under controlled conditions.

---

## 2. Solution 1: Arrange–Act–Assert

Structure tests in three clear stages.

```text
Arrange → create inputs and dependencies
Act     → call the behavior under test
Assert  → verify the observable result
```

### Example shape

```typescript name=example.test.ts
// Arrange
const input = "valid input";

// Act
const result = validate(input);

// Assert
expect(result).toBe(true);
```

### Pros

- Makes tests easy to read.
- Keeps setup separate from behavior and expected outcome.
- Encourages one focused behavior per test.

### Cons

- A well-structured test can still test the wrong behavior.
- Too much setup can hide what the test is actually proving.

### Remaining limitation

AAA improves readability, but tests may still depend on clocks, random values, databases, HTTP services, or shared state.

---

## 3. Solution 2: Isolate the unit under test

A unit test should control relevant dependencies so it runs quickly and consistently.

```text
Business rule
   │
   ├── Clock       → controlled test clock
   ├── Database    → fake/stub, where appropriate
   ├── HTTP API    → fake/stub, where appropriate
   └── Randomness  → fixed value
```

### Pros

- Fast enough to run on every change.
- Deterministic: the same input produces the same result.
- Failures are easier to diagnose.
- Allows safe simulation of rare error conditions.

### Cons

- Test doubles can differ from real dependencies.
- Over-mocking can create tests that pass while integration fails.

### Remaining limitation

Isolated unit tests cannot verify real infrastructure behavior, such as SQL query semantics, network timeouts, or external API compatibility.

Use integration tests for those boundaries.

---

## 4. Solution 3: Test-driven development (TDD)

TDD is a development loop:

```text
1. Red      → write a failing test for required behavior
2. Green    → implement the smallest change that passes
3. Refactor → improve design while tests protect behavior
```

### Pros

- Encourages small, testable code.
- Clarifies expected behavior before implementation grows.
- Makes refactoring safer.
- Helps avoid unnecessary code.

### Cons

- It does not replace design review or acceptance criteria.
- It may be inefficient when requirements are unclear.
- Tests that assert internal implementation details make refactoring harder.

### When TDD helps most

- Complex business rules
- Security-sensitive authorization logic
- Bug fixes where a regression test should be added first
- Refactoring legacy code
- Algorithms and transformations with many edge cases

---

## 5. Practical TypeScript example

This example verifies password policy behavior. It validates only the policy result; it does **not** log or expose the password.

```typescript name=password-policy.test.ts
import { describe, expect, it } from "vitest";

interface PasswordPolicyResult {
  isValid: boolean;
  errors: readonly string[];
}

function validatePassword(password: string): PasswordPolicyResult {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push("Password must contain at least 12 characters.");
  }

  if (!/[a-z]/u.test(password)) {
    errors.push("Password must contain a lowercase letter.");
  }

  if (!/[A-Z]/u.test(password)) {
    errors.push("Password must contain an uppercase letter.");
  }

  if (!/\d/u.test(password)) {
    errors.push("Password must contain a number.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

describe("validatePassword", () => {
  it("accepts a password that meets every policy requirement", () => {
    // Arrange
    const password = "CorrectHorse7B";

    // Act
    const result = validatePassword(password);

    // Assert
    expect(result).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it("rejects a password shorter than 12 characters", () => {
    const result = validatePassword("Short7A");

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Password must contain at least 12 characters.",
    );
  });

  it("reports multiple failed requirements", () => {
    const result = validatePassword("alllowercase");

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Password must contain an uppercase letter.",
    );
    expect(result.errors).toContain(
      "Password must contain a number.",
    );
  });
});
```

### What this test covers

```text
Valid password                 → accepted
Too short password             → rejected
Missing uppercase and number   → rejected with both errors
```

### Security note

A password policy is only one control. Production authentication also needs:

- Password hashing with **Argon2id** or bcrypt.
- HTTPS-only transport.
- Rate limiting and account lockout controls.
- Generic authentication error messages.
- Secure session cookies: `HttpOnly`, `Secure`, `SameSite=Strict`.
- No password logging, telemetry, or error reporting.

---

## 6. What makes a good unit test?

A good unit test is:

| Quality | Meaning |
|---|---|
| Fast | Runs in milliseconds where practical |
| Deterministic | Does not depend on time, network, order, or shared state |
| Focused | Tests one behavior or rule |
| Readable | Explains expected behavior clearly |
| Independent | Can run alone or in any order |
| Meaningful | Verifies an observable outcome |
| Secure | Does not expose secrets or sensitive fixtures |

### Prefer behavior assertions

Avoid testing private implementation details.

```text
Weak:
"private helper X was called once"

Strong:
"unauthorized users receive a denied result"
```

The stronger test survives refactoring because it protects the required behavior, not the current internal structure.

---

## 7. Common unit-testing mistakes

### Testing implementation instead of behavior

```text
Bad:
Expecting a particular private helper to be called.

Better:
Verifying the correct result, side effect, or error is returned.
```

### Testing multiple unrelated behaviors

```text
Bad:
"Creates user, sends email, updates metrics, and validates permissions"

Better:
Separate tests for each meaningful behavior.
```

### Ignoring error and denial paths

Always include:

- Missing or malformed input
- Boundary values
- Unauthorized access
- Invalid state transitions
- Dependency failure behavior where the unit owns handling it

### Using fixed time or random values

Avoid unstable tests.

```text
Unstable:
const expiresAt = new Date(Date.now() + 60_000);

Stable:
const now = new Date("2026-10-13T12:00:00.000Z");
// Inject `now` or a clock dependency.
```

### Using real external dependencies

A unit test should not make real HTTP calls, send email, charge a payment provider, or use production credentials.

Use controlled doubles for unit tests and real isolated dependencies in integration tests.

---

## 8. Decision guide

| Situation | Best approach |
|---|---|
| Pure calculation or transformation | Unit test |
| Input validation rule | Unit test |
| Permission decision | Unit test plus API integration test |
| Database query behavior | Integration test |
| External API request format | Integration or contract test |
| Critical browser journey | E2E test |
| Bug fix | Add a failing unit test first when the issue is localized |
| Complex rule under development | Consider TDD |

```text
Can the behavior run without real infrastructure?
→ Yes: unit test.

Does correctness depend on a database, HTTP service, queue, or framework configuration?
→ Add an integration test.

Does correctness depend on a user workflow in a browser?
→ Add a focused E2E test.
```

---

## 9. Validation considerations

### Security
Test deny-by-default behavior:

- Invalid inputs are rejected.
- Unauthorized users are denied.
- Sensitive values are not returned in errors.
- State transitions require appropriate permissions.
- Validation happens at trust boundaries, not only in the UI.

### Accessibility
Unit tests cannot fully prove accessibility, but they can support it by testing:

- Error-message selection logic.
- Localized validation text.
- Form state and error associations generated by UI logic.

Use component, browser, and manual assistive-technology testing for complete accessibility validation.

### Performance
- Keep unit tests fast; avoid file systems, networks, and container startup.
- Run unit tests in parallel only if they do not share mutable state.
- Measure slow tests and move infrastructure behavior to integration suites.

### Scalability and operations
- Run unit tests in local development and on every pull request.
- Produce useful failure output without leaking tokens, passwords, or personal data.
- Track flaky tests: a unit test should almost never be flaky.

---

## 10. Summary

```text
AAA               → makes tests readable
Isolation         → makes tests fast and deterministic
TDD               → guides small, testable design
Behavior tests    → protect outcomes, not internals
Integration tests → verify real infrastructure boundaries
```

**Recommended default:** write unit tests for business rules, validation, permissions, and failure paths; keep them deterministic and behavior-focused; then add integration tests where real dependencies matter.

---

# 4.4 Test Doubles

## Goal

Use controlled replacements for dependencies so unit tests stay fast, deterministic, and safe—without creating unrealistic tests.

---

## 1. Problem: Real dependencies make tests unreliable

A service may depend on databases, clocks, email providers, payment gateways, or remote APIs.

Using those dependencies in every unit test causes problems:

```text
Unit test → real database → network → third-party API
                         ↓
                 slow, costly, flaky, unsafe
```

Examples:
- A payment test accidentally charges a real card.
- An email test sends real messages.
- A test fails because an external API is down.
- A time-based test fails at midnight or due to time zones.

---

## 2. Solution 1: Use simple test doubles

A **test double** replaces a real collaborator during a test.

| Double | Purpose | Example |
|---|---|---|
| Dummy | Exists only to satisfy an argument | An unused logger |
| Stub | Returns predefined data | A user repository returning a known user |
| Spy | Records how it was used | An audit logger recording events |
| Mock | Verifies expected interactions | Assert an email sender was called once |
| Fake | Lightweight working implementation | In-memory repository |

### Pros
- Tests run quickly.
- Failures are deterministic.
- Error conditions are easy to simulate.
- Prevents unsafe side effects.

### Cons
- A double may behave differently from production.
- Tests can become coupled to implementation details.
- Incorrect doubles can create false confidence.

### Remaining limitation

A passing test with a stubbed API does not prove that the real API request, authentication, timeout, or response format works.

That requires integration or contract testing.

---

## 3. Solution 2: Prefer the simplest suitable double

Not every dependency needs a mock.

```text
Need a fixed return value?       → Stub
Need to inspect a side effect?   → Spy
Need lightweight real behavior?  → Fake
Need interaction itself verified?→ Mock, sparingly
Need no behavior at all?         → Dummy
```

### Dummy

A dummy is passed to satisfy a required parameter but is not used by the test.

```text
Example: a no-op telemetry object passed to a constructor.
```

Use it only when the dependency is irrelevant to the behavior under test.

### Stub

A stub provides fixed answers.

```text
Example: repository returns an active account.
```

Use it when the test needs to control a dependency’s output.

### Spy

A spy records calls after they happen.

```text
Example: audit log records that an account was disabled.
```

Use it for meaningful observable side effects.

### Mock

A mock usually includes pre-programmed interaction expectations.

```text
Example: notification sender must be called once with a specific recipient.
```

Use it only when the interaction itself is part of the requirement.

### Fake

A fake is a simpler working implementation.

```text
Example: in-memory key-value store used instead of Redis.
```

Use it when realistic behavior improves tests without requiring real infrastructure.

---

## 4. Solution 3: Combine doubles with integration tests

Test doubles solve speed and isolation. Integration tests solve realism.

```text
Unit test:
Service → fake repository / stubbed clock
Fast and focused

Integration test:
Service → real test database / real HTTP test server
Slower, but validates actual boundaries
```

### Pros
- Unit tests provide fast developer feedback.
- Integration tests detect differences between doubles and real systems.
- The test suite has better overall confidence.

### Cons
- Requires maintaining multiple test layers.
- Integration environments need secure data and configuration.

### Decision guide

| Requirement | Recommended approach |
|---|---|
| Validate pure business rule | No double, or simple stub |
| Control current time | Clock stub/fake |
| Verify audit event creation | Spy |
| Model simple persistence behavior | Fake repository |
| Verify exact protocol/API format | Integration or contract test |
| Test actual database constraints/query behavior | Integration test |
| Test third-party API compatibility | Contract or sandbox integration test |
| Test user-visible critical flow | E2E test |

---

## 5. Practical TypeScript example

This example deactivates an account. It uses:

- A **fake repository** for controlled account storage.
- A **spy audit logger** to verify an important security event.
- A **stub clock** to make timestamps deterministic.

```typescript name=account-deactivation.test.ts
import { describe, expect, it } from "vitest";

interface Account {
  id: string;
  status: "active" | "deactivated";
  deactivatedAt?: Date;
}

interface AccountRepository {
  findById(id: string): Promise<Account | undefined>;
  save(account: Account): Promise<void>;
}

interface AuditLogger {
  record(event: {
    type: "account.deactivated";
    accountId: string;
    occurredAt: Date;
  }): Promise<void>;
}

interface Clock {
  now(): Date;
}

class InMemoryAccountRepository implements AccountRepository {
  private readonly accounts = new Map<string, Account>();

  constructor(initialAccounts: readonly Account[]) {
    for (const account of initialAccounts) {
      this.accounts.set(account.id, { ...account });
    }
  }

  async findById(id: string): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    return account ? { ...account } : undefined;
  }

  async save(account: Account): Promise<void> {
    this.accounts.set(account.id, { ...account });
  }
}

class AuditLoggerSpy implements AuditLogger {
  readonly events: Array<{
    type: "account.deactivated";
    accountId: string;
    occurredAt: Date;
  }> = [];

  async record(event: {
    type: "account.deactivated";
    accountId: string;
    occurredAt: Date;
  }): Promise<void> {
    this.events.push(event);
  }
}

class FixedClock implements Clock {
  constructor(private readonly currentTime: Date) {}

  now(): Date {
    return this.currentTime;
  }
}

class AccountService {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly auditLogger: AuditLogger,
    private readonly clock: Clock,
  ) {}

  async deactivate(accountId: string): Promise<void> {
    const account = await this.accounts.findById(accountId);

    if (!account) {
      throw new Error("Account not found.");
    }

    if (account.status === "deactivated") {
      return;
    }

    const occurredAt = this.clock.now();

    await this.accounts.save({
      ...account,
      status: "deactivated",
      deactivatedAt: occurredAt,
    });

    await this.auditLogger.record({
      type: "account.deactivated",
      accountId,
      occurredAt,
    });
  }
}

describe("AccountService.deactivate", () => {
  it("deactivates an active account and records an audit event", async () => {
    // Arrange
    const occurredAt = new Date("2026-10-13T12:00:00.000Z");
    const accounts = new InMemoryAccountRepository([
      { id: "account-123", status: "active" },
    ]);
    const auditLogger = new AuditLoggerSpy();
    const service = new AccountService(
      accounts,
      auditLogger,
      new FixedClock(occurredAt),
    );

    // Act
    await service.deactivate("account-123");

    // Assert
    await expect(accounts.findById("account-123")).resolves.toEqual({
      id: "account-123",
      status: "deactivated",
      deactivatedAt: occurredAt,
    });

    expect(auditLogger.events).toEqual([
      {
        type: "account.deactivated",
        accountId: "account-123",
        occurredAt,
      },
    ]);
  });

  it("does not write a duplicate audit event for an already deactivated account", async () => {
    const accounts = new InMemoryAccountRepository([
      {
        id: "account-123",
        status: "deactivated",
        deactivatedAt: new Date("2026-10-12T12:00:00.000Z"),
      },
    ]);
    const auditLogger = new AuditLoggerSpy();
    const service = new AccountService(
      accounts,
      auditLogger,
      new FixedClock(new Date("2026-10-13T12:00:00.000Z")),
    );

    await service.deactivate("account-123");

    expect(auditLogger.events).toEqual([]);
  });
});
```

### Why these doubles are appropriate

```text
Repository fake → tests state changes without a real database.
Clock fake      → eliminates time-based flakiness.
Audit spy       → confirms a security-relevant event is emitted.
```

This test does **not** prove:
- The production database persists changes correctly.
- Audit events reach the real logging system.
- Authorization is enforced by an API endpoint.

Add integration tests for those concerns.

---

## 6. Mocking pitfalls

### Pitfall 1: Verifying every internal call

```text
Brittle:
Expect repository.findById(), repository.save(), logger.record()
to occur in a precise order.

Better:
Verify the resulting account state and only meaningful side effects.
```

Refactoring internal code should not break a test if user-visible behavior is unchanged.

---

### Pitfall 2: Mocking what you own

When possible, test your own logic directly rather than mocking internal classes.

```text
Avoid:
Service A mock-calls Service B, which mock-calls Service C.

Prefer:
Test each service's behavior directly; mock only external boundaries.
```

---

### Pitfall 3: Using an unrealistic fake

An in-memory fake may not behave like a production database.

Examples:
- It may not enforce foreign keys.
- It may not handle transactions.
- It may compare text differently.
- It may not expose query-performance issues.

**Mitigation:** use fakes for unit tests and real database integration tests for persistence behavior.

---

### Pitfall 4: Hiding security failures

A mock that always returns success can conceal failure handling.

Test relevant failures:

```text
- Database unavailable
- Audit sink unavailable
- Permission denied
- Invalid or missing input
- Timeout from external dependency
```

For sensitive operations, define whether audit logging must succeed before completing the action, or whether an asynchronous durable outbox is required.

---

## 7. Decision guide

```text
Does the unit need a dependency result?
→ Use a stub.

Does the test need to confirm a meaningful side effect?
→ Use a spy.

Would a small working replacement make behavior clearer?
→ Use a fake.

Is the precise interaction itself an externally visible requirement?
→ Use a mock carefully.

Does confidence depend on actual infrastructure behavior?
→ Add an integration test.
```

**Default preference:**

```text
Real value/object → Stub → Fake → Spy → Mock
```

Use the least complex option that proves the behavior.

---

## 8. Validation considerations

### Security
- Doubles must not call real payment, messaging, or identity systems.
- Use test-only credentials with least privilege.
- Do not put production tokens, passwords, or customer data in fixtures.
- Verify denied authorization and dependency-error paths.
- Test audit behavior without recording sensitive values unnecessarily.

### Accessibility
Test doubles are usually implementation-level tools. They do not validate full accessibility.

They can support component tests by simulating:
- Localized error messages.
- Loading and failure states.
- Permission-based UI states.

Use browser and manual assistive-technology testing for complete accessibility validation.

### Performance
- Doubles keep unit tests fast.
- Avoid artificial delays and real network access.
- Run independent tests in parallel only when they do not share mutable fake state.

### Scalability and operations
- Keep fakes small and focused; do not recreate an entire database in memory.
- Add integration tests for transactions, concurrency, locking, and query behavior.
- Ensure test logs redact sensitive test inputs.
- Investigate unexpectedly slow tests; a unit test requiring infrastructure is likely misclassified.

---

## 9. Summary

```text
Dummy → satisfies an unused dependency
Stub  → supplies predefined answers
Spy   → records meaningful side effects
Mock  → verifies required interactions, sparingly
Fake  → provides lightweight working behavior
```

**Recommended default:** use real values when possible, stubs to control results, fakes for simple behavior, and spies for important side effects. Use mocks sparingly, then validate important infrastructure boundaries with integration tests.

---

# 4.5 Integration Testing

## Goal

Verify that real components work correctly together: application code, databases, HTTP APIs, authentication, queues, serialization, migrations, and configuration.

---

## 1. Problem: Unit tests can pass while the system fails

Unit tests isolate logic by replacing dependencies. That is valuable, but it can hide failures at real boundaries.

```text
Unit test:
Service → fake repository → passes

Production:
Service → PostgreSQL → migration mismatch / constraint error → fails
```

Common integration failures:

- Incorrect database queries or migrations
- Invalid JSON serialization
- Missing environment configuration
- Authentication middleware misconfiguration
- API schema drift
- Timeouts, retries, or error mapping failures
- Incorrect third-party request formats

---

## 2. Solution 1: In-process integration tests

Run the application or a meaningful section of it with real internal wiring.

```text
Test → HTTP request → API route → authorization → service → repository
```

Examples:

- Send an HTTP request to an API endpoint.
- Verify authentication and authorization middleware.
- Validate request parsing and response status codes.
- Confirm validation failures return safe error responses.

### Pros

- Tests real application configuration and component wiring.
- Finds serialization, routing, middleware, and dependency-injection defects.
- Faster and simpler than full browser automation.

### Cons

- May still use substitutes for databases or external services.
- Does not prove the browser experience works.
- Shared state can make tests unstable if not isolated.

### Remaining limitation

An in-process test that uses an in-memory database may not detect real PostgreSQL, SQL Server, Redis, or message-broker behavior.

---

## 3. Solution 2: Test real dependencies with Testcontainers

Use disposable containers for dependencies such as PostgreSQL, Redis, RabbitMQ, or LocalStack-compatible services.

```text
Integration test
      │
      ├── Application under test
      └── Temporary PostgreSQL container
              │
              └── Real migrations, SQL, constraints, indexes
```

### Pros

- Tests realistic database and service behavior.
- Validates migrations from a clean state.
- Reproducible locally and in CI.
- Avoids relying on a shared test database.

### Cons

- Slower than unit tests.
- Requires Docker-compatible container support.
- Container startup and resource use must be managed carefully.

### Remaining limitation

Real local dependencies still do not guarantee that independently deployed services agree on an API contract.

---

## 4. Solution 3: Contract testing

A **contract test** verifies an agreement between API consumers and providers.

```text
Consumer expectation:
GET /users/123 returns:
{
  "id": "123",
  "displayName": "Avery"
}

Provider verification:
The provider can satisfy that expectation.
```

Tools such as **Pact** support consumer-driven contract testing.

### Pros

- Detects breaking API changes before deployment.
- Faster and narrower than full cross-service E2E tests.
- Encourages explicit API versioning and compatibility decisions.

### Cons

- Requires teams to maintain meaningful contracts.
- Does not validate every real deployment configuration.
- Cannot replace security, performance, or browser-level testing.

### Decision guide

| Need | Recommended test |
|---|---|
| Verify a business rule | Unit test |
| Verify API routing, validation, authorization | In-process integration test |
| Verify SQL, migrations, transactions, constraints | Testcontainers integration test |
| Verify service-to-service API compatibility | Contract test |
| Verify a critical browser workflow | E2E test |
| Verify vendor integration behavior | Sandbox integration test, where available |

---

## 5. Practical TypeScript example

This example uses an ephemeral PostgreSQL database through Testcontainers to verify a database constraint. It demonstrates why real-database integration tests are valuable: an in-memory fake may not enforce the same constraints.

```typescript name=user-repository.integration.test.ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import pg from "pg";

let container: StartedPostgreSqlContainer;
let pool: pg.Pool;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();

  pool = new pg.Pool({
    connectionString: container.getConnectionUri(),
    max: 5,
  });

  await pool.query(`
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}, 60_000);

afterAll(async () => {
  await pool?.end();
  await container?.stop();
});

describe("users database integration", () => {
  it("rejects duplicate email addresses", async () => {
    const email = "test.user@example.test";

    await pool.query(
      `INSERT INTO users (id, email) VALUES ($1, $2)`,
      ["11111111-1111-1111-1111-111111111111", email],
    );

    await expect(
      pool.query(
        `INSERT INTO users (id, email) VALUES ($1, $2)`,
        ["22222222-2222-2222-2222-222222222222", email],
      ),
    ).rejects.toMatchObject({
      code: "23505", // PostgreSQL unique_violation
    });
  });
});
```

### Why this example matters

```text
Application expectation:
Every user email is unique.

Real database protection:
UNIQUE constraint rejects duplicates even if application validation fails.
```

This is **defense in depth**:

1. Validate input in the application for clear user feedback.
2. Enforce the invariant in the database for data integrity.
3. Test both layers.

### Security note

- Always use parameterized queries, as shown with `$1` and `$2`.
- Use a test-only database created by the container.
- Do not use production credentials or production data.
- Avoid asserting raw database error text in API responses; map it to safe client-facing errors.

---

## 6. Database integration testing

Test database behavior that cannot safely be assumed from unit tests.

### Test these areas

- Schema migrations apply from an empty database.
- Unique, foreign-key, check, and not-null constraints work.
- Transactions commit and roll back correctly.
- Pagination has deterministic ordering.
- Queries handle expected null and empty cases.
- Indexes support important query paths.
- Concurrency-sensitive operations behave safely.

### Migration test flow

```text
Empty database
      ↓
Apply every migration
      ↓
Run application query and write tests
      ↓
Verify rollback/recovery strategy where supported
```

### Important limitation

Database rollback is not always safe for destructive migrations.

For changes such as dropping columns or transforming data:

```text
1. Add new schema safely.
2. Deploy code compatible with old and new schema.
3. Backfill data.
4. Validate.
5. Remove old schema in a later release.
```

This expand-and-contract pattern reduces deployment risk.

---

## 7. API integration testing

Integration tests should verify the observable API contract, including failure paths.

```text
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Input validation
  ↓
Business logic
  ↓
Safe HTTP response
```

Test at least:

- Valid request returns expected status and schema.
- Missing authentication returns `401 Unauthorized`.
- Authenticated but unauthorized users receive `403 Forbidden`.
- Invalid input returns `400 Bad Request` or `422 Unprocessable Content`, according to API conventions.
- Internal failures do not expose stack traces, secrets, or infrastructure details.
- Rate-limiting behavior is correct for sensitive endpoints.
- Pagination, sorting, filtering, and boundary values behave as documented.

### Authorization example matrix

```text
Anonymous user       → 401
Authenticated member → 403
Authorized admin     → 200 / expected action
Malformed request    → 400 or 422
```

For every sensitive operation, verify the denied paths as carefully as the successful path.

---

## 8. Contract testing guidance

Use contract tests when services deploy independently.

### Consumer responsibilities

The consumer defines only what it needs:

```text
Request:
GET /profiles/{id}

Required response fields:
- id: string
- displayName: string
```

Do not require unrelated response fields. This reduces accidental coupling.

### Provider responsibilities

The provider verifies it can fulfill published consumer expectations.

### Versioning guidance

Prefer additive API changes:

```text
Safer:
Add optional response field.

Risky:
Rename, remove, or change type of an existing field.
```

For breaking changes:

1. Introduce a new version or compatible field.
2. Migrate consumers.
3. Monitor usage.
4. Retire the old contract only after an agreed deprecation period.

---

## 9. Validation considerations

### Security

Integration tests should verify:

- Authentication is enforced at server boundaries.
- Authorization follows least privilege and deny-by-default rules.
- Input schemas reject unexpected or unsafe values.
- SQL uses parameterized queries.
- CORS, CSRF protections, security headers, and cookie settings are correct where applicable.
- Error responses do not disclose stack traces, secrets, or internal identifiers.
- Secrets are injected through secure CI configuration, never committed.

### Accessibility

Integration tests do not fully validate accessibility, but API behavior can support accessible UI:

- Validation errors should be structured and stable.
- Error codes should be distinguishable from localized messages.
- APIs should return sufficient field-level error information for accessible forms.

Use UI and browser tests for semantic markup, focus, keyboard navigation, and screen-reader behavior.

### Performance and scalability

- Run realistic database tests for critical queries.
- Test pagination and query limits to prevent unbounded data retrieval.
- Validate timeout, retry, and circuit-breaker behavior for remote dependencies.
- Keep most integration tests parallel-safe through isolated databases, schemas, or unique test identifiers.
- Measure slow tests; reserve heavier scenarios for scheduled CI where necessary.

### Operations

- Capture failure logs and traces, but redact tokens, passwords, and personal data.
- Pin container image versions, for example `postgres:16-alpine`.
- Scan container images and dependencies for vulnerabilities.
- Run a small integration smoke suite on every pull request.
- Run broader infrastructure tests before release or on a scheduled pipeline.

---

## 10. Summary

```text
Unit tests         → verify isolated logic
Integration tests  → verify real boundaries and wiring
Testcontainers     → verify real disposable infrastructure
Contract tests     → verify independently deployed API compatibility
E2E tests          → verify critical user journeys
```

**Recommended default:** use in-process integration tests for API and application wiring, Testcontainers for important infrastructure behavior, and contract tests where independently deployed services must remain compatible.

---

# 4.6 System and End-to-End (E2E) Testing

## Goal

Verify critical user workflows through the running system, including browser behavior, UI, authentication, APIs, and persistence.

---

## 1. Problem: Components pass, but users still fail

Unit and integration tests may all pass while users encounter broken workflows.

```text
Unit tests        → business rule works
Integration tests → API and database work
E2E test          → user can actually complete the workflow
```

Examples E2E tests can expose:

- A button is not clickable or is hidden.
- A form error is not visible or accessible.
- Authentication cookies are misconfigured.
- Client-side routing fails after deployment.
- A UI sends an invalid API request.
- A browser-specific rendering issue prevents completion.
- A successful API response is not reflected in the UI.

---

## 2. Solution 1: Browser-based UI automation

Use a browser automation framework such as **Playwright** to perform a real user workflow.

```text
Browser
  ↓
UI interaction
  ↓
Frontend application
  ↓
API
  ↓
Database / services
```

Example workflow:

```text
Administrator signs in
  → opens account management
  → deactivates a user account
  → sees confirmation
  → deactivated user can no longer sign in
```

### Pros

- Tests user-visible behavior across layers.
- Validates browser, routing, cookies, UI state, and API integration.
- Supports Chromium, Firefox, and WebKit.
- Produces useful diagnostics such as screenshots, videos, and traces.

### Cons

- Slower than unit and integration tests.
- More expensive to maintain.
- Can become flaky if tests depend on timing, shared state, or unstable environments.

### Remaining limitation

A browser test may report only that a workflow failed. It may not immediately identify whether the cause is UI code, API behavior, test data, or infrastructure.

---

## 3. Solution 2: Make E2E tests stable and diagnosable

Design tests around user-observable conditions—not fixed delays.

```text
Unstable:
Wait 3 seconds → click button

Stable:
Wait until the "Save changes" button is enabled → click button
Wait for success status/message → assert outcome
```

### Stability practices

- Use accessible locators: `getByRole`, `getByLabel`, and `getByText`.
- Avoid CSS selectors tied to layout or generated class names.
- Do not use arbitrary `sleep` or fixed wait times.
- Create isolated test accounts and data.
- Reset state between tests.
- Use API calls for setup when the UI setup is not under test.
- Run tests against deterministic, production-like test environments.
- Capture traces, screenshots, and browser logs on failures.

### Pros

- Reduces flaky failures.
- Produces clearer failures.
- Encourages accessible UI semantics.

### Cons

- Requires deliberate testability design.
- Isolated environments and data setup add operational cost.

### Remaining limitation

Stable E2E tests still should not cover every edge case. A large E2E suite becomes slow and difficult to maintain.

---

## 4. Solution 3: Keep E2E coverage focused

Use E2E tests for **high-value user journeys**, not all logic permutations.

```text
Many unit tests
    ↓
Some integration tests
    ↓
Few, critical E2E workflows
```

Good E2E candidates:

- Sign in, sign out, and password reset.
- Account creation and account recovery.
- Checkout or payment confirmation.
- Permission-sensitive administrator actions.
- Data export or deletion.
- Core onboarding workflow.
- A production smoke test after deployment.

Poor E2E candidates:

- Every invalid field combination.
- Every pricing rule or calculation.
- Internal helper behavior.
- Large test matrices better covered by API or integration tests.

### Decision guide

| Need | Best test type |
|---|---|
| Validate a calculation | Unit test |
| Validate database or API behavior | Integration test |
| Verify API compatibility between services | Contract test |
| Verify user sign-in flow | E2E test |
| Verify administrator can perform a sensitive action | E2E test plus integration authorization tests |
| Verify hundreds of input permutations | Unit or integration tests |
| Verify post-deployment availability | E2E smoke test |

---

## 5. Practical TypeScript example: Playwright

This example verifies that a signed-in user can update their display name. It uses accessibility-first locators and avoids fixed waits.

```typescript name=profile-update.spec.ts
import { expect, test } from "@playwright/test";

test("authenticated user can update their display name", async ({ page }) => {
  // Test-only account. Do not use production credentials.
  await page.goto("/sign-in");

  await page.getByLabel("Email address").fill("member@example.test");
  await page.getByLabel("Password").fill("TestOnlyPassword-2026");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.getByRole("link", { name: "Profile" }).click();

  await expect(
    page.getByRole("heading", { name: "Your profile" }),
  ).toBeVisible();

  const displayName = page.getByLabel("Display name");
  await displayName.fill("Avery Chen");

  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(
    page.getByRole("status"),
  ).toHaveText("Your profile has been updated.");

  await expect(displayName).toHaveValue("Avery Chen");
});
```

### Why this approach is useful

```text
getByLabel("Display name")
→ verifies the control has an accessible label.

getByRole("button", { name: "Save changes" })
→ locates the action as a user or assistive technology would.

getByRole("status")
→ encourages accessible announcement of successful updates.
```

Avoid test IDs by default when accessible roles and names are available. Use stable `data-testid` attributes only where no meaningful accessible locator exists.

---

## 6. Flaky tests

A **flaky test** sometimes passes and sometimes fails without a relevant code change.

### Common causes

```text
- Fixed timing delays
- Shared test accounts or databases
- Tests dependent on execution order
- Uncontrolled clocks, time zones, or random values
- Unreliable external services
- Eventual consistency not modeled in assertions
- Tests running in overloaded CI environments
- Browser state leaking between tests
```

### Incorrect response: retry indefinitely

Retries can reduce incidental CI noise, but they must not hide real instability.

```text
Failure
  ↓
Retry once for infrastructure diagnosis
  ↓
If it passes, record as flaky
  ↓
Assign ownership and fix the cause
```

### Better remediation

| Cause | Better approach |
|---|---|
| Shared data | Unique account/tenant per test |
| Fixed delays | Wait for visible UI state or expected response |
| External dependency | Controlled test environment, fake, or contract test |
| Order dependence | Independent setup and cleanup |
| Asynchronous work | Poll a bounded observable condition |
| Browser state leak | Fresh browser context for each test |

### Quarantine policy

If a test must be quarantined:

- Record the issue and owner.
- Preserve the test failure artifacts.
- Set a fix deadline.
- Do not treat quarantine as a permanent solution.
- Continue running it separately where possible.

---

## 7. Security considerations

E2E tests should verify security-critical workflows from the user perspective.

### Test these scenarios

```text
Anonymous user             → redirected or receives 401
Authenticated regular user → denied from administrator page/action
Administrator              → permitted to complete approved action
Expired session            → requires reauthentication
Signed-out user            → cannot access protected content with back navigation
```

Also verify:

- Session cookies use `HttpOnly`, `Secure`, and appropriate `SameSite` settings.
- Password and token values never appear in screenshots, traces, logs, or reports.
- Test accounts use least privilege.
- Tests run only against approved non-production environments.
- Test cleanup cannot delete or alter real customer data.
- Sensitive actions generate appropriate audit records, tested at the integration layer.

Do not use real customer accounts or production credentials in E2E tests.

---

## 8. Accessibility considerations

E2E tests can validate important accessibility behavior, though they do not replace manual testing with assistive technologies.

Test:

- Keyboard navigation and visible focus.
- Accessible labels for form fields and controls.
- Semantic roles and accessible names.
- Error messages associated with invalid fields.
- Focus movement after validation failure or dialog open/close.
- Success and error announcements through status or alert regions.
- Zoom and responsive layouts for critical workflows.

```text
Automated accessibility checks → catch common structural issues
Keyboard testing               → validates interaction
Screen reader testing          → validates real assistive experience
```

Use all three for high-impact user flows.

---

## 9. Performance, scalability, and operations

### Performance

- Keep E2E suites small and purposeful.
- Run smoke tests on each deployment.
- Run broader cross-browser suites nightly or before release.
- Use parallel workers only with isolated test data.
- Avoid making every pull request wait for long-running full-suite tests.

### Scalability

```text
Pull request:
- Type checks
- Unit tests
- Targeted integration tests
- Small E2E smoke suite

Nightly / release candidate:
- Full E2E suite
- Cross-browser coverage
- Accessibility scans
- Performance and resilience checks
```

### Operations

On failure, securely retain:

- Playwright trace
- Screenshot
- Video where appropriate
- Browser console output
- Network errors
- Server correlation ID or trace ID

Redact tokens, passwords, session identifiers, and personal data before storing artifacts.

---

## 10. Summary

```text
E2E tests validate complete user-visible workflows.

Use them for:
- High-risk workflows
- Authentication and authorization journeys
- Critical revenue or data-changing actions
- Deployment smoke tests

Keep them reliable by:
- Using accessible locators
- Avoiding fixed waits
- Isolating test data
- Capturing diagnostics
- Fixing flakes rather than hiding them
```

**Recommended default:** maintain a small Playwright E2E suite for critical workflows, rely on unit and integration tests for detailed coverage, and treat flaky E2E tests as defects requiring ownership and remediation.

---

# 4.7 Acceptance Testing and Behavior-Driven Development (BDD)

## Goal

Ensure the team builds the **right behavior for users and stakeholders**, not merely technically correct code.

---

## 1. Problem: Requirements are ambiguous

A requirement such as:

> “Administrators can deactivate users.”

sounds clear, but leaves important questions unanswered:

- Which administrator roles are allowed?
- Can an administrator deactivate themselves?
- Are active sessions revoked?
- What confirmation does the UI show?
- Is an audit event required?
- What happens if the account is already deactivated?
- Can the action be undone?

Without shared examples, product, QA, security, and engineering may each implement or expect something different.

```text
Vague requirement
      ↓
Different interpretations
      ↓
Correct code, wrong product behavior
```

---

## 2. Solution 1: Acceptance criteria

Acceptance criteria define the observable conditions a feature must meet.

### Example

```text
Feature: Deactivate a user account

Acceptance criteria:
- Only authorized administrators can deactivate an account.
- An administrator cannot deactivate their own account.
- Deactivation revokes active sessions.
- The user receives a clear confirmation message.
- The action is recorded in the audit log.
- Repeating the action does not create duplicate audit records.
```

### Pros

- Clarifies expected outcomes before implementation.
- Gives developers and testers a shared target.
- Supports estimation and release decisions.
- Helps identify security and edge cases early.

### Cons

- Can remain vague if written as broad statements.
- May miss examples and exceptions.
- Does not automatically become executable.

### Remaining limitation

Acceptance criteria can still be interpreted differently unless they include concrete examples.

---

## 3. Solution 2: Example-driven acceptance tests

Turn requirements into specific examples of behavior.

```text
Given an authorized administrator
And an active member account
When the administrator deactivates that account
Then the account is marked as deactivated
And the member's active sessions are revoked
And an audit event is recorded
And the administrator sees a confirmation
```

This is often called **Specification by Example**.

### Pros

- Reduces ambiguity.
- Reveals missing decisions before code is written.
- Provides a direct basis for automated tests.
- Encourages discussion across technical and non-technical roles.

### Cons

- Too many low-level examples become hard to maintain.
- Examples may accidentally describe UI implementation rather than business behavior.

### Remaining limitation

Examples written only in documents can drift from the actual implementation.

---

## 4. Solution 3: BDD executable specifications

**Behavior-Driven Development (BDD)** makes acceptance examples structured and, where valuable, executable.

A common format is **Given–When–Then**:

```text
Given [context or initial state]
When  [an action occurs]
Then  [an observable outcome occurs]
```

### Example

```text
Feature: User account deactivation

Scenario: Authorized administrator deactivates a member account
  Given an authenticated administrator
  And an active member account exists
  When the administrator deactivates the member account
  Then the member account is deactivated
  And existing member sessions are revoked
  And an audit event is recorded
  And the administrator sees a success confirmation

Scenario: Member cannot deactivate another account
  Given an authenticated member
  And another active member account exists
  When the member attempts to deactivate that account
  Then the request is denied
  And no account state is changed
  And no deactivation audit event is recorded
```

### Pros

- Gives product, QA, security, and engineering a shared language.
- Can link requirements directly to automated verification.
- Makes authorization and failure behavior explicit.
- Supports traceability in regulated or high-risk systems.

### Cons

- Step definitions can become an expensive automation layer.
- UI-level BDD scenarios can be slow and brittle.
- Writing every test in Gherkin adds little value for simple implementation details.

### Important limitation

BDD is **not** a replacement for unit, integration, security, or E2E testing.

```text
BDD scenario                 → expected business behavior
Unit tests                   → detailed rules and edge cases
Integration tests            → real boundaries and infrastructure
E2E tests                    → critical browser workflow
UAT                          → stakeholder validation
```

---

## 5. Solution 4: User acceptance testing (UAT)

**User acceptance testing** confirms that the feature supports real business needs before release.

UAT participants may include:

- Product owners
- Operations teams
- Customer-support representatives
- Domain experts
- Representative end users
- Compliance or business approvers

### Example UAT scenario

```text
A support administrator receives a verified account-closure request.

They must:
1. Find the correct user safely.
2. Confirm the identity and requested action.
3. Deactivate the account.
4. Understand the confirmation and next steps.
5. Verify the user can no longer access the account.
6. Locate the audit record when required.
```

### Pros

- Validates real workflows and business value.
- Finds confusing terminology, missing workflow steps, and usability issues.
- Helps validate that acceptance criteria reflect actual user needs.

### Cons

- Can be slow if environments, users, and data are not prepared.
- Results may be subjective without clear scenarios.
- Should not be used as the first functional test stage.

### Remaining limitation

UAT verifies intended business use, but it may not uncover technical load, security, compatibility, or accessibility issues on its own.

---

## 6. Decision guide

| Need | Recommended approach |
|---|---|
| Clarify a routine feature | Acceptance criteria |
| Resolve ambiguous business rules | Concrete examples |
| Share behavior across product, QA, and engineering | BDD scenarios |
| Automate a stable, high-value business rule | Executable BDD specification |
| Validate actual business workflow before release | UAT |
| Verify detailed calculation edge cases | Unit tests |
| Verify API authorization and persistence | Integration tests |
| Verify critical browser journey | E2E tests |

```text
Is the behavior important to a stakeholder?
→ Write acceptance criteria.

Is the requirement ambiguous or risk-sensitive?
→ Add concrete examples / BDD scenarios.

Does the example represent stable, high-value behavior?
→ Consider automating it.

Does a representative user need to validate business fitness?
→ Run UAT.
```

---

## 7. Practical TypeScript example

BDD-style scenarios should focus on behavior. The implementation-level test can remain a simple TypeScript integration test.

```typescript name=account-deactivation.acceptance.test.ts
import { describe, expect, it } from "vitest";

type Role = "administrator" | "member";

interface Actor {
  id: string;
  role: Role;
}

interface Account {
  id: string;
  status: "active" | "deactivated";
  activeSessionCount: number;
}

interface DeactivationResult {
  status: "deactivated" | "forbidden" | "invalid";
  auditEventRecorded: boolean;
}

function deactivateAccount(
  actor: Actor,
  target: Account,
): DeactivationResult {
  const canDeactivate =
    actor.role === "administrator" && actor.id !== target.id;

  if (!canDeactivate) {
    return {
      status: "forbidden",
      auditEventRecorded: false,
    };
  }

  target.status = "deactivated";
  target.activeSessionCount = 0;

  return {
    status: "deactivated",
    auditEventRecorded: true,
  };
}

describe("Account deactivation acceptance behavior", () => {
  it("allows an administrator to deactivate another active account", () => {
    // Given
    const administrator: Actor = {
      id: "admin-123",
      role: "administrator",
    };
    const member: Account = {
      id: "member-456",
      status: "active",
      activeSessionCount: 2,
    };

    // When
    const result = deactivateAccount(administrator, member);

    // Then
    expect(result).toEqual({
      status: "deactivated",
      auditEventRecorded: true,
    });
    expect(member.status).toBe("deactivated");
    expect(member.activeSessionCount).toBe(0);
  });

  it("denies a member attempting to deactivate another account", () => {
    // Given
    const member: Actor = {
      id: "member-123",
      role: "member",
    };
    const target: Account = {
      id: "member-456",
      status: "active",
      activeSessionCount: 1,
    };

    // When
    const result = deactivateAccount(member, target);

    // Then
    expect(result).toEqual({
      status: "forbidden",
      auditEventRecorded: false,
    });
    expect(target.status).toBe("active");
    expect(target.activeSessionCount).toBe(1);
  });
});
```

### Why this example helps

It connects the acceptance behavior to testable outcomes:

```text
Authorized administrator → account deactivated + sessions revoked + audit event
Unauthorized member      → denied + no state change + no audit event
```

In a production system, enforce this authorization at the server/API boundary. UI controls alone cannot prevent direct unauthorized requests.

---

## 8. Writing good BDD scenarios

### Focus on outcomes, not UI mechanics

```text
Too implementation-specific:
Given I click the red button with CSS class ".deactivate-button"

Better:
When the administrator deactivates the member account
```

The second scenario remains valid if the UI changes from a button to a menu action or API-driven workflow.

### Keep scenarios independent

Each scenario should establish its own state.

```text
Avoid:
Scenario B assumes Scenario A created a user.

Prefer:
Scenario B creates or provisions its own required user state.
```

### Use domain language

Use terms stakeholders understand:

```text
Prefer:
"member account", "administrator", "subscription"

Avoid:
"UserEntity", "DeactivateAccountCommandHandler"
```

### Include negative and boundary scenarios

For sensitive actions, include:

```text
- Unauthenticated actor
- Unauthorized actor
- Invalid or missing target
- Already-completed action
- Concurrent action
- Dependency failure where relevant
```

---

## 9. Validation considerations

### Security

Acceptance scenarios should make security decisions explicit:

```text
Given an unauthenticated visitor
When they request account deactivation
Then they are not given account information
And they are required to authenticate

Given an authenticated member
When they attempt an administrator-only action
Then access is denied
And no protected state changes
And the denial does not reveal unnecessary details
```

Also validate:

- Least-privilege authorization.
- Deny-by-default behavior.
- Session revocation after sensitive account changes.
- Rate limiting for authentication and recovery workflows.
- Audit trails for sensitive operations.
- Generic error messages where detailed messages could aid attackers.

### Accessibility

Include acceptance criteria such as:

```text
- The workflow is operable by keyboard.
- Every form field has an accessible label.
- Validation errors identify the affected fields.
- Focus moves to the relevant error summary or control.
- Status messages are announced to assistive technology.
```

Automated browser checks can verify some of this. Manual keyboard and screen-reader evaluation remains necessary for high-impact flows.

### Performance and scalability

For important workflows, define measurable expectations:

```text
- The deactivation API responds within the agreed p95 latency budget.
- Session revocation completes within the defined security window.
- The workflow supports expected concurrent administrator activity.
- Failure responses remain safe and understandable during dependency degradation.
```

Test detailed performance behavior separately with load, stress, and soak tests.

### Operations

Before UAT or release:

- Provision isolated synthetic accounts and data.
- Use a production-like but non-production environment.
- Ensure test credentials have least privilege.
- Prepare support, monitoring, and rollback procedures.
- Do not include secrets or personal data in test evidence.
- Capture feedback, defects, and approved exceptions clearly.

---

## 10. Summary

```text
Acceptance criteria → clarify what success means
Examples             → remove ambiguity
BDD                  → express behavior in shared language
Executable specs     → automate stable, high-value behavior
UAT                  → confirm the solution works for real users
```

**Recommended default:** define acceptance criteria for every user-facing change, add BDD-style examples for complex or high-risk behavior, automate only stable high-value scenarios, and use UAT to validate real business workflows before significant releases.

---

# 4.8 Non-Functional Testing

## Goal

Verify that software is not only functionally correct, but also **secure, fast, reliable, accessible, compatible, and resilient**.

---

## 1. Problem: “It works” is not enough

A feature can pass functional tests while still failing users or the organization.

```text
Functionally correct:
User can sign in.

Non-functional failure:
- Sign-in takes 15 seconds under normal load.
- It is inaccessible by keyboard.
- It leaks account existence in an error message.
- It fails in Safari.
- It crashes when an identity provider is unavailable.
```

Functional tests answer:

> Does the system do the expected thing?

Non-functional tests answer:

> Does it do it safely, reliably, accessibly, and at an acceptable quality level?

---

## 2. Solution 1: Targeted non-functional testing

Test quality attributes that match the system’s risks.

| Quality attribute | Main question |
|---|---|
| Performance | Is the system fast enough at expected demand? |
| Security | Can an attacker access, alter, or expose protected data? |
| Accessibility | Can people with disabilities use the product? |
| Internationalization | Does the product work across supported languages and locales? |
| Compatibility | Does it work in supported browsers, devices, and platforms? |
| Resilience | Does it recover safely when dependencies fail? |

### Pros

- Finds serious issues that functional tests miss.
- Aligns testing with real user and operational needs.
- Helps define measurable quality expectations.

### Cons

- Requires realistic environments and clear thresholds.
- Some testing needs specialist knowledge and tooling.
- Broad testing can be expensive if it is not risk-based.

### Remaining limitation

One-time testing only proves the system met expectations at one point in time. A later change can reintroduce the same problem.

---

## 3. Solution 2: Continuous quality gates and monitoring

Run automated checks during development and CI, then monitor the system after deployment.

```text
Design → automated checks → CI quality gates → deployment → monitoring
```

Examples:

```text
Pull request:
- Static analysis
- Dependency vulnerability scan
- Unit/integration tests
- Basic accessibility checks

Release candidate:
- Load testing
- Browser compatibility testing
- DAST against approved environment
- Manual accessibility review

Production:
- Latency, error rate, availability, security-event monitoring
```

### Pros

- Detects regressions earlier.
- Provides continuous evidence rather than one-time confidence.
- Connects release quality with real operational outcomes.

### Cons

- Poor thresholds cause alert fatigue or blocked delivery.
- Monitoring detects problems but does not prevent them.
- Tool findings require triage; not every finding is exploitable or relevant.

### Decision guide

| Risk or requirement | Primary approach |
|---|---|
| Slow API at normal demand | Load test |
| Failure beyond expected capacity | Stress test |
| Memory leak or degradation over time | Soak test |
| Vulnerable dependencies or insecure code patterns | SAST and dependency scanning |
| Runtime web security weaknesses | DAST and approved penetration test |
| Keyboard/screen-reader usability | Automated scan plus manual testing |
| Locale/currency/date correctness | Locale and i18n tests |
| Browser/device support | Compatibility matrix |
| Dependency outage behavior | Resilience / chaos experiment |

---

# 4.8.1 Performance Testing

## Problem

An endpoint may work for one user but fail at normal concurrency.

```text
1 user      → 100 ms response time
500 users   → database pool exhaustion
             timeouts
             5xx errors
```

## Solution 1 — Load testing

A **load test** verifies behavior under expected traffic.

Example:

```text
Expected peak:
- 200 concurrent users
- 50 requests per second
- p95 response time under 500 ms
- error rate below 1%
```

### Pros
- Validates expected capacity.
- Identifies bottlenecks before production.
- Supports capacity planning.

### Cons
- Requires realistic workload assumptions.
- Test data and infrastructure must resemble production behavior.

### Remaining limitation

Load testing does not show how the system fails beyond expected capacity.

## Solution 2 — Stress testing

A **stress test** increases demand beyond expected limits to observe failure behavior.

```text
Expected load → increasing load → saturation → controlled degradation
```

Test for:

- Timeouts
- Queue backlogs
- Connection-pool exhaustion
- Memory pressure
- Rate-limit behavior
- Recovery after load decreases

### Pros
- Identifies capacity limits.
- Verifies graceful degradation.
- Supports incident planning.

### Cons
- Can destabilize shared environments.
- Must never run against production without explicit approval and safeguards.

### Remaining limitation

A short stress test may miss leaks or degradation that occur over hours or days.

## Solution 3 — Soak testing

A **soak test** runs sustained expected load for an extended period.

It is useful for detecting:

- Memory leaks
- Connection leaks
- Disk growth
- Queue accumulation
- Cache instability
- Token/session cleanup failures

### Decision guide

```text
Expected peak traffic?       → Load test
Find capacity and failure?   → Stress test
Find gradual degradation?    → Soak test
```

### Validation

- Define p50, p95, and p99 latency targets.
- Measure throughput, error rate, saturation, and resource use.
- Include realistic request distributions, not only one endpoint.
- Use synthetic data and approved test environments.
- Set request limits, budgets, and automatic stop conditions.
- Test rate limiting and backpressure to prevent cascading failure.

---

# 4.8.2 Security Testing

## Problem

A system can satisfy functional requirements while exposing data or privileges.

```text
Feature works:
A user can update a profile.

Security failure:
A user changes another user's profile by modifying an ID in a request.
```

## Solution 1 — Static Application Security Testing (SAST)

**SAST** analyzes source code, dependencies, and configuration without attacking a running system.

It can identify patterns such as:

- SQL injection risks
- Hardcoded secrets
- Unsafe deserialization
- Insecure cryptography
- Path traversal risks
- Known vulnerable dependencies
- Misconfigured infrastructure-as-code

### Pros
- Fast feedback during development and pull requests.
- Finds common coding and dependency risks early.
- Scales well across repositories.

### Cons
- Can produce false positives.
- Cannot prove runtime protections are configured correctly.
- Does not replace human security review.

### Remaining limitation

Static scanning cannot fully validate a deployed application’s runtime behavior.

## Solution 2 — Dynamic Application Security Testing (DAST)

**DAST** probes a running application in an approved environment.

It may detect:

- Missing security headers
- Exposed debug endpoints
- Insecure cookies
- Reflected input issues
- Weak TLS configuration
- Authentication/session flaws
- Runtime misconfiguration

### Pros
- Tests the deployed application surface.
- Finds runtime issues source scanning cannot see.

### Cons
- Can be slow and noisy.
- Requires safe scope and authorization.
- May miss flaws requiring authenticated or business-context knowledge.

### Remaining limitation

Automated scanning cannot replace an expert assessment of complex authorization and business-logic flaws.

## Solution 3 — Penetration testing and threat modeling

A penetration test is an authorized security assessment that combines automation and expert investigation.

Threat modeling happens earlier: identify assets, trust boundaries, threats, and mitigations during design.

```text
Asset: customer profile data
      ↓
Threat: unauthorized profile access
      ↓
Mitigation: server-side authorization per resource
      ↓
Validation: integration tests + security review + pen test
```

### Decision guide

| Need | Recommended approach |
|---|---|
| Catch insecure code patterns early | SAST |
| Detect vulnerable libraries | Dependency scanning |
| Detect leaked credentials | Secret scanning |
| Validate deployed web security controls | DAST |
| Assess high-risk business logic or public exposure | Penetration test |
| Design secure architecture before implementation | Threat model |

### Security validation

Test and enforce:

- Server-side authentication and authorization.
- Deny-by-default permissions.
- Object-level authorization: users access only permitted records.
- Parameterized database queries.
- Strict input validation and output encoding.
- HTTPS-only communication.
- Secure cookies: `HttpOnly`, `Secure`, appropriate `SameSite`.
- Rate limits and account lockouts for authentication flows.
- Security headers: CSP, HSTS, `X-Content-Type-Options`.
- Secret scanning and secret-manager usage.
- Safe error responses without stack traces or sensitive details.

> Run DAST, fuzzing, and penetration testing only against systems you are explicitly authorized to test.

---

# 4.8.3 Accessibility Testing

## Problem

A visually functional UI may be impossible to use with a keyboard, screen reader, magnification, or reduced-motion preference.

```text
Mouse user:
Clicks "Save" successfully.

Keyboard user:
Cannot reach the button.

Screen-reader user:
The button has no accessible name.
```

## Solution 1 — Automated accessibility checks

Use automated scans to identify common issues:

- Missing form labels
- Invalid ARIA usage
- Low color contrast
- Missing image alternative text
- Incorrect heading hierarchy
- Duplicate IDs

### Pros
- Fast and repeatable.
- Useful in local development and CI.
- Catches common structural defects.

### Cons
- Cannot judge whether alternative text is meaningful.
- Cannot fully validate keyboard workflows or screen-reader experience.
- Can create false confidence if treated as complete accessibility testing.

### Remaining limitation

Automated scanning cannot prove that a real user can complete the task.

## Solution 2 — Manual keyboard and assistive-technology testing

Test critical workflows with:

- Keyboard-only navigation
- Screen reader
- Browser zoom
- High-contrast settings where applicable
- Reduced-motion preference
- Mobile screen reader where relevant

### Pros
- Validates real interaction.
- Finds issues automation cannot detect.
- Improves usability for everyone.

### Cons
- Requires skill and time.
- Must be repeated for significant UI changes.

### Accessibility validation checklist

```text
- All functions work with a keyboard.
- Focus is visible and follows a logical order.
- Fields have programmatic labels.
- Errors identify the invalid fields.
- Error and success messages are announced.
- Dialog focus is managed correctly.
- Color is not the only source of meaning.
- Content works at 200% zoom.
- Motion can be reduced or disabled.
```

---

# 4.8.4 Internationalization and Compatibility Testing

## Problem

Software that works in one locale or browser may fail elsewhere.

Examples:

```text
Date: 04/05/2026
US interpretation → April 5
Many other locales → 4 May

Currency:
$1,234.56 versus 1.234,56 €
```

## Solution 1 — Locale-aware implementation and tests

Test formatting, pluralization, date handling, and translated content.

### Pros
- Prevents user confusion and financial/date mistakes.
- Supports global users.
- Detects layout failures caused by longer translated text.

### Cons
- Requires supported-locale decisions and translated test content.
- Full linguistic quality still needs human review.

### Remaining limitation

Locale tests do not prove the UI works across every browser, device, and operating system.

## Solution 2 — Compatibility matrix

Define explicitly supported platforms.

Example:

| Platform | Support level |
|---|---|
| Current Chrome, Edge, Firefox | Full support |
| Current Safari | Full support |
| Latest iOS Safari and Android Chrome | Critical workflows |
| Unsupported/outdated browsers | Clear upgrade guidance |

### Pros
- Makes compatibility expectations clear.
- Focuses test effort on supported users.

### Cons
- Device and browser combinations grow quickly.
- Requires periodic revision as browser versions change.

### Validation

- Use UTC internally for timestamps where possible.
- Store dates/times with explicit offsets or as instants.
- Format for the user locale at the presentation boundary.
- Use internationalization libraries/platform APIs rather than manual formatting.
- Test right-to-left layouts if supported.
- Test long translated text, plural forms, and non-Latin input.

---

# 4.8.5 Resilience and Chaos Testing

## Problem

Distributed systems depend on networks, databases, caches, queues, and third-party services. Any dependency can fail.

```text
Application → identity provider
                    ↓
                 timeout

Without resilience:
Requests hang or fail unpredictably.

With resilience:
Timeout → controlled fallback/error → monitoring → recovery
```

## Solution 1 — Failure-mode integration tests

Simulate realistic failures in controlled tests:

- Database unavailable
- HTTP timeout
- Queue backlog
- Cache miss or outage
- Invalid third-party response
- Slow dependency
- Expired credential

### Pros
- Tests error handling close to the implementation.
- Fast enough for CI in many cases.
- Verifies safe error responses and retries.

### Cons
- May not reveal system-wide cascading failures.
- Requires careful simulation of realistic conditions.

### Remaining limitation

Component-level failure testing cannot fully show how the deployed system behaves under complex, concurrent failure.

## Solution 2 — Controlled chaos experiments

Intentionally introduce a controlled fault into a non-production or carefully governed production environment.

```text
Hypothesis:
If the cache is unavailable, authenticated requests continue safely
at reduced performance without exposing data.

Experiment:
Temporarily block cache connectivity.

Expected result:
- Controlled fallback
- No authorization bypass
- Bounded latency
- Alert fires
- Service recovers
```

### Pros
- Validates operational resilience in realistic conditions.
- Exposes hidden dependencies and weak recovery behavior.
- Improves incident readiness.

### Cons
- Requires mature monitoring, rollback, and incident controls.
- Can cause disruption if poorly planned.
- Not appropriate as an early or casual testing activity.

### Decision guide

```text
Need to test one dependency failure?
→ Failure-mode integration test.

Need to validate deployed recovery and observability?
→ Controlled chaos experiment.

System lacks monitoring, rollback, or isolation?
→ Improve operational readiness first.
```

### Validation

- Define a hypothesis and measurable success criteria.
- Use a non-production environment by default.
- Limit blast radius and duration.
- Establish stop conditions and rollback before starting.
- Verify alerts, dashboards, logs, and runbooks.
- Confirm sensitive operations remain secure during degraded operation.

---

## 5. Practical TypeScript example: validating a performance-relevant limit

This unit-level example does not replace load testing. It protects a common scalability control: bounding pagination to prevent unbounded database work and response sizes.

```typescript name=pagination.test.ts
import { describe, expect, it } from "vitest";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function parsePageSize(value: string | undefined): number {
  if (value === undefined) {
    return DEFAULT_PAGE_SIZE;
  }

  if (!/^\d+$/u.test(value)) {
    throw new RangeError("Page size must be a positive whole number.");
  }

  const pageSize = Number(value);

  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new RangeError("Page size must be a positive whole number.");
  }

  return Math.min(pageSize, MAX_PAGE_SIZE);
}

describe("parsePageSize", () => {
  it("uses the default when no page size is supplied", () => {
    expect(parsePageSize(undefined)).toBe(DEFAULT_PAGE_SIZE);
  });

  it("accepts a valid page size within the maximum", () => {
    expect(parsePageSize("50")).toBe(50);
  });

  it("caps page size to protect service and database capacity", () => {
    expect(parsePageSize("100000")).toBe(MAX_PAGE_SIZE);
  });

  it("rejects invalid input", () => {
    expect(() => parsePageSize("-1")).toThrow(RangeError);
    expect(() => parsePageSize("1.5")).toThrow(RangeError);
    expect(() => parsePageSize("many")).toThrow(RangeError);
  });
});
```

### Why this matters

```text
Unbounded page size
→ excessive database work
→ high memory use
→ slow responses
→ possible denial-of-service amplification

Bounded page size
→ predictable resource use
→ safer, more scalable API behavior
```

The API should also enforce query timeouts, indexed ordering, authorization filters, and rate limits.

---

## 6. Summary

```text
Performance     → Is it fast and stable at demand?
Security        → Can it resist misuse and attack?
Accessibility   → Can everyone operate it?
i18n            → Does it work across supported locales?
Compatibility   → Does it work on supported platforms?
Resilience      → Does it fail safely and recover?
```

**Recommended default:** automate baseline security, dependency, accessibility, and compatibility checks in CI; use risk-based load and resilience testing before significant releases; and monitor latency, errors, security events, and availability after deployment.

---

# 4.9 Advanced Testing Techniques

## Goal

Use advanced techniques when conventional example-based tests are not enough to uncover edge cases, weak assertions, unsafe input handling, or unexpected behavior.

---

## 1. Problem: Example-based tests have blind spots

Traditional tests use selected inputs:

```text
Input: 2 + 2
Expected: 4
```

This is useful, but it may miss:

- Unexpected combinations of valid input.
- Malformed or hostile input.
- Assertions that are too weak.
- Output regressions.
- Usability issues outside scripted cases.

```text
Hand-picked examples → known cases covered
Generated/adversarial input → unknown edge cases explored
```

---

## 2. Solution 1: Property-based testing

Instead of checking only examples, define a **property** that should always hold.

### Example properties

```text
Sorting:
- Output has the same number of items as input.
- Output is ordered.
- Output contains the same items as input.

Encoding:
- Decoding(encoded(value)) equals value.

Pagination:
- Returned count never exceeds requested maximum.
```

### Pros

- Explores many input combinations automatically.
- Finds boundary cases humans may not think of.
- Encourages precise domain invariants.
- Good for transformations, parsers, calculations, and validation.

### Cons

- Properties can be difficult to define.
- Random failures need good diagnostics and reproducible seeds.
- Generated data must respect domain constraints.

### Remaining limitation

Generated inputs are often valid or semi-valid. They may not sufficiently simulate malformed, hostile, or structurally broken input.

---

## 3. Solution 2: Fuzz testing

**Fuzzing** sends unexpected, malformed, random, or adversarial input to a system.

```text
Untrusted input
    ↓
Fuzzer generates variations
    ↓
Parser / API / file handler
    ↓
Look for crashes, hangs, leaks, unsafe behavior
```

Good fuzzing targets:

- File uploads and parsers.
- URL and query-string parsing.
- JSON/XML/data format processing.
- Image/document conversion.
- Authentication token parsing.
- API request validation.
- Command or configuration parsers.

### Pros

- Finds crashes, hangs, parsing defects, and input-validation gaps.
- Valuable at security boundaries.
- Can discover vulnerabilities that normal test cases miss.

### Cons

- Requires execution-time and resource limits.
- Failures can be difficult to reproduce unless failing inputs are saved.
- May generate many low-value invalid cases without good targeting.

### Remaining limitation

Fuzzing finds unexpected behavior, but does not prove that normal expected behavior is correct or that test assertions are strong.

---

## 4. Solution 3: Mutation testing

**Mutation testing** intentionally changes application code and checks whether tests fail.

Example mutations:

```text
Original: if (role === "administrator")
Mutant:   if (role !== "administrator")

Original: total > 0
Mutant:   total >= 0
```

If tests still pass after the mutation, they may not be asserting important behavior.

### Pros

- Measures test effectiveness better than line coverage alone.
- Finds missing assertions and untested conditions.
- Useful for critical calculations, permissions, and validation rules.

### Cons

- Computationally expensive.
- Can produce equivalent mutations that do not change behavior.
- Usually unsuitable for every pull request.

### Remaining limitation

Mutation testing evaluates existing tests; it does not discover new product requirements or real-world workflow problems.

---

## 5. Solution 4: Snapshot testing

A **snapshot test** stores an approved representation of output and compares future output against it.

Useful examples:

- Stable rendered component output.
- API response shape.
- Generated configuration.
- Structured email template output.

```text
Current output → compare with approved snapshot
                     ↓
            unexpected difference detected
```

### Pros

- Quickly detects output changes.
- Useful for stable structured output.
- Easy to review when snapshots are small and meaningful.

### Cons

- Large snapshots become unreadable.
- Teams may approve changes without reviewing them.
- Snapshots can hide weak assertions.

### Remaining limitation

A snapshot shows that output changed; it may not explain whether the change is correct or user-visible.

---

## 6. Solution 5: Exploratory testing

**Exploratory testing** is structured learning while testing. The tester investigates the product, adapts based on findings, and records observations.

```text
Mission:
Explore account recovery for security, clarity, and error handling.

Actions:
- Use invalid addresses.
- Request multiple resets.
- Test expired links.
- Switch browsers.
- Interrupt network connectivity.
- Use keyboard-only navigation.
```

### Pros

- Finds workflow, usability, and unexpected interaction problems.
- Effective for new, changing, or poorly understood features.
- Uses human judgment where automation is weak.

### Cons

- Results depend on tester skill.
- Coverage is less repeatable unless notes and charters are maintained.
- Does not replace automated regression coverage.

### Decision guide

| Need | Preferred approach |
|---|---|
| Validate universal business invariant | Property-based testing |
| Test malformed or adversarial input | Fuzzing |
| Assess whether tests have strong assertions | Mutation testing |
| Detect output changes in stable structures | Snapshot testing |
| Investigate unknown workflows and usability | Exploratory testing |
| Verify known business examples | Standard unit/integration/E2E tests |

---

## 7. Practical TypeScript example: property-based testing

This example verifies pagination limits. It checks the invariant across many generated integer inputs rather than a few selected examples.

```typescript name=pagination.property.test.ts
import { describe, expect, it } from "vitest";
import fc from "fast-check";

const MAX_PAGE_SIZE = 100;

function normalizePageSize(requested: number): number {
  if (!Number.isSafeInteger(requested) || requested < 1) {
    throw new RangeError("Page size must be a positive safe integer.");
  }

  return Math.min(requested, MAX_PAGE_SIZE);
}

describe("normalizePageSize", () => {
  it("always returns a value between 1 and the configured maximum", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: Number.MAX_SAFE_INTEGER }),
        (requested) => {
          const normalized = normalizePageSize(requested);

          expect(normalized).toBeGreaterThanOrEqual(1);
          expect(normalized).toBeLessThanOrEqual(MAX_PAGE_SIZE);
        },
      ),
    );
  });

  it("preserves page sizes already within the permitted range", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: MAX_PAGE_SIZE }),
        (requested) => {
          expect(normalizePageSize(requested)).toBe(requested);
        },
      ),
    );
  });

  it("rejects invalid page sizes", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ max: 0 }),
          fc.double({ noNaN: false, noDefaultInfinity: false }),
        ),
        (invalidValue) => {
          if (
            !Number.isSafeInteger(invalidValue) ||
            invalidValue < 1
          ) {
            expect(() => normalizePageSize(invalidValue)).toThrow(
              RangeError,
            );
          }
        },
      ),
    );
  });
});
```

### Why this adds value

Hand-written examples might test:

```text
1, 25, 100, 101
```

Property-based testing checks many values automatically:

```text
1, 2, 99, 100, 101, 25,000, very large safe integers, invalid values
```

The security and scalability invariant is explicit:

```text
A page size is always bounded.
```

This helps prevent unbounded database queries and oversized API responses.

---

## 8. Security considerations

### Property-based testing
Use it for:

- Authorization invariants.
- Input normalization.
- Token expiry calculations.
- Data transformation and encoding/decoding.
- Financial and quota limits.

### Fuzzing
Use it for untrusted boundaries:

- Reject malformed input safely.
- Prevent crashes and resource exhaustion.
- Set strict time, memory, request-size, and recursion-depth limits.
- Preserve the minimized failing input and seed for regression tests.

### Mutation testing
Apply it to security-critical rules:

```text
- Permission checks
- Ownership checks
- Validation boundaries
- Rate-limit rules
- Session expiry rules
```

### Snapshot testing
Do not snapshot:

- Access tokens.
- Passwords.
- Session identifiers.
- Personal data.
- Full production-like API responses containing sensitive fields.

Redact or use synthetic data before snapshot creation.

---

## 9. Accessibility, performance, and operations

### Accessibility

Exploratory testing is especially useful for:

- Keyboard-only task completion.
- Focus order and visible focus.
- Screen-reader announcements.
- Error recovery.
- Zoom, reflow, and reduced-motion behavior.
- Unexpected UI states such as slow loading or failed submission.

Snapshots and property tests can support UI logic, but cannot replace browser and assistive-technology testing.

### Performance

- Bound property generators to avoid excessively slow test runs.
- Run fuzzing with CPU, memory, and execution budgets.
- Run mutation testing on a schedule or critical-module change, not necessarily every pull request.
- Keep snapshots compact to avoid expensive, noisy reviews.

### Scalability and operations

```text
Pull request:
- Standard unit/integration tests
- Targeted properties for changed critical logic

Nightly or scheduled:
- Mutation testing
- Longer fuzzing campaigns
- Broad exploratory test sessions before release

Release:
- Preserve failures, seeds, traces, and minimized repro cases
```

Store diagnostics securely and redact sensitive input from logs and CI artifacts.

---

## 10. Summary

```text
Property-based testing → verifies invariants across many inputs
Fuzzing                → probes malformed and adversarial input
Mutation testing       → identifies weak tests and assertions
Snapshot testing       → detects meaningful output changes
Exploratory testing    → finds unknown workflow and usability issues
```

**Recommended default:** use ordinary example-based tests first; add property-based tests for high-value invariants, fuzzing for untrusted input boundaries, mutation testing for critical logic, snapshots only for stable meaningful output, and exploratory testing for new or high-risk workflows.

---

# 4.10 Regression and CI Test Automation

## Goal

Prevent previously working behavior from breaking while keeping feedback fast enough for daily development.

---

## 1. Problem: Regression testing becomes too slow or gets skipped

As a system grows, the test suite grows.

```text
Small system:
Run all tests → fast feedback

Large system:
Run all tests → long CI queue and execution time
              → developers wait or skip checks
              → regressions escape
```

Typical symptoms:

- Pull requests wait too long for CI.
- Developers rerun jobs without understanding failures.
- Flaky tests are retried until green.
- Full E2E suites run too rarely.
- Release confidence declines.

---

## 2. Solution 1: Automated regression suite

A **regression suite** verifies that existing behavior remains correct after a change.

```text
Code change
   ↓
Automated tests
   ↓
Existing behavior still works
```

Typical layers:

```text
Fast:
- Type checking
- Linting
- Unit tests
- Focused integration tests

Slower:
- Database/container integration tests
- Contract tests
- E2E smoke tests

Slowest:
- Full E2E suite
- Cross-browser checks
- Load/security/resilience tests
```

### Pros

- Detects regressions before release.
- Creates repeatable evidence.
- Reduces reliance on manual retesting.
- Supports confident refactoring.

### Cons

- Suites grow over time.
- Slow or flaky checks reduce trust.
- Automation cannot replace exploratory, usability, and stakeholder validation.

### Remaining limitation

Running every test on every change may eventually be too slow and expensive.

---

## 3. Solution 2: Test selection

Run the tests most relevant to a change first.

```text
Changed file: payment calculation
        ↓
Run:
- Related unit tests
- Payment API integration tests
- Relevant contract tests
- Checkout E2E smoke test
```

### Selection approaches

| Approach | Description | Risk |
|---|---|---|
| Path-based | Run tests based on changed directories/files | Can miss indirect dependencies |
| Tag-based | Label tests, such as `smoke`, `integration`, `security` | Labels can become stale |
| Dependency-based | Use dependency graph to identify affected tests | Requires correct tooling/graph |
| Risk-based | Always run critical tests for sensitive areas | Requires disciplined classification |
| Full suite on schedule | Run all tests nightly/pre-release | Detects issues later |

### Pros

- Faster pull-request feedback.
- Lower CI cost.
- Lets teams retain broader test suites.

### Cons

- Incorrect selection may miss regressions.
- Needs a safety net: scheduled full runs and release validation.

### Remaining limitation

Selection improves speed, but individual test jobs may still take too long.

---

## 4. Solution 3: Parallelization

Run independent tests across multiple workers.

```text
Sequential:
Test 1 → Test 2 → Test 3 → Test 4

Parallel:
Worker A → Test 1, Test 2
Worker B → Test 3, Test 4
```

### Pros

- Reduces total wall-clock time.
- Uses CI capacity efficiently.
- Improves developer feedback loops.

### Cons

- More CI runners can increase cost.
- Shared state causes collisions and flakes.
- Order-dependent tests may fail only in parallel.

### Parallel-safe test design

- Create unique test users, tenants, schemas, queues, and files.
- Do not share mutable state across tests.
- Use temporary directories.
- Isolate databases per test or per worker.
- Avoid fixed ports; let tooling allocate ports.
- Clean up resources even after failures.
- Ensure tests can run in any order.

### Remaining limitation

Fast execution is not enough if low-quality changes can still merge.

---

## 5. Solution 4: Quality gates

A **quality gate** blocks merge or deployment until agreed checks pass.

```text
Pull request
   ↓
Build + tests + security checks + policy checks
   ↓
Pass → eligible to merge
Fail → investigate or fix
```

### Typical pull-request quality gates

```text
- Build succeeds.
- Type checking and linting pass.
- Unit tests pass.
- Required integration tests pass.
- Critical E2E smoke tests pass.
- No unapproved critical security findings.
- Secrets are not detected.
- Required review and branch protection rules are met.
```

### Typical release quality gates

```text
- Migration validation passes.
- Full relevant regression suite passes.
- Accessibility checks pass for changed workflows.
- Performance budgets are met.
- Deployment/rollback plan is available.
- Monitoring and alerts are ready.
- No unresolved release-blocking defects.
```

### Pros

- Establishes consistent release standards.
- Prevents known failures from progressing.
- Makes risk acceptance explicit rather than accidental.

### Cons

- Unreliable gates become obstacles rather than safeguards.
- Excessive gates slow low-risk work.
- A passing pipeline is evidence, not proof of safety.

### Decision guide

| Change type | Suggested checks |
|---|---|
| Documentation-only | Build, links, formatting |
| Internal low-risk logic | Type, lint, unit tests |
| API change | Unit, integration, contract, compatibility checks |
| Database migration | Integration migration test, backup/rollback validation |
| Authentication/authorization | Security checks, integration tests, E2E smoke test |
| Public UI workflow | Unit/integration, E2E, accessibility checks |
| High-traffic release | Performance and resilience validation |

---

## 6. Practical TypeScript example: safe test partitioning

This example divides an independent list of tests across CI workers. It uses a stable hash rather than shared mutable state.

```typescript name=test-sharding.ts
import { createHash } from "node:crypto";

export function shouldRunOnShard(
  testId: string,
  shardIndex: number,
  shardCount: number,
): boolean {
  if (
    !Number.isSafeInteger(shardIndex) ||
    !Number.isSafeInteger(shardCount) ||
    shardCount < 1 ||
    shardIndex < 0 ||
    shardIndex >= shardCount
  ) {
    throw new RangeError("Invalid shard configuration.");
  }

  const hash = createHash("sha256")
    .update(testId, "utf8")
    .digest();

  const bucket = hash.readUInt32BE(0) % shardCount;

  return bucket === shardIndex;
}
```

### Why this works

```text
Test ID → SHA-256 hash → deterministic bucket → one CI worker
```

Properties:

- Each test consistently maps to one shard.
- Tests do not need a shared coordinator.
- Adding or removing tests does not require hand-maintained split lists.

### Important limitation

Sharding only splits execution. Tests must still be independent:

```text
Unsafe:
Two workers modify the same account or shared database row.

Safer:
Each worker creates uniquely named test data or isolated infrastructure.
```

---

## 7. Handling flaky tests

A **flaky test** passes and fails without a relevant code change.

### Do not normalize retries

```text
Bad:
Retry until green, then ignore it.

Better:
Retry once only for diagnostic context.
Record the flake.
Assign ownership.
Fix the underlying cause.
```

### Track

- Flake rate by test and suite.
- Failure reason.
- Retry count.
- Time to resolution.
- Quarantined tests and expiry date.

### Common causes and fixes

| Cause | Fix |
|---|---|
| Fixed timing delay | Wait for observable state |
| Shared account/data | Unique isolated test data |
| External service instability | Test double, sandbox, or contract test |
| Test execution order | Independent setup and cleanup |
| Time-zone/clock dependency | Inject a fixed clock |
| Resource contention | Increase capacity or reduce parallelism |
| Browser state leak | New browser context per test |

Quarantine only as a temporary containment measure. A quarantined test should have an issue, owner, and due date.

---

## 8. Security considerations

CI pipelines are part of the attack surface.

### Protect the pipeline

- Use least-privileged CI identities.
- Use short-lived credentials where supported.
- Store secrets in the CI secret store or external secret manager.
- Never echo secrets, tokens, or connection strings.
- Redact sensitive values from logs and test artifacts.
- Avoid exposing secrets to pull requests from untrusted forks.
- Pin GitHub Actions or CI dependencies to trusted immutable versions where possible.
- Scan dependencies, containers, IaC, and source code.
- Restrict who can change workflows and branch-protection rules.

### Test security behavior in CI

For sensitive changes, automate:

```text
- Authentication and authorization tests
- Input validation tests
- Secret scanning
- Dependency vulnerability scanning
- SAST
- DAST against an approved non-production environment
- Security-header and cookie-configuration checks
```

---

## 9. Accessibility, performance, and operations

### Accessibility

Run automated accessibility checks for affected pages in CI, then manually validate important workflows:

```text
Automated scan → common structural issues
Keyboard test  → interaction and focus
Screen reader  → real assistive experience
```

Use accessible locators in browser tests. This improves both test stability and UI semantics.

### Performance

```text
Every pull request:
- Fast tests and performance-sensitive unit/integration checks

Scheduled or release pipeline:
- Load, stress, soak, cross-browser, mutation, and broad E2E suites
```

Track CI performance:

- Queue time
- Execution time
- Cache hit rate
- Failure and flake rate
- Cost per pipeline
- Time to actionable feedback

### Operations

- Store traces, screenshots, and logs securely.
- Redact sensitive data from artifacts.
- Retain artifacts only as long as needed.
- Provide links from failures to logs, traces, and relevant runbooks.
- Run deployment smoke tests and verify rollback capability.
- Monitor production after deployment; CI cannot predict every real operational condition.

---

## 10. Summary

```text
Regression suite  → protects existing behavior
Test selection    → accelerates focused feedback
Parallelization   → reduces wall-clock CI time
Quality gates     → prevent known-bad changes
Flake management  → preserves trust in automation
```

**Recommended default:** run type checks, linting, unit tests, targeted integration tests, security scans, and a small smoke suite on every pull request; run broader regression, cross-browser, performance, resilience, and security testing on a scheduled or release pipeline.

---

# 4.11 Defect Management

## Goal

Capture, prioritize, fix, verify, and learn from defects without losing critical information or creating unnecessary process overhead.

---

## 1. Problem: Bugs are reported inconsistently

Without a shared defect process:

- Reports lack reproduction steps.
- The same issue is reported multiple times.
- Severity and urgency are confused.
- Security-sensitive information is exposed in tickets.
- Bugs are fixed without regression tests.
- Recurring problems are treated as isolated incidents.

```text
Unclear report
   ↓
Cannot reproduce
   ↓
Delayed triage
   ↓
Repeated defect or production escape
```

A defect-management process should be lightweight for ordinary issues and more rigorous for high-impact, security, data-loss, or recurring failures.

---

## 2. Solution 1: Use a consistent bug report and lifecycle

A useful defect report describes observable behavior and enough context to reproduce it.

### Recommended bug report fields

| Field | Purpose |
|---|---|
| Title | Concise summary of the user-visible failure |
| Expected behavior | What should happen |
| Actual behavior | What happened instead |
| Reproduction steps | Minimal repeatable sequence |
| Environment/version | Browser, OS, release, API version, configuration |
| Impact | Users, data, revenue, security, operations affected |
| Evidence | Sanitized logs, screenshots, trace ID, test result |
| Workaround | Temporary mitigation, if known |
| Severity and priority | Impact and delivery urgency |
| Owner/status | Accountability and progress |

### Example

```text
Title:
Member can access a deactivated account after refreshing an existing session

Expected:
A deactivated account's active sessions are revoked immediately.

Actual:
The member remains authenticated until the existing session expires.

Reproduction:
1. Sign in as a member.
2. In another session, sign in as an administrator.
3. Deactivate the member account.
4. Refresh the member dashboard.
5. Observe that protected content remains accessible.

Environment:
Staging, release 2026.10.13, Chromium 130

Impact:
High security risk: deactivated users retain access.

Evidence:
Sanitized request trace ID: 8f2d...
```

### Typical lifecycle

```text
New
 ↓
Triaged
 ↓
In progress
 ↓
Resolved
 ↓
Verified
 ↓
Closed

Alternative outcomes:
Duplicate | Cannot reproduce | Deferred | Won't fix
```

### Pros

- Improves triage and reproducibility.
- Creates an audit trail.
- Helps teams identify trends.
- Makes ownership visible.

### Cons

- Detailed reporting costs time.
- A heavyweight process is unnecessary for trivial defects.

### Remaining limitation

A good report helps fix the immediate problem, but does not explain why it happened or prevent recurrence.

---

## 3. Solution 2: Separate severity from priority

These terms answer different questions.

```text
Severity → How harmful is the defect?
Priority → How urgently should the organization address it?
```

### Severity

Severity measures technical, user, security, compliance, or business impact.

| Severity | Example |
|---|---|
| Critical | Data loss, active security exploit, complete outage |
| High | Privilege escalation, payment failure, core workflow unavailable |
| Medium | Important workflow partially broken with workaround |
| Low | Minor visual defect or non-critical wording issue |

### Priority

Priority measures planned response order.

| Priority | Example |
|---|---|
| Urgent | Security vulnerability or production outage |
| High | Blocking an upcoming release or many users |
| Normal | Important but not time-critical |
| Low | Minor improvement planned with related work |

### Example distinction

```text
A typo on a homepage before a major product launch:
Low severity, high priority.

An infrequently used export function that exposes personal data:
Critical severity, urgent priority.

A cosmetic issue in a retired internal page:
Low severity, low priority.
```

### Pros

- Supports rational planning.
- Prevents the most visible issue from always winning.
- Makes risk decisions explicit.

### Cons

- Classification can be subjective.
- Definitions must be agreed and applied consistently.

### Remaining limitation

Severity and priority guide the response, but recurring defects still need a deeper investigation.

---

## 4. Solution 3: Root cause analysis (RCA)

Use root cause analysis for major incidents, security defects, data loss, repeated regressions, or high-cost failures.

The goal is not to blame an individual. The goal is to improve the system of requirements, design, review, tests, deployment, and operations.

```text
Symptom:
Deactivated user remains signed in.

Immediate cause:
Existing sessions were not revoked.

Contributing causes:
- Requirement did not specify session revocation.
- No integration test covered existing sessions.
- No monitoring tracked access by deactivated accounts.

Preventive actions:
- Update acceptance criteria.
- Add session-revocation integration test.
- Add audit and monitoring signal.
```

### Useful RCA techniques

- **Five Whys:** repeatedly ask why a failure was possible.
- **Timeline analysis:** reconstruct decisions, deployments, and signals.
- **Fishbone diagram:** group contributors by people, process, technology, environment, and dependencies.
- **Fault tree analysis:** trace combinations of conditions that cause a top-level failure.

### Pros

- Prevents repeated classes of defects.
- Improves process and architecture.
- Encourages learning over blame.
- Produces concrete preventive actions.

### Cons

- Takes time and facilitation.
- Not appropriate for every low-impact defect.
- Weak RCAs can become vague documents without follow-up.

### Decision guide

| Situation | Recommended response |
|---|---|
| Minor isolated UI defect | Standard defect report and regression test if useful |
| Repeated defect in same area | Trend review and targeted RCA |
| Security issue | Restricted security report, rapid triage, RCA |
| Data loss/corruption | Incident response, backup/recovery review, RCA |
| Production outage | Incident process, timeline, RCA, prevention actions |
| Regression after prior fix | Add regression test and review why previous coverage failed |

---

## 5. Solution 4: Link fixes to prevention

A defect is not fully addressed merely because the immediate symptom is gone.

```text
Defect report
   ↓
Fix
   ↓
Regression test
   ↓
Review related risk areas
   ↓
Monitor after release
```

### Pros

- Reduces reoccurrence.
- Improves regression coverage.
- Builds organizational knowledge.

### Cons

- Requires discipline to avoid closing issues immediately after code is written.

### Recommended closure criteria

Before closing a meaningful defect:

```text
- Fix is reviewed and deployed to the intended environment.
- Reproduction steps no longer demonstrate the issue.
- Relevant regression test exists, where automation is appropriate.
- Related monitoring or alerting is updated if needed.
- Security/data handling concerns are addressed.
- User-facing documentation or support guidance is updated if necessary.
```

---

## 6. Practical TypeScript example: regression test for a defect

Suppose a prior defect allowed a deactivated account to retain active sessions. A focused test protects the expected behavior.

```typescript name=session-revocation.test.ts
import { describe, expect, it } from "vitest";

interface Session {
  id: string;
  accountId: string;
  revokedAt?: Date;
}

function revokeAccountSessions(
  sessions: readonly Session[],
  accountId: string,
  now: Date,
): Session[] {
  return sessions.map((session) => {
    if (session.accountId !== accountId || session.revokedAt) {
      return session;
    }

    return {
      ...session,
      revokedAt: now,
    };
  });
}

describe("revokeAccountSessions", () => {
  it("revokes every active session for a deactivated account", () => {
    // Regression: a deactivated account previously retained active sessions.
    const now = new Date("2026-10-13T12:00:00.000Z");

    const sessions: readonly Session[] = [
      { id: "session-1", accountId: "account-123" },
      { id: "session-2", accountId: "account-123" },
      { id: "session-3", accountId: "account-456" },
    ];

    const updatedSessions = revokeAccountSessions(
      sessions,
      "account-123",
      now,
    );

    expect(updatedSessions).toEqual([
      {
        id: "session-1",
        accountId: "account-123",
        revokedAt: now,
      },
      {
        id: "session-2",
        accountId: "account-123",
        revokedAt: now,
      },
      {
        id: "session-3",
        accountId: "account-456",
      },
    ]);
  });

  it("does not overwrite an existing revocation timestamp", () => {
    const originalRevocation = new Date("2026-10-12T12:00:00.000Z");

    const updatedSessions = revokeAccountSessions(
      [
        {
          id: "session-1",
          accountId: "account-123",
          revokedAt: originalRevocation,
        },
      ],
      "account-123",
      new Date("2026-10-13T12:00:00.000Z"),
    );

    expect(updatedSessions[0]?.revokedAt).toBe(originalRevocation);
  });
});
```

### Why this adds value

```text
Reported defect
→ account deactivation did not invalidate active sessions

Regression test
→ all active sessions for that account must be revoked

Prevention
→ future changes cannot silently reintroduce the same behavior
```

A production implementation should also verify sessions server-side on every protected request and reject revoked sessions. Do not rely only on client-side sign-out.

---

## 7. Security and privacy considerations

Defect trackers can become a source of sensitive information.

### Protect defect data

- Do not paste passwords, API keys, access tokens, cookies, or connection strings.
- Do not attach unnecessary production logs or personal data.
- Redact identifiers, emails, payment data, and session IDs where possible.
- Restrict security vulnerabilities to authorized security and engineering personnel.
- Use private reporting channels for vulnerabilities.
- Record evidence using safe references, such as a sanitized trace ID.
- Ensure attachments follow retention and access-control policies.

### Security defect handling

```text
Security report
  ↓
Restricted triage
  ↓
Assess exploitability and impact
  ↓
Containment / mitigation
  ↓
Fix and regression tests
  ↓
Validate deployment
  ↓
RCA and appropriate disclosure process
```

Avoid publicly disclosing exploitable details until remediation and coordinated disclosure decisions are complete.

---

## 8. Accessibility, performance, and operations

### Accessibility defects

Record the affected task and assistive context:

```text
- Browser and version
- Screen reader or keyboard-only path
- Expected accessible behavior
- Actual focus, announcement, label, or contrast issue
```

Do not classify accessibility defects as cosmetic by default. A blocked keyboard or screen-reader workflow may be high severity.

### Performance defects

Include measurable evidence:

```text
- Endpoint or workflow
- Request volume/concurrency
- p50, p95, and p99 latency
- Error rate
- Environment and data volume
- Resource saturation evidence
```

Avoid reports that only state “the system is slow.”

### Operational defects

Include:

- Deployment or release version.
- Timestamp with timezone.
- Correlation/trace ID.
- Relevant dependency health.
- Scope of affected users or tenants.
- Workaround and rollback state.

---

## 9. Metrics for defect management

Use metrics to improve systems, not to judge individuals.

Useful measures:

| Metric | What it indicates |
|---|---|
| Time to triage | How quickly impact is understood |
| Time to resolution | How quickly defects are addressed |
| Reopen rate | Whether fixes are complete |
| Escaped defects | Defects found after release |
| Defect recurrence rate | Whether prevention is working |
| Defect aging | Whether issues remain unresolved too long |
| Root-cause categories | Patterns in process or architecture |

Avoid using raw bug counts as a developer productivity metric. More reports can indicate better detection, increased usage, a risky release, or improved reporting—not lower individual performance.

---

## 10. Summary

```text
Good report        → makes defects reproducible
Severity           → measures impact
Priority           → determines urgency
Lifecycle          → gives clear ownership and status
Regression test    → prevents recurrence
Root cause analysis→ improves the system, not just the symptom
```

**Recommended default:** use concise, reproducible defect reports; triage impact separately from priority; add a regression test for meaningful fixes; and perform blameless root cause analysis for security issues, outages, data loss, and recurring defects.

---

# 4.12 Test Metrics and Reporting

## Goal

Use metrics to understand test effectiveness, product quality, delivery health, and operational reliability—without turning numbers into vanity targets.

---

## 1. Problem: Teams lack evidence for quality decisions

Without meaningful metrics, release decisions often rely on intuition:

```text
"It seems tested."
"Most checks passed."
"Coverage is high."
```

These statements may hide important risks:

- Tests are slow or flaky.
- Coverage is high but important authorization paths are untested.
- Defects are repeatedly escaping to production.
- Deployments are becoming slower or riskier.
- Incidents take too long to recover from.

```text
No metrics
   ↓
Unclear quality and delivery risk
   ↓
Reactive decisions and recurring problems
```

Metrics should answer a useful question and lead to an action.

---

## 2. Solution 1: Basic test metrics

Track the health of the automated test suite.

Useful measures include:

| Metric | Question answered |
|---|---|
| Pass/fail rate | Are checks currently reliable? |
| Test duration | Is feedback fast enough? |
| Queue time | Are developers waiting for CI capacity? |
| Flake rate | Which tests fail unpredictably? |
| Test count by level | Is coverage overly dependent on E2E tests? |
| Branch coverage | Which decision paths have no execution evidence? |

### Pros

- Easy to collect in CI.
- Identifies slow, unstable, or neglected suites.
- Helps improve developer feedback loops.

### Cons

- Test quantity does not equal test quality.
- A green pipeline can still miss important risks.
- Metrics without ownership or action become noise.

### Remaining limitation

A passing suite does not reveal whether the tests check the most important behavior or whether defects still reach users.

---

## 3. Solution 2: Coverage as a gap-finding signal

Coverage shows whether tests execute code.

```text
Line coverage:
Did a line run?

Branch coverage:
Did both outcomes of a decision run?

Function coverage:
Did a function run?
```

Example:

```text
if (actor.role === "administrator") {
  allowAction();
} else {
  denyAction();
}
```

A test covering only the administrator case may execute the `if`, but it does not verify deny-by-default behavior.

### Pros

- Reveals code paths that have no tests.
- Branch coverage highlights missed conditions.
- Useful during pull-request review for critical code.

### Cons

- High coverage does not prove correct assertions.
- Coverage can be inflated with weak tests.
- Some code, such as framework wiring, may not need direct unit-test coverage.

### Better use of coverage

```text
Weak target:
"Every project must reach 90% coverage."

Better question:
"Do critical authorization, validation, money, and data-changing
paths have meaningful behavior and branch coverage?"
```

### Remaining limitation

Coverage indicates execution, not real-world outcomes such as escaped defects, reliability, or recovery from incidents.

---

## 4. Solution 3: Defect-quality metrics

Measure whether defects are being detected early and prevented from recurring.

| Metric | Meaning |
|---|---|
| Escaped defects | Defects first discovered after release |
| Defect recurrence rate | Previously fixed defects that reappear |
| Reopen rate | Defects thought fixed but not fully resolved |
| Defect aging | How long defects remain unresolved |
| Defect density | Defects relative to a chosen size measure |
| Time to triage | How quickly impact and ownership are understood |
| Time to resolution | How quickly defects are addressed |

### Pros

- Connects testing to customer and operational outcomes.
- Highlights weak areas in requirements, testing, or release processes.
- Supports root-cause analysis and preventive work.

### Cons

- Defect counts are context-dependent.
- A rise in reports can mean better detection, increased usage, or worse quality.
- Comparing teams directly can create harmful incentives.

### Remaining limitation

Defect metrics show quality outcomes, but they do not fully describe delivery speed and operational stability.

---

## 5. Solution 4: DORA metrics

DORA metrics help teams understand software delivery performance.

| Metric | Question answered |
|---|---|
| Deployment frequency | How often can changes reach production? |
| Lead time for changes | How long does a change take from commit to production? |
| Change failure rate | How often do deployments cause incident, rollback, or hotfix? |
| Time to restore service | How quickly is service restored after an incident? |

```text
Fast delivery + low change failure rate
→ healthy delivery capability

Fast delivery + frequent failures
→ delivery speed may be unsafe

Slow delivery + low failures
→ delivery may be overly constrained

Slow delivery + frequent failures
→ investigate process, quality, and architecture
```

### Pros

- Connects engineering practices to delivery and operational outcomes.
- Identifies bottlenecks in CI, review, deployment, and recovery.
- Encourages continuous improvement.

### Cons

- Metrics need consistent definitions.
- They should not be used to rank individual developers.
- Different systems have different risk profiles and release models.

### Remaining limitation

DORA metrics identify delivery-system trends but do not tell you exactly which test or design change will improve them.

---

## 6. Solution 5: Action-oriented reporting

A useful report states the signal, risk, decision, and next action.

```text
Signal:
E2E flake rate increased from 1% to 8% over two weeks.

Risk:
Pull-request results are less trustworthy, and developers are rerunning CI.

Action:
- Identify the five most flaky tests.
- Assign owners.
- Isolate shared test accounts.
- Replace fixed delays with observable waits.

Success measure:
Reduce E2E flake rate below 2% for four consecutive weeks.
```

### Pros

- Turns data into improvement work.
- Keeps reports focused on outcomes.
- Supports blameless learning.

### Cons

- Requires agreed metric definitions and reliable data collection.
- Teams must reserve capacity for improvement work.

---

## 7. Practical TypeScript example: calculating a flake rate

A flaky test is one that passes on retry after initially failing without a relevant code change.

```typescript name=flake-rate.ts
interface TestRun {
  readonly testId: string;
  readonly initialStatus: "passed" | "failed";
  readonly retriedStatus?: "passed" | "failed";
}

function calculateFlakeRate(testRuns: readonly TestRun[]): number {
  if (testRuns.length === 0) {
    return 0;
  }

  const flakyRuns = testRuns.filter(
    (testRun) =>
      testRun.initialStatus === "failed" &&
      testRun.retriedStatus === "passed",
  );

  return (flakyRuns.length / testRuns.length) * 100;
}

const testRuns: readonly TestRun[] = [
  { testId: "sign-in", initialStatus: "passed" },
  {
    testId: "profile-update",
    initialStatus: "failed",
    retriedStatus: "passed",
  },
  { testId: "authorization-denial", initialStatus: "passed" },
  { testId: "account-deactivation", initialStatus: "passed" },
];

console.log(`${calculateFlakeRate(testRuns).toFixed(2)}%`);
```

### Expected result

```text
25.00%
```

### Why this matters

A retry may help distinguish transient infrastructure issues from deterministic failures, but it must not hide instability.

```text
Initial failure → retry once for diagnosis
       ↓
Passes on retry → record as flaky
       ↓
Investigate root cause and fix
```

Do not automatically retry security, authorization, data-integrity, or destructive-operation tests until they pass. A failure in those areas should be investigated immediately.

---

## 8. Decision guide

| Need | Useful metrics |
|---|---|
| Find untested critical decision paths | Branch coverage, targeted test review |
| Improve CI speed | Queue time, duration, cache hit rate |
| Improve CI trust | Flake rate, retry rate, failure categories |
| Reduce post-release defects | Escaped defects, recurrence rate, change failure rate |
| Improve incident recovery | Time to restore service, rollback success |
| Understand delivery bottlenecks | Lead time for changes, deployment frequency |
| Prioritize improvement work | Trends, risk, and action-oriented reports |

```text
Need to understand test-suite reliability?
→ Track flake rate, duration, and failure causes.

Need to understand release quality?
→ Track escaped defects and change failure rate.

Need to understand delivery flow?
→ Track DORA metrics.

Need to find test gaps?
→ Use coverage as a review signal, especially branch coverage.
```

---

## 9. Security, accessibility, performance, and operations

### Security

Track security-related signals separately from ordinary defects:

- Open critical vulnerability count.
- Time to triage and remediate vulnerabilities.
- Secret-scanning findings.
- Dependency vulnerability age.
- Authorization-test coverage for high-risk endpoints.
- Security incidents and recurrence.

Do not expose sensitive vulnerability details in broadly accessible dashboards.

### Accessibility

Track meaningful accessibility outcomes:

- Automated scan findings by severity.
- Keyboard and screen-reader defects in critical workflows.
- Time to fix blocking accessibility issues.
- Accessibility regression rate.

Automated scan counts alone are insufficient; include manual validation results for high-impact journeys.

### Performance

Track:

- p50, p95, and p99 latency.
- Error rate.
- Throughput.
- Resource saturation.
- Performance-budget failures.
- Regression trends after releases.

Do not report only averages: averages can hide poor experiences for slower requests.

### Scalability and operations

Track:

- CI queue and execution time.
- Test parallelization efficiency.
- Deployment success and rollback rate.
- Mean time to detect and restore service.
- Production error and availability trends.
- Test-environment reliability.

Keep dashboards access-controlled and redact personal data, tokens, and sensitive operational details.

---

## 10. Metrics anti-patterns

Avoid these mistakes:

### Treating coverage as a quality score

```text
High coverage ≠ secure, correct, accessible, or reliable software.
```

### Ranking individuals by defect count

This encourages hiding defects instead of reporting them.

### Using one threshold for every service

A payment API, internal reporting tool, and static documentation site have different risk profiles.

### Measuring without acting

```text
Metric collected
   ↓
No owner, threshold, or action
   ↓
Dashboard noise
```

### Ignoring context

A temporary increase in defects may reflect improved testing, a major release, increased traffic, or a real quality decline. Investigate before drawing conclusions.

---

## 11. Summary

```text
Coverage             → identifies unexecuted code and branches
Flake rate           → measures test-suite trustworthiness
Escaped defects      → reveals gaps before release
Defect recurrence    → shows whether prevention is working
DORA metrics         → show delivery and recovery health
Action-oriented reports → turn signals into improvements
```

**Recommended default:** track test duration, flake rate, branch coverage for critical code, escaped defects, and DORA metrics; review trends regularly; and convert every meaningful signal into an owned improvement action rather than a vanity dashboard.

---


---

---

---

---

---

---

---

---

---

---

