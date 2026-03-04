# Gatling Enterprise - Deploy with the Gradle plugin

## Pre-flight

Verify the project compiles:

```
./gradlew testClasses
```

Fix any errors before proceeding.

## Deploy

```
./gradlew gatlingEnterpriseDeploy
```

## Notes

- Use `./gradlew` (wrapper) if present, otherwise `gradle`
- The Gatling Gradle plugin must be applied in `build.gradle` or `build.gradle.kts`
