# Gatling Enterprise - Deploy with the JavaScript CLI

## Pre-flight

1. The `@gatling.io/cli` package must be listed in `package.json` dependencies.
2. Verify node modules are installed first.
3. Then, verify the project builds:

    ```
    npm run build
    ```

4. Fix any errors before proceeding.

## Deploy

```
npx gatling enterprise-deploy
```

## Start

```
npx gatling enterprise-start --enterprise-simulation="<display name>"
```
