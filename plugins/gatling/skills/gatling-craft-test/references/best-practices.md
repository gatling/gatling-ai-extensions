# Gatling best practices

Apply these while writing or reviewing simulation code, regardless of whether it's authored from scratch or produced by a conversion skill.

## HTTP protocol

- Extract common configuration (base URL, common headers, user agent) into a shared `httpProtocol` object rather than repeating it per request.

## Feeders

- Use feeders instead of hardcoded user data for anything that should vary per virtual user.
- Prefer a single shared feeder over duplicating the same data source across scenarios, unless each scenario genuinely needs independent iteration through the data (see the test-data section of `checklist.md`).

## Checks

- Every request whose response is used later (correlation, assertions) should have an explicit `.check(...)` rather than relying on default status checks alone.

## Naming

- Name requests (`http("name")`) descriptively and consistently. These names are what `details(...)` assertions and reports key off, so vague or duplicate names undermine both.

## Structure

- Keep one scenario per distinct user journey; avoid overloading a single scenario with unrelated flows via conditionals.
- Use `group()` only for multi-request logical transactions; avoid wrapping single requests in `group()` since Gatling already names and tracks requests individually.
