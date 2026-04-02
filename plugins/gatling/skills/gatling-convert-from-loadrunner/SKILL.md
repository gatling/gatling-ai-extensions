---
name: gatling-convert-from-loadrunner
description: Guide for converting HP/Micro Focus/OpenText LoadRunner scripts to Gatling. Use this skill whenever the user mentions LoadRunner, VuGen, LR scripts, .c action files, vuser_init, web_url, web_submit_data, or any LoadRunner-specific functions. Trigger on phrases like "convert this action", "convert this LoadRunner test to Gatling", "migrate from LoadRunner", or when the user shares .c/.h files that look like LoadRunner scripts.
license: Apache-2.0
user-invocable: true
---

# Convert a LoadRunner script to a Gatling simulation

## Instructions

### Step 1: Find the LoadRunner script, configuration, and parameters files

- Search for LoadRunner script files:
  - `Action.c`, `vuser_init.c`, `vuser_end.c`: the standard three-file layout
  - Any `.c` or `.h` files in a LoadRunner script directory (look for a `.usr` or `.lrs` descriptor file nearby)
  - A single combined `.c` file containing all sections
- If multiple scripts or directories are found, ask the user to specify which one to convert
- Read all relevant `.c` and `.h` files before proceeding
- Read all relevant `.dat` files as plain text fil es
- Search for a `default.cfg` file in the same directory and read it if present
- Search for a `.prm` file in the same directory and read it if present

### Step 2: Specify output

Either find an existing Gatling project or initialize a new one:

- Try to find an existing project with the /Gatling:gatling-detect-existing-project skill
- If no existing project is found, offer to create a new one with the /Gatling:gatling-bootstrap-project skill

### Step 3: Conversion

- Convert the LoadRunner script to a Gatling test written in the specified language
- Write the output to the appropriate source directory of the Gatling project

#### Preamble

##### Java SDK

IF a variable needs to be saved inside the function AND the function is used within an Expression Language string:
- Move the code to an exec block that allows saving variables

When parsing dates, use `java.time.format.DateTimeFormatter.ofPattern` with system default zone and store it
outside a function to avoid creation cost overhead.

For regular expression, use `java.util.regex.Pattern.compile` and store it outside a function to avoid creation cost
overhead.

##### Gatling DSL

Be aware of DSL differences between all the languages Gatling support.

Some methods needs to be followed by `.on()` in Java, JavaScript and Kotlin but not Scala:

- `exitBlockOnFail { ... }`: `exitBlockOnFail().on(...)`
- `group("name") { ... }`: `group("name").on(...)`
- All loops, etc.

Session handling is different, e.g.:

- `session.getString("name")` in Java, JavaScript and Kotlin, `session("name").as[String]` in Scala

#### Script structure

A LoadRunner script has up to three logical sections. Map them as follows:

- `vuser_init`: `before` block on the simulation
- `Action`: one or more `scenario` + `exec`
- `vuser_end`: `after` block on the simulation

If the script only has an `Action` section (or a single `.c` file), produce a simulation with just a scenario.

#### Runtime settings from `default.cfg`

IF a `default.cfg` file is present for runtime settings that affects HTTP behavior:

Check the `[General]` section:

- `AutomaticTransactions=1` and/or `AutomaticTransactionsPerFunc=1`: LoadRunner can auto-wrap actions or function calls into transactions. In Gatling, scenario and request names serve this purpose directly; no `group()` blocks are needed here
- `DefaultRunLogic`: read the file, check `RunLogicActionOrder` in the `[RunLogicRunRoot]` section actions order, chain them with `exec`
- `ContinueOnError=1`: add `exitHereIfFailed()` between requests, otherwise Gatling continues on error by default; mention this to the user
- `FailTransOnErrorMsg=1`: apply the logic of `lr_error_message` as Gatling checks if possible, wrap the transaction inside a `exitBlockOnFail()` block

Check the `[ThinkTime]` section:

- `Options=NOTHINK`: keep pauses times but add `.disablePauses()` to `setUp`
- `Options=RECORDED`: keep pauses times
- `Options=MULTIPLY`: keep original pauses times, Gatling does not have a direct equivalent; mention this to the user
- `Options=RANDOM`: keep pauses times, use `ThinkTimeRandomLow` and `ThinkTimeRandomHigh`, add `.uniformPauses()` to `setUp` with the closest number that matches the original plus or minus values

