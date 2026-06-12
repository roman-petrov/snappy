import type { Command } from "../Command";

import { Run } from "../Run";

export const Cspell: Command = {
  description: `Check CSpell issues.`,
  label: `📝 CSpell`,
  name: `cspell`,
  run: Run.tool(`cspell`, [`.`]),
};
