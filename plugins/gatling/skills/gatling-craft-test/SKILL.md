---
name: gatling-craft-test
description: Guide for crafting a proper Gatling test. Defines the test spec (scenario, test data, injection profile, SLOs) and ensures the resulting simulation follows Gatling best practices. Use this skill whenever the user wants to write, design, or review a Gatling simulation, whether starting from scratch or as part of converting an existing test (JMeter, LoadRunner, etc.).
license: Apache-2.0
user-invocable: true
---

# Craft a proper Gatling test

## Instructions

### Step 1: Determine invocation mode

IF invoked directly by the user (not as an explicit step from another skill):
- Check whether the user has an existing test asset to convert from:
  - JMeter (`.jmx` files): hand off entirely to the /Gatling:gatling-convert-from-jmeter skill
  - LoadRunner (`.c`/`.h` scripts, `vuser_init`, `web_url`, etc.): hand off entirely to the /Gatling:gatling-convert-from-loadrunner skill
  - More conversion skills may exist beyond these two: check for any other dedicated Gatling conversion skill whose trigger matches what the user describes
- If there is no dedicated conversion skill for the source (e.g. a Postman collection, an OpenAPI spec, a HAR file, a Playwright/Selenium test), do not hand off: treat it as a scenario source in Step 2 below and use your best judgment to translate it

IF invoked as a step from another skill (e.g. a conversion skill has already read a source file and knows the target project):
- Skip the routing check above entirely: go straight to Step 2, using whatever the calling skill already knows as derived defaults

### Step 2: Build the spec

Work through `references/checklist.md`. For each of the four items, state clearly whether the value is already derived from an existing source (and from where) or needs to be asked, and confirm derived values with the user rather than re-deriving silently.

### Step 3: Encode SLOs as assertions

Once SLOs are confirmed, follow `references/slo-assertions.md` to translate them into Gatling `assertions()` code. An SLO is not done until it is enforced in code. Do not leave it as a comment or a note.

### Step 4: Apply best practices

Follow `references/best-practices.md` while writing or reviewing the simulation code.

### Step 5: Verify the code compiles

Use the /gatling:gatling-build-tools skill to run the project's compile/verify task. If doubt remains about an unusual DSL call, use the /gatling:gatling-dsl skill rather than guessing.

Once it compiles, before proposing the full injection profile, suggest a minimal smoke run (one user, one iteration) against the target environment. A clean compile only proves the code is syntactically valid; it doesn't catch runtime issues like broken correlation, malformed request bodies, or mistuned pause units.
