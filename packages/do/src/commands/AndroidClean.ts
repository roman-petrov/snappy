import type { Command } from "../Command";

import { Android } from "../Android";

export const AndroidClean: Command = {
  description: `Clean Android build outputs.`,
  label: `🧹 Android clean`,
  name: `android:clean`,
  run: async (root, { capture }) => Android.clean(root, capture),
};
