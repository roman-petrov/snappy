import type { Command } from "../Command";

import { VitePackage } from "../VitePackage";

export const BuildAdmin: Command = {
  description: `Build admin for production.`,
  label: `🛡️ Admin`,
  name: `build:admin`,
  run: VitePackage.run(`admin`),
};
