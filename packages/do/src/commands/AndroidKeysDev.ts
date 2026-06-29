import type { Command } from "../Command";

import { AndroidKeys } from "../AndroidKeys";

export const AndroidKeysDev: Command = {
  description: `Generate Android signing keys in secrets.dev.yaml.`,
  label: `🤖 Android keys (dev)`,
  name: `android-keys-dev`,
  run: async root => AndroidKeys.update(root, `dev`),
};
