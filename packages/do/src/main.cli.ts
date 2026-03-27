#!/usr/bin/env bun
/* eslint-disable functional/no-expression-statements */
import { Console } from "@snappy/node";

import { Runner } from "./Runner";
import { Scripts } from "./Scripts";

const [, , name] = process.argv;

if (name === undefined || name === `` || name === `--help` || name === `-h`) {
  Console.log(`Usage: do <command>\n\nCommands:\n${Runner.formatCommandsHelp()}\n`);
  process.exit(0);
}

const root = Scripts.rootDir();
const resolved = Runner.resolveCommand(name);

if (!resolved.ok) {
  Console.errorLine(resolved.error);
  process.exit(1);
}

process.exit((await Runner.run(root, resolved.name)).exitCode);
