import type { Config } from "jest";
import { createJsWithTsPreset } from "ts-jest";

export default {
  ...createJsWithTsPreset({
    diagnostics: {
      ignoreCodes: [151002]
    }
  })
} satisfies Config;
