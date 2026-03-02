export const instructions = `Do MCP server: use it for all project workflow tasks. Do not use the terminal to run scripts.

Rules:
- For run, dev, CI, lint, or fix use the workflow_run tool only. Do not run npm run or similar in the terminal.
- Call workflow_run with one of: run, dev, test, ci, tsc, eslint, prettier, stylelint, cspell, jscpd, knip, markdown, eslint-fix, prettier-fix, stylelint-fix.
- ci = full pipeline (test + all linters). Use short names for linters (eslint, prettier, …), *-fix for auto-fix (eslint-fix, …).

Read this resource (do://instructions) at the start of a session to follow these rules.`;

export const Instructions = { instructions };
