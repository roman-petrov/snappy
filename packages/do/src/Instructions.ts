export const INSTRUCTIONS = `Do MCP server: use it for all project workflow tasks. Do not use the terminal to run scripts.

Rules:
- For run, dev, CI, lint, or fix use the workflow_run tool only. Do not run bun run, npm run, or similar in the terminal.
- Call workflow_run with one of: run, dev, test, ci, lint:tsc, lint:eslint, lint:prettier, lint:cspell, lint:jscpd, lint:markdown, fix:eslint, fix:prettier.
- For run or dev pass package (allowed values are listed in workflow_run tool schema).
- ci = full pipeline (test + all linters). Use lint:* for individual checks, fix:* to auto-fix.

Read this resource (do://instructions) at the start of a session to follow these rules.`;

const instructions = (): string => INSTRUCTIONS;

export const Instructions = { instructions };
