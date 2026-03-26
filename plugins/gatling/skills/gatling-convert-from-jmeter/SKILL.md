---
name: gatling-convert-from-jmeter
description: Guide for converting Apache JMeter tests to Gatling.
license: Apache-2.0
---

# Convert a JMeter test plan to a Gatling simulation

## Instructions

### Step 1: Find input JMeter test plan

- Search for files with `.jmx` extension
- If several files found, ask user to specify one

### Step 2: Specify output

Either find an existing Gatling project or initialize a new Gatling project.

#### Option 1 : search for existing Gatling project and identify language

Search inside the current working directory for a project containing:

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

If no Gatling project found, offer to initialize a new one.

#### Option 2 : initialize new Gatling project

Ask user to chose their preferred language and build tool, then download the corresponding sample project:

- Java
  - with Maven: https://github.com/gatling/gatling-maven-plugin-demo-java/archive/refs/heads/main.zip
  - with Gradle: https://github.com/gatling/gatling-gradle-plugin-demo-java/archive/refs/heads/main.zip
- Kotlin
  - with Maven: https://github.com/gatling/gatling-maven-plugin-demo-kotlin/archive/refs/heads/main.zip
  - with Gradle: https://github.com/gatling/gatling-gradle-plugin-demo-kotlin/archive/refs/heads/main.zip
- Scala
  - with Maven: https://github.com/gatling/gatling-maven-plugin-demo-scala/archive/refs/heads/main.zip
  - with Gradle: https://github.com/gatling/gatling-gradle-plugin-demo-scala/archive/refs/heads/main.zip
  - with sbt: https://github.com/gatling/gatling-sbt-plugin-demo/archive/refs/heads/main.zip
- TypeScript with npm: https://github.com/gatling/gatling-js-demo/archive/refs/heads/main.zip, then only copy the `typescript` directory from this sample project
- JavaScript with npm: https://github.com/gatling/gatling-js-demo/archive/refs/heads/main.zip, then only copy the `javascript` directory from this sample project

Unzip the content to a new `gatling-project` directory within the current working directory.

### Step 3: Conversion

- Convert the JMeter test to a Gatling test written in the specified language.
- Write the output to the specified Gatling project.

#### ThreadGroup

Each ThreadGroup converts to a scenario.

IF `serialize_threadgroups` true:
- Chain the scenarios with `andThen`
ELSE:
- Just list the scenarios in the `setUp` block

#### Resource files

Files referenced in elements such as:

- CSVDataSet
- HTTPFileArgs

should be copied to the resources directory in the Gatling project.

#### Redirects

| JMeter                     | Gatling                     |
|----------------------------|-----------------------------|
| `follow_redirects` = true  | default setting, do nothing |
| `follow_redirects` = false | `disableFollowRedirect`     |

#### CSVDataSet

`CSVDataSet` converts to a csv feeder.

IF there are several instances of `CSVDataSet` referencing the same file name:
- IF `shareMode.group`:
  - Create a new csv feeder for each scenario
  ELSE:
  - Create a single feeder and use it in each scenario

#### JMESPathExtractor

The `jmesPath` Gatling check extracts Strings, meaning that non String values get serialized back into JSON.
You can tell Gatling the expected type with an extra step.
Note that the check will then fail is the actual value doesn’t match the expected type.

```
jmesPath("foo").ofString(),
jmesPath("foo").ofBoolean(),
jmesPath("foo").ofInt(),
jmesPath("foo").ofLong(),
jmesPath("foo").ofDouble(),
// JSON array
jmesPath("foo").ofList(),
// JSON object
jmesPath("foo").ofMap(),
// anything
jmesPath("foo").ofObject()
)
```

### Step 4: Post conversion

After the conversion in Step 3, prompt the user for possible enhancements that are more idiomatic to Gatling.

IF `ThreadGroup.ramp_time` is 0 or 1:
- Suggest converting `rampUsers` to `atOnceUsers`
