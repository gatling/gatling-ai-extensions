---
name: gatling-dsl
description: Verify that a Gatling DSL call is valid before trusting it, by checking a compile/build result and, if doubt remains, cross-checking against Gatling's own public compile-test files for the target language (Java, Scala, JavaScript/TypeScript, Kotlin). Use whenever unsure if a DSL method, parameter, or pattern is correct, e.g. while writing or reviewing simulation code.
license: Apache-2.0
user-invocable: false
---

# Verify Gatling DSL usage

## Instructions

### Step 1: Trust a clean build

A successful compile/build of the target project is definitive: the DSL usage is valid, move on.

### Step 2: Cross-check against Gatling's own compile-test files

If doubt remains, e.g. an unfamiliar method, an ambiguous parameter, or no build available yet, resolve every DSL call currently in doubt against Gatling's own compile-test files rather than guessing, reusing a file already pulled into context this investigation instead of re-fetching it, and reading the whole relevant section once it's open rather than just the one call that prompted the fetch. These files are public, unauthenticated, and definitive for what the DSL actually accepts:

- Java
  - Core: https://raw.githubusercontent.com/gatling/gatling/refs/heads/main/gatling-core-java/src/test/java/io/gatling/javaapi/core/CoreJavaCompileTest.java
  - HTTP: https://raw.githubusercontent.com/gatling/gatling/refs/heads/main/gatling-http-java/src/test/java/io/gatling/javaapi/http/HttpJavaCompileTest.java
- Scala
  - Core: https://raw.githubusercontent.com/gatling/gatling/refs/heads/main/gatling-core/src/test/scala/io/gatling/core/compile/CoreCompileTest.scala
  - HTTP: https://raw.githubusercontent.com/gatling/gatling/refs/heads/main/gatling-http/src/test/scala/io/gatling/http/compile/HttpCompileTest.scala
- JavaScript/TypeScript
  - Core: https://raw.githubusercontent.com/gatling/gatling-js/refs/heads/main/js/core/src/index.test.ts
  - HTTP: https://raw.githubusercontent.com/gatling/gatling-js/refs/heads/main/js/http/src/index.test.ts
- Kotlin: reuses the Java DSL for everything except a small set of keyword aliases, see Known gotchas below

Fetch these with a plain unauthenticated request (curl, WebFetch); no GitHub auth is needed for public raw file content.

Done when every call that was in doubt is either confirmed by the reference or the reference is silent on it, in which case escalate to the user instead of guessing.

#### Known gotchas

Cross-language, for methods that take a body/chain:

- `.on()` is required in Java, JavaScript, and Kotlin but not Scala: `exitBlockOnFail { ... }` in Scala is `exitBlockOnFail().on(...)` elsewhere, same for `group("name") { ... }` / `group("name").on(...)`, and all loops.

Session access differs by language:

- `session.getString("name")` in Java, JavaScript, and Kotlin
- `session("name").as[String]` in Scala

Kotlin: some Java DSL method names are Kotlin keywords, so Kotlin ships dedicated aliases for them instead of requiring backtick-escaping. Known aliases:

- `.is(x)` → `.shouldBe(x)`
- `.in(x, y)` → `.within(x, y)`

The Java compile-test files above are silent on these: they're Java source, so a Kotlin-only alias will never appear in them. Treat that silence as "unknown," not "doesn't exist": confirm by test-compiling the Kotlin candidate rather than concluding no alias exists or falling back to backtick-escaping.

Java:

- If a variable needs to be saved inside a function AND that function is used within an Expression Language string, move the code to an `exec` block instead. EL strings can't save variables directly.
- Parse dates with `java.time.format.DateTimeFormatter.ofPattern`, using the system default zone, and store the formatter outside the function to avoid recreation cost.
- Compile regular expressions with `java.util.regex.Pattern.compile` and store the compiled pattern outside the function to avoid recreation cost.
