---
name: gatling-bootstrap-project
description: Bootstrap/set up a Gatling project to get started with Gatling load tests.
license: Apache-2.0
user-invocable: true
---

# Bootstrap a Gatling project

## Choose language

Ask user to choose one of the supported languages:

- Java
- Kotlin
- Scala
- TypeScript
- JavaScript

If user doesn't know, Java is a good default.

## Choose a build tool

IF language is Java or Kotlin:
- Ask user to choose between Maven or Gradle. If user doesn't know, Maven is a good default.

IF language is Scala:
- Ask user to choose between sbt, Maven or Gradle.

IF language is TypeScript or JavaScript:
- Always use npm.

## Set up the Gatling project

Once build tool and language are identified, read the corresponding file and follow its instructions:

- Maven: ./resources/maven.md
- Gradle: ./resources/gradle.md
- sbt: ./resources/sbt.md
- npm: ./resources/npm.md

## Suggest next steps

- Explore the included sample simulation and check out the Gatling documentation linked in the README file.
- Run your first simulation locally.
- When ready to deploy to Gatling Enterprise, use the /Gatling:gatling-build-tools skill for guidance.   
