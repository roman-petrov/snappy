import type { Command } from "../Command";

import { Run } from "../Run";

export const EmailPreview: Command = {
  description: `Preview email templates in the browser.`,
  label: `📧 Email preview`,
  name: `email:preview`,
  run: Run.background({
    background: true,
    command: `bun email dev --dir emails --port 3000`,
    cwd: `packages/email`,
    silent: true,
  }),
};
