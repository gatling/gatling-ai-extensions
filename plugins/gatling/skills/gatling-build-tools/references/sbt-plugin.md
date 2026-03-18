# Gatling Enterprise - Deploy with the sbt plugin

## Pre-flight

1. The `gatling-sbt` sbt plugin must be enabled in `project/plugins.sbt`.
2. Verify the project compiles:

    ```
    sbt Gatling/compile
    ```

3. Fix any errors before proceeding.

## Deploy

```
sbt Gatling/enterpriseDeploy
```

## Start

```
sbt 'Gatling/enterpriseStart "<display name>"'
```
