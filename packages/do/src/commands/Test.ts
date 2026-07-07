import type { Command } from "../Command";

import { Vitest } from "../Vitest";

export const Test: Command = { description: `Run tests.`, label: `🧪 Test`, name: `test`, run: Vitest.run() };
