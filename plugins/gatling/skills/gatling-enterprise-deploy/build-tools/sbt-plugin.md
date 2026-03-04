# Gatling Enterprise - Deploy with the sbt plugin

## Pre-flight

Verify the project compiles:

```
sbt Gatling/compile
```

Fix any errors before proceeding.

## Deploy

```
sbt Gatling/enterpriseDeploy
```

## Notes

- The `gatling-sbt` sbt plugin must be enabled in `project/plugins.sbt`
