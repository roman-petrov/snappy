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

export const McpToolConventions: McpTool = (server, { root }) => {
  type AtomSummary = { applies: string; description: string; emoji: string; id: string };

  type IndexedAtom = AtomSummary & { filePath: string };

  let cached: IndexedAtom[] | undefined;

  const inputSchema = z.object({
    action: z
      .enum([`search`, `get`])
      .describe(`search: list atom summaries (id, applies, description). get: load full markdown for ids.`),
    group: z
      .string()
      .optional()
      .describe(`Optional exact group id (first path segment of atom id). See groups in search response.`),
    ids: z
      .array(z.string())
      .min(1)
      .optional()
      .describe(`Required for get. Atom ids chosen from search (e.g. typescript/barrels).`),
    path: z
      .string()
      .optional()
      .describe(`Optional file or directory path; keep atoms whose applies matches that scope (or *).`),
  });

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

  const search = async ({ group, path: filePath }: Pick<z.infer<typeof inputSchema>, `group` | `path`>) => {
    const atoms = await loadIndex();

    const groups = [
      ...new Set(atoms.map(({ id }) => id.split(`/`)[0]).filter(segment => segment !== undefined)),
    ].toSorted((a, b) => a.localeCompare(b));

    if (group !== undefined && !groups.includes(group)) {
      return {
        atoms: [] as AtomSummary[],
        error: `Unknown group \`${group}\`. Available: ${groups.join(`, `)}.`,
        groups,
        ok: false as const,
      };
    }

    const normalizedPath =
      filePath === undefined
        ? undefined
        : path
            .relative(root, path.isAbsolute(filePath) ? filePath : path.resolve(root, filePath))
            .split(path.sep)
            .join(`/`);

    const matchOptions = { dot: true };

    const matched = atoms
      .filter(
        ({ applies, id }) =>
          (group === undefined || id === group || id.startsWith(`${group}/`)) &&
          (normalizedPath === undefined ||
            applies === `*` ||
            minimatch(normalizedPath, applies, matchOptions) ||
            (path.posix.extname(normalizedPath) === `` &&
              minimatch(normalizedPath, applies, { ...matchOptions, partial: true }))),
      )
      .map(({ applies, description, emoji, id }) => ({ applies, description, emoji, id }));

    return { atoms: matched, groups, ok: true as const };
  };

  const get = async (ids: string[]) => {
    const atoms = await loadIndex();
    const byId = new Map(atoms.map(atom => [atom.id, atom]));

    const found = (
      await Promise.all(
        ids.map(async id => {
          const atom = byId.get(id);

          return atom === undefined ? undefined : { content: await File.async.read(atom.filePath), id };
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
        `List and load coding convention atoms.`,
        `(1) search with optional path and/or group - returns summaries (id, applies, description) and available groups;`,
        `(2) pick relevant ids from that list; (3) get full markdown for those ids.`,
        `Browse the summary list; do not invent free-text queries.`,
        `Prefer specific atoms over whole groups.`,
        `Enforce an atom on file path X only if its applies matches X or applies is *.`,
      ].join(` `),
      inputSchema,
    },
    async (input: z.infer<typeof inputSchema>) => {
      const payload =
        input.action === `get`
          ? input.ids === undefined
            ? { error: `ids is required when action is get.`, ok: false as const }
            : await get(input.ids)
          : await search(input);

      const content = [{ text: JSON.stringify(payload, undefined, 2), type: `text` as const }];

      return { content };
    },
  );
};
