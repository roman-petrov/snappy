import type { Command } from "../Command";

import { Run } from "../Run";

export const Markdownlint: Command = {
  description: `Check Markdownlint issues.`,
  label: `📄 Markdown`,
  name: `markdownlint`,
  run: Run.tool(`markdownlint`, [`.`]),
};
