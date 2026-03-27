---
name: gatling-convert-from-jmeter
description: Guide for converting Apache JMeter tests to Gatling.
license: Apache-2.0
user-invocable: true
---

# Convert a JMeter test plan to a Gatling simulation

## Instructions

### Step 1: Find input JMeter test plan

- Search for files with `.jmx` extension
- If several files found, ask user to specify one

### Step 2: Specify output

Either find an existing Gatling project or initialize a new Gatling project:

- Try to find an existing project with the /Gatling:gatling-detect-existing-project skill.
- If no existing project is found, offer to create a new one with the /Gatling:gatling-bootstrap-project skill.

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
Using `findAll` with `jmesPath` is a mistake but you can tell Gatling the expected type with an extra step.
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

#### Functions

Some functions have variants that saves the result to a variable (e.g.: `__Random(0,10,myVar)`) but Gatling
Expression Language cannot save variables as a side effect.

IF a variable needs to be saved inside the function AND the function is used within an Expression Language
- Move the code to an exec block that allows saving variables

When parsing dates, use `java.time.format.DateTimeFormatter.ofPattern` with system default zone and store it
outside a function to avoid creation cost overhead.

For regular expression, use `java.util.regex.Pattern.compile` and store it outside a function to avoid creation cost
overhead.

Convert these functions to what JMeter uses under the hood:

- `changeCase` => `toUpperCase` or `toLowerCase` with `Locale.ROOT` or `capitalize`
- `digest` => `java.security.MessageDigest`
- `urldecode` => `java.net.URLDecoder.decode`
- `urlencode` => `java.net.URLEncoder.encode`
- `UUID` => `java.util.UUID.randomUUID`

Import `org.unbescape:unbescape` for the following escaping functions:

- `escapeHtml` => `HtmlEscape.escapeHtml5`
- `escapeXml` => `XmlEscape.escapeXml10`
- `unescape` => `JavaEscape.unescapeJava`
- `unescapeHtml` => `HtmlEscape.unescapeHtml`

### Step 4: Verify the code compiles

Use the build-tool skill if available.

### Step 5: Post conversion

After the conversion in Step 3, prompt the user for possible enhancements that are more idiomatic to Gatling.

IF `ThreadGroup.ramp_time` is 0 or 1:
- Suggest converting `rampUsers` to `atOnceUsers`
