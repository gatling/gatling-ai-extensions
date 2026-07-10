import type { Config } from "jest";
import { createJsWithBabelEsmPreset, createJsWithTsPreset } from "ts-jest";

const tsJestTransformCfg = createJsWithBabelEsmPreset({
  diagnostics: {
    ignoreCodes: [151002]
  }
}).transform;

export default {
  moduleNameMapper: {
    "@src/(.*)\\.js$": "<rootDir>/$1"
  },
  modulePathIgnorePatterns: ["src/index.test.ts"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg
  },
  rootDir: "src"
} satisfies Config;
