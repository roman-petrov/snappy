/* eslint-disable regexp/unicode-escape */
/* eslint-disable regexp/no-control-character */
/* eslint-disable regexp/letter-case */
/* eslint-disable regexp/hexadecimal-escape */
/* eslint-disable no-control-regex */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
const githubCi = process.env[`GITHUB_ACTIONS`] === `true`;
const windows = process.platform === `win32`;
const vscodeTerminal = process.env[`TERM_PROGRAM`] === `vscode`;
const buggyEmoji = [`🖥️`, `⚙️`, `🗄️`, `⬇️`, `🛡️`, `▶️`];
const shouldFix = windows && vscodeTerminal && !githubCi;
const ansi = /\u001B\[[0-9;]*m/gu;

const fixEmoji = (text: string) => {
  let result = text;
  for (const emoji of buggyEmoji) {
    const adjacentText = new RegExp(String.raw`${emoji}(?=[\p{L}\p{N}])`, `gu`);
    const singleSpaceText = new RegExp(String.raw`${emoji} (?=[\p{L}\p{N}])`, `gu`);
    result = result.replaceAll(adjacentText, `${emoji} `).replaceAll(singleSpaceText, `${emoji}  `);
  }

  return result;
};

const normalize = (text: string) => (shouldFix ? fixEmoji(text) : text);
const stripAnsi = (text: string) => text.replaceAll(ansi, ``);
const log = (text: string) => process.stdout.write(normalize(text));
const logLine = (text: string) => log(`${text}\n`);
const error = (text: string) => process.stderr.write(normalize(text));
const errorLine = (text: string) => error(`${text}\n`);

export const Console = { error, errorLine, log, logLine, stripAnsi };
