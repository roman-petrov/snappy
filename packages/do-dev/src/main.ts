/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/no-process-exit */
import { Console } from "@snappy/node";

import { ServerDev } from "./ServerDev";

try {
  await ServerDev();
} catch (error: unknown) {
  Console.errorLine(error instanceof Error ? (error.stack ?? error.message) : String(error));
  process.exit(1);
}
