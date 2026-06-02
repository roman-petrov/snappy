import { Unicode } from "@snappy/core";

import { Emoji } from "./Emoji";

const githubCi = process.env[`GITHUB_ACTIONS`] === `true`;
const windows = process.platform === `win32`;
const vscodeTerminal = process.env[`TERM_PROGRAM`] === `vscode`;
const shouldFix = windows && vscodeTerminal && !githubCi;
const ansi = new RegExp(String.raw`${Unicode.escape}\[[0-9;]*m`, `gu`);
const normalize = (text: string) => (shouldFix ? Emoji.fix(text) : text);
const stripAnsi = (text: string) => text.replaceAll(ansi, ``);
const log = (text: string) => process.stdout.write(normalize(text));
const logLine = (text: string) => log(`${text}\n`);
const error = (text: string) => process.stderr.write(normalize(text));
const errorLine = (text: string) => error(`${text}\n`);

export const Console = { error, errorLine, log, logLine, stripAnsi };
