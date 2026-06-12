import type { Command } from "../Command";

import { VitePackage } from "../VitePackage";

export const BuildApp: Command = {
  description: `Build app for production.`,
  label: `💻 App`,
  name: `build:app`,
  run: VitePackage.run(`app`),
};
