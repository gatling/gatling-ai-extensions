# Gatling Enterprise - Deploy with the Gradle plugin

## Pre-flight

1. Use `./gradlew` (wrapper) if present, otherwise `gradle`.
2. The Gatling Gradle plugin must be applied in `build.gradle` or `build.gradle.kts`.
3. Verify the project compiles:

    ```
    ./gradlew testClasses
    ```

4. Fix any errors before proceeding.

## Deploy

```
./gradlew gatlingEnterpriseDeploy
```

## Start

Use the simulation name in the `.gatling/package.conf` package descriptor file:

```
./gradlew gatlingEnterpriseStart -Dgatling.enterprise.simulationName="<display name>"
```
