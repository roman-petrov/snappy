import type { Command } from "../Command";

import { VitePackage } from "../VitePackage";

export const BuildSite: Command = {
  description: `Build site for production.`,
  label: `🌐 Site`,
  name: `build:site`,
  run: VitePackage.run(`site`),
};
