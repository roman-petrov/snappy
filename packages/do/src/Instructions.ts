export const instructions = `Do MCP server runs the Snappy project workflow.

How to work:
- Use workflow_run for every project script. Do not run bun/npm scripts in the terminal.
- The script parameter must be a name from the tool schema. Each name has a short description there — pick by task, do not guess names.
- Prefer the smallest command that matches the goal (e.g. eslint after TS edits). Use ci when you need the full check before finishing work.
- Names ending in -fix apply auto-fixes; the same name without -fix only reports problems.
- Parent commands run several steps in order (e.g. lint, build). If a step fails, fix it and re-run; read the tool output.

Read do://instructions at the start of a session.`;

export const Instructions = { instructions };
