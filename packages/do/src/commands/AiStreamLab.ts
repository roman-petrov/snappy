import type { Command } from "../Command";

import { Run } from "../Run";

export const AiStreamLab: Command = {
  description: `AiStream lab at http://localhost:5174/`,
  label: `🧪 AiStream lab`,
  name: `ai-stream-lab`,
  run: Run.background({
    background: true,
    command: `bun vite --port 5174 --strictPort`,
    cwd: `packages/ai-stream-lab`,
  }),
};
