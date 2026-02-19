import { defineConfig } from "@pandacss/dev";

import { snappyUiPreset } from "./panda-preset";

export default defineConfig({
  include: [`./src/**/*.ts`, `./src/**/*.tsx`],
  jsxFramework: `react`,
  outdir: `styled-system`,
  presets: [snappyUiPreset],
  strictTokens: true,
});
