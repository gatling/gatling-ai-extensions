# Gatling Enterprise - Deploy with the Gradle plugin

## Pre-flight

1. Use `./gradlew` (wrapper) if present, otherwise `gradle`.
2. The Gatling Gradle plugin must be applied in `build.gradle` or `build.gradle.kts`.
3. Verify the project compiles. The Gatling Gradle plugin puts simulations in a dedicated `gatling` source set, not `test`, so the standard `testClasses`/`compileTestJava`-style tasks report `NO-SOURCE` and verify nothing. Use the language-specific task instead:

    ```
    ./gradlew compileGatlingJava   # Java
    ./gradlew compileGatlingScala  # Scala
    ./gradlew compileGatlingKotlin # Kotlin
    ```

    If unsure which applies, `./gradlew tasks --all --console=plain | grep -i gatling` lists the real task names rather than guessing.

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
