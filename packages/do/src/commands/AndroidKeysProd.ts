import type { Command } from "../Command";

import { AndroidKeys } from "../AndroidKeys";

export const AndroidKeysProd: Command = {
  description: `Generate Android signing keys in secrets.prod.yaml.`,
  label: `🤖 Android keys (prod)`,
  name: `android-keys-prod`,
  run: async root => AndroidKeys.update(root, `prod`),
};
