import type { Config } from "jest";
import { createJsWithBabelEsmPreset } from "ts-jest";

const tsJestTransformCfg = createJsWithBabelEsmPreset({
  diagnostics: {
    ignoreCodes: [151002]
  }
}).transform;

export default {
  moduleNameMapper: {
    "^@src/(.*)\\.js$": "<rootDir>/$1"
  },
  modulePathIgnorePatterns: ["src/__tests__", "src/index.test.ts"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg
  },
  rootDir: "src"
} satisfies Config;
