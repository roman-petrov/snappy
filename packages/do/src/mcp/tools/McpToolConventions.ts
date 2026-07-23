/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
/* eslint-disable require-atomic-updates */
import { File } from "@snappy/node";
import { globby } from "globby";
import { minimatch } from "minimatch";
import path from "node:path";
import { z } from "zod";

import type { McpTool } from "../Types";

type AtomSummary = { applies: string; description: string; emoji: string; id: string };

type IndexedAtom = AtomSummary & { filePath: string };

export const McpToolConventions: McpTool = (server, { root }) => {
  let cached: IndexedAtom[] | undefined;

  const searchSchema = z.object({
    action: z.literal(`search`).describe(`List atom summaries (id, applies, description). Do not load full bodies.`),
    group: z.string().optional().describe(`Filter by group prefix (e.g. typescript, react).`),
    path: z
      .string()
      .optional()
      .describe(`Repo-relative or absolute file path; keep atoms whose applies matches (or *).`),
    query: z.string().optional().describe(`Case-insensitive substring match on id and description.`),
  });

  const getSchema = z.object({
    action: z.literal(`get`).describe(`Load full markdown for selected atom ids only.`),
    ids: z.array(z.string()).min(1).describe(`Atom ids from search (e.g. typescript/barrels).`),
  });

  const inputSchema = z.discriminatedUnion(`action`, [searchSchema, getSchema]);

  const loadIndex = async () => {
    if (cached !== undefined) {
      return cached;
    }

    const conventionsDir = path.join(root, `docs`, `conventions`);

    const parseHeader = (text: string): AtomSummary | undefined => {
      const field = (name: string, valuePattern: string) => {
        const match = new RegExp(String.raw`\*\*${name}:\*\*\s+${valuePattern}`, `u`).exec(text);

        return match?.groups?.[`value`];
      };

      const h1 = /^#\s+(?<title>\S.*)$/mu.exec(text)?.groups?.[`title`]?.trim();

      if (h1 === undefined) {
        return undefined;
      }
      const id = field(`id`, String.raw`\x60(?<value>[^\x60]+)\x60`);

      if (id === undefined) {
        return undefined;
      }
      const emoji = field(`emoji`, String.raw`(?<value>\S+)`);

      if (emoji === undefined) {
        return undefined;
      }
      const applies = field(`applies`, String.raw`\x60(?<value>[^\x60]+)\x60`);

      if (applies === undefined) {
        return undefined;
      }

      const description = h1.startsWith(emoji) ? h1.slice(emoji.length).trimStart() : h1.replace(/^\S+\s+/u, ``);

      return { applies, description, emoji, id };
    };

    const relativePaths = await globby(`**/*.md`, { cwd: conventionsDir, ignore: [`README.md`], onlyFiles: true });

    const atoms = (
      await Promise.all(
        relativePaths.map(async relativePath => {
          const filePath = path.join(conventionsDir, relativePath);
          const summary = parseHeader(await File.async.read(filePath));

          return summary === undefined ? undefined : { ...summary, filePath };
        }),
      )
    ).filter(atom => atom !== undefined);

    cached = atoms;

    return atoms;
  };

  const search = async ({ group, path: filePath, query }: z.infer<typeof searchSchema>) => {
    const atoms = await loadIndex();

    const normalizedPath =
      filePath === undefined
        ? undefined
        : path
            .relative(root, path.isAbsolute(filePath) ? filePath : path.resolve(root, filePath))
            .split(path.sep)
            .join(`/`);

    const needle = query?.trim().toLowerCase();

    const matched = atoms
      .filter(
        ({ applies, description, id }) =>
          (group === undefined || id === group || id.startsWith(`${group}/`)) &&
          (normalizedPath === undefined || applies === `*` || minimatch(normalizedPath, applies, { dot: true })) &&
          (needle === undefined ||
            needle === `` ||
            id.toLowerCase().includes(needle) ||
            description.toLowerCase().includes(needle)),
      )
      .map(({ applies, description, emoji, id }) => ({ applies, description, emoji, id }));

    return { atoms: matched, ok: true as const };
  };

  const get = async (ids: string[]) => {
    const atoms = await loadIndex();
    const byId = new Map(atoms.map(atom => [atom.id, atom]));

    const found = (
      await Promise.all(
        ids.map(async id => {
          const atom = byId.get(id);

          if (atom === undefined) {
            return undefined;
          }

          return { content: await File.async.read(atom.filePath), id };
        }),
      )
    ).filter(atom => atom !== undefined);

    const missing = ids.filter(id => !byId.has(id));

    return missing.length === 0 ? { atoms: found, ok: true as const } : { atoms: found, missing, ok: false as const };
  };

  server.registerTool(
    `conventions`,
    {
      description: [
        `Load coding conventions from docs/conventions with progressive disclosure.`,
        `Protocol: (1) search for summaries by query/path/group; (2) pick relevant ids; (3) get full atom bodies.`,
        `Prefer specific atoms over whole groups. Do not read docs/conventions via filesystem tools when this tool is available.`,
        `Enforce an atom on file path X only if its applies matches X or applies is *.`,
      ].join(` `),
      inputSchema,
    },
    async (input: z.infer<typeof inputSchema>) => {
      const payload = input.action === `search` ? await search(input) : await get(input.ids);
      const content = [{ text: JSON.stringify(payload, undefined, 2), type: `text` as const }];

      return { content };
    },
  );
};
