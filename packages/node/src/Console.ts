import { Emoji } from "./Emoji";

const githubCi = process.env[`GITHUB_ACTIONS`] === `true`;
const windows = process.platform === `win32`;
const vscodeTerminal = process.env[`TERM_PROGRAM`] === `vscode`;
const shouldFix = windows && vscodeTerminal && !githubCi;
const normalize = (text: string) => (shouldFix ? Emoji.fix(text) : text);
const log = (text: string) => process.stdout.write(normalize(text));
const logLine = (text: string) => log(`${text}\n`);
const error = (text: string) => process.stderr.write(normalize(text));
const errorLine = (text: string) => error(`${text}\n`);

export const Console = { error, errorLine, log, logLine };
