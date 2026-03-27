---
name: gatling-detect-existing-project
description: Find an existing Gatling project, detect language and build tool used
license: Apache-2.0
---

# Detect an existing Gatling project

Search inside the current working directory, for a directory containing:

- `pom.xml` file, with `io.gatling:gatling-maven-plugin` plugin (Maven project)
    - if it also contains `kotlin-maven-plugin` plugin, language is Kotlin
    - if it also contains `scala-maven-plugin` plugin, language is Scala
    - otherwise language is Java
- `build.gradle` or `build.gradle.kts` file, with `io.gatling.gradle` plugin (Gradle project)
    - if it also contains `kotlin` plugin, language is Kotlin
    - if it also contains `scala` plugin, language is Scala
    - otherwise language is Java
- `build.sbt` file with, with `io.gatling:gatling-sbt` plugin (sbt project)
    - language is Scala.
- `package.json` file, with `@gatling.io/cli` dependency (npm project)
    - if it contains `typescript` dependency, language is TypeScript
    - otherwise language is JavaScript.

If nothing matches, there is no existing Gatling project here.
