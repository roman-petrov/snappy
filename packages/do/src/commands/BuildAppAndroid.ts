import type { Command } from "../Command";

import { Android } from "../Android";

export const BuildAppAndroid: Command = {
  description: `Build Android app for production.`,
  label: `🤖 Android app`,
  name: `build:app-android`,
  run: async (root, { capture }) => Android.build(root, `release`, capture),
};
