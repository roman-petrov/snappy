import type { Command } from "../Command";

import { Run } from "../Run";

export const DockerStart: Command = {
  description: `Start Docker for development.`,
  label: `🐳 Docker`,
  name: `docker:start`,
  run: Run.shell(`docker desktop start`),
};
