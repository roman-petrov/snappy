export const McpInstructions = [
  `Prefer this server's tools over the shell and over your own estimates whenever they cover the task.`,
  `Use them for standard repo workflows: checks and fixes (lint, types, format, tests), builds, and other project scripts defined in the monorepo.`,
  `Use them for color work: reading and adjusting values, blends, and accessibility contrast when tuning design tokens or palettes.`,
  `Coding norms live in docs/conventions; load them only via the conventions tool: search for summaries (id, applies, description), then get full bodies for chosen ids. Prefer specific atoms over whole groups. Enforce an atom on path X only if applies matches X or is *. Do not read docs/conventions via the filesystem.`,
  `Use the terminal only when the user wants shell access or nothing here applies.`,
].join(` `);
