import type { Command } from "../Command";

import { Run } from "../Run";

export const Jscpd: Command = {
  description: `Check JSCPD issues.`,
  label: `📋 JSCPD`,
  name: `jscpd`,
  run: Run.tool(`jscpd`, []),
};
