# Gatling Enterprise - Deploy with the Maven plugin

## Pre-flight

Verify the project compiles:

```
./mvnw test-compile
```

Fix any errors before proceeding.

## Deploy

```
./mvnw gatling:enterpriseDeploy
```

## Start

Use the simulation name in the `.gatling/package.conf` package descriptor file:

```
./mvnw gatling:enterpriseStart -Dgatling.enterprise.simulationName="<simulation name>"
```

## Notes

- Use `./mvnw` (wrapper) if present, otherwise `mvn`
- The Gatling Maven plugin must be declared in `pom.xml`
