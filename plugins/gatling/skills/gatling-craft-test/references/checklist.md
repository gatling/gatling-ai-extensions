# Test spec checklist

Four items make up a proper Gatling test spec. For each, distinguish between values already derivable from an existing source (JMeter/LoadRunner file, functional test, API spec, etc.) and values that must be asked directly.

## 1. Scenario

- What are the user journeys / requests to simulate?
- Is there an existing functional test, API spec, or recording to base this on (Postman collection, OpenAPI spec, HAR file, Playwright/Selenium test, JMeter/LoadRunner source, etc.)?
  - If derived from a JMeter/LoadRunner source: the scenario structure is already known from ThreadGroups/Actions, so confirm it rather than re-asking.
  - If derived from another format with no dedicated conversion skill: read it, propose a scenario, and confirm with the user.
  - If nothing exists: ask directly what the test should exercise.
- Target system/environment, protocol (HTTP, WebSocket, etc.), and auth are part of this conversation; they are not a separate checklist item.

## 2. Test data

- What data does each request need (e.g. login credentials, search terms, IDs)? Where does it come from (CSV, JSON, database, generated)?
- If derived from a source (CSVDataSet, `.dat`/`.prm` files): confirm the feeder mapping and sharing mode rather than re-asking.
- Cross-check volume against the injection profile once both are known: estimate the iterations implied by the injection profile and compare to the available rows.
  - If data would run out under `.queue()`: flag it and ask whether `.circular()`/`.random()` reuse is acceptable, or whether more data is needed.

## 3. Injection profile

- Ask explicitly, in plain language: does load arrive independently of response time (open model, e.g. public web traffic, `constantUsersPerSec`/`rampUsersPerSec`), or is it a fixed pool of users looping (closed model, e.g. an internal back-office tool, `atOnceUsers`/`rampUsers`/`constantConcurrentUsers`)?
  - If the user isn't sure, default to the open model.
  - If open model, ask which test type(s) they want, since each shapes the profile differently:
    - Smoke: minimal load (e.g. a handful of users/sec) for a short duration, to confirm the scenario runs end-to-end
    - Standard: gradual ramp-up to the target rate, hold at a plateau, ramp-down
    - Stress: push beyond the expected peak rate to find where the system degrades or breaks
    - Spike: a sharp, short burst to the peak rate (or beyond) with little to no ramp, to test resilience to sudden traffic
    - Capacity: a series of stepped plateaus at increasing rates, to find the maximum rate that still meets SLOs
    - Soak: a moderate, sustained rate held for an extended duration (hours), to catch degradation over time (leaks, resource exhaustion)
    - If unsure, default to standard.
- Then capture the numbers: target load (rate or user count), ramp duration, steady-state duration.
- If derived from a source (ThreadGroup thread count/ramp, LoadRunner vuser count): present it as a default to confirm, not a fresh question.

## 4. SLOs

- Ask for global SLOs (e.g. overall p95/p99 response time, overall success rate) for the whole simulation.
- Actively ask whether any specific requests/transactions have their own SLOs distinct from the global ones (e.g. "checkout must stay under 300ms even if the rest of the site is slower").
- SLOs have no JMeter/LoadRunner equivalent, so always ask, even when the other items are derived from a source file.
