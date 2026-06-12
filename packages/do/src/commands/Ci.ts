import type { Command } from "../Command";

export const Ci: Command = {
  children: [`test`, `lint`, `build`],
  description: `Run tests, check, and build for production.`,
  label: `🔁 CI`,
  name: `ci`,
};
