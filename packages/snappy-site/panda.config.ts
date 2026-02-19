import { defineConfig } from "@pandacss/dev";
import { snappyUiPreset } from "@snappy/ui/panda-preset";

export default defineConfig({
  include: [`./src/**/*.ts`, `./src/**/*.tsx`, `../ui/src/**/*.ts`, `../ui/src/**/*.tsx`],
  jsxFramework: `react`,
  outdir: `styled-system`,
  presets: [snappyUiPreset],
});
