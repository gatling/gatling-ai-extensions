# Gatling Enterprise - Deploy with the Maven plugin

## Pre-flight

1. Use `./mvnw` (wrapper) if present, otherwise `mvn`.
2. The Gatling Maven plugin must be declared in `pom.xml`.
3. Verify the project compiles:

    ```
    ./mvnw test-compile
    ```

4. Fix any errors before proceeding.

## Deploy

```
./mvnw gatling:enterpriseDeploy
```

## Start

Use the simulation name in the `.gatling/package.conf` package descriptor file:

```
./mvnw gatling:enterpriseStart -Dgatling.enterprise.simulationName="<simulation name>"
```
