import type { Command } from "../Command";

import { Android } from "../Android";

export const BuildAppAndroidDebug: Command = {
  description: `Build debug Android app for local testing.`,
  label: `🤖 Android debug`,
  name: `build:app-android-debug`,
  run: async (root, { capture }) => Android.build(root, `debug`, capture),
};