Check the `[WEB]` section:

- `CustomUserAgent`: add `.userAgentHeader()` to `httpProtocol`
- `SearchForImages=1`: add `.inferHtmlResources()` to `httpProtocol`

#### HTTP requests

- `web_url(name, url, ...)`: `http(name).get(url)`
- `web_submit_data(name, ...)`: `http(name).post(url).formParam(...)`
- `web_submit_form(name, ...)`: `http(name).post(url).formParam(...)`
- `web_custom_request(name, method, url, ...)`: `http(name).httpRequest(method, url)`
- `web_add_header(name, value)`: `.header(name, value)` on the **next** request only, never on `httpProtocol`
- `web_add_auto_header(name, value)`: `httpProtocol.header(name, value)` if called before any request; otherwise add `.header(name, value)` to every subsequent request manually

`web_add_header` is one-shot: it applies only to the immediately following request, then is cleared; never hoist it into `httpProtocol`
`web_add_auto_header` persists from the point of the call onward. If it appears before any request in the script, map it to `httpProtocol.header(...)`; if it appears mid-script, add `.header(...)` to each request that follows it

For `web_submit_data`, extract each `ITEMDATA` name/value pair as a `.formParam(name, value)`.

#### Response checks and correlation

- `web_reg_save_param(param, LB=, RB=)`: `.check(regex("LB(.*?)RB").saveAs("param"))`
- `web_reg_save_param_ex(...)`: `.check(regex(...).saveAs(...))` or `.check(xpath(...))`
- `web_reg_find(text=...)`: `.check(bodyString.contains(...))`
- `web_reg_check(...)`: `.check(...)` with appropriate extractor

Place `.check(...)` calls on the request that triggers the response being checked.
`web_reg_*` functions are registered before the request they apply to, find the next `web_url`/`web_submit_data` and attach the check there.

#### Parameters and session variables

- `{ParamName}` (LR parameter substitution): `#{paramName}` (Gatling EL)
- `lr_save_string(value, "param")`: `.exec(session -> session.set("param", value))`
- `lr_param_sprintf("param", fmt, ...)`: `.exec(session -> session.set("param", ...))` with string formatting
- `lr_eval_string("{param}")`: `session.getString("param")` or `"#{param}"` in EL strings

For parameter files (`.dat` files referenced in the script or `.usr` descriptor), convert them to Gatling feeders.
Copy the data file to the Gatling project's `resources` directory.

IF a `.prm` file is present, check it for each `[parameter:<parameter name>]` entries:

- `ColumnName="Col <number>"`: 
- `ColumnName="<column name>"`:
- `Delimiter="<char>"`: use `csv`, `tsv`, or `separatedValues("<file path>", '<char>')`
- `SelectNextRow="Random"`: use `.random()`
- `SelectNextRow="Same line as <parameter name>"`: ensure configuration is the same as `<parameter name>`
- `SelectNextRow="Sequential"`: use `.circular()`
- `SelectNextRow="Unique"`: use `.queue()` but it has no real Gatling equivalent; mention this to the user

#### Transactions

- `lr_start_transaction("name")`: start of a `group("name")` block
- `lr_end_transaction("name", LR_AUTO)`: end of the `group` block

#### Logging

- `lr_output_message`, `lr_log_message`: remove these or convert to a comment, Gatling handles logging at the framework level
- `lr_error_message`: keep, wrap inside an `exec` block with session and use `.markAsFailed()` on session if necessary

#### Rendezvous points

- `lr_rendezvous("name")`: remove, Gatling does not have a direct equivalent; mention this to the user

#### Resource files

Any files referenced in the script (e.g., request body files, upload files, data files) should be copied to the Gatling project's `resources` directory and referenced via `RawFileBody("filename")` or a feeder.

### Step 4: Verify the code compiles

Use the build-tool skill if available.

### Step 5: Post conversion

After the conversion, inform the user of:

1. Any LoadRunner features that have no direct Gatling equivalent (rendezvous points, IP spoofing, etc.) and suggest alternatives
2. Any hardcoded credentials or environment-specific values found in the script that should be parameterized
3. Possible Gatling-idiomatic improvements, such as:
   - Extracting the `HttpProtocol` configuration (base URL, common headers) into a shared `httpProtocol` object
   - Replacing repeated `formParam` blocks with a map if there are many parameters
   - Using feeders for any remaining hardcoded user data
