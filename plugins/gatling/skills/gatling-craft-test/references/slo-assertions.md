# SLOs to Gatling assertions

Once SLOs are confirmed in the checklist, encode each one as an entry in `setUp(...).assertions(...)`. An SLO isn't done until it exists as an assertion. Don't leave it as a comment or a note.

## Global SLOs

Apply to the whole simulation via `global()`:

```
setUp(scn.injectOpen(...))
  .assertions(
    global().responseTime().percentile(95.0).lt(500),
    global().successfulRequests().percent().gt(99)
  )
```

Common mappings:

- "p95/p99 response time under Xms" -> `global().responseTime().percentile(95.0).lt(X)` (or `percentile(99)`)
- "error rate under X%" / "success rate over X%" -> `global().successfulRequests().percent().gt(100 - X)`
- "max response time under Xms" -> `global().responseTime().max().lt(X)`

## Per-request SLOs

Scope to a specific named request via `details("requestName")`:

```
.assertions(
  details("Login").responseTime().percentile(99.0).lt(300),
  details("Checkout").successfulRequests().percent().is(100)
)
```

The request name must match exactly the name given in the corresponding `http("requestName")` call.

## Placement

Add all assertions to the same `setUp(...).assertions(...)` block as the injection profile. Don't create a second `setUp` call just for assertions.
