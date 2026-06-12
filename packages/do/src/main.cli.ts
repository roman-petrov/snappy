#!/usr/bin/env bun
/* eslint-disable functional/no-expression-statements */
import { Console } from "@snappy/node";

import { Runner } from "./Runner";

const [, , name] = process.argv;

if (name === undefined || [`--help`, `-h`, ``].includes(name)) {
  Console.log(`Usage: do <command>\n\nCommands:\n${Runner.formatCommandsHelp()}\n`);
  process.exit(0);
}

const resolved = Runner.resolveCommand(name);

if (!resolved.ok) {
  Console.errorLine(resolved.error);
  process.exit(1);
}

process.exit((await Runner.run(Runner.repoRoot, resolved.name)).exitCode);
