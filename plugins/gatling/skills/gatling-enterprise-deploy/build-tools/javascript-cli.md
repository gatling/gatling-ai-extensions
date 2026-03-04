# Gatling Enterprise - Deploy with the JavaScript CLI

## Pre-flight

Verify node modules are installed first.

Then, verify the project builds:

```
npm run build
```

Fix any errors before proceeding.

## Deploy

```
npx gatling enterprise-deploy
```

## Notes

- The `@gatling.io/cli` package must be listed in `package.json` dependencies
