import type { Command } from "../Command";

import { Android } from "../Android";

export const JavaFormat: Command = {
  description: `Check Java format issues.`,
  label: `☕ Java format`,
  name: `java-format`,
  run: async (root, { capture }) => Android.spotless(root, `spotlessCheck`, capture),
};
