import type { Command } from "../Command";

import { Android } from "../Android";

export const JavaFormatFix: Command = {
  description: `Fix Java format issues.`,
  label: `☕ Java format fix`,
  name: `java-format-fix`,
  run: async (root, { capture }) => Android.spawnGradle(root, `spotlessApply`, capture),
};
