import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { VectorSearchRow } from "../core/VectorStore";

import { Constants } from "../Constants";

export type SemanticSearchConfig = { search: SemanticSearchFunction };

export type SemanticSearchFunction = (args: { query: string; topK?: number }) => Promise<SemanticSearchResult>;

export type SemanticSearchHit = VectorSearchRow;

export type SemanticSearchResult =
  | { hits: SemanticSearchHit[]; kind: `hits` }
  | { kind: `no_index` }
  | { kind: `no_results` };

export const SemanticSearch = ({ search }: SemanticSearchConfig) =>
  AgentTool({
    description: `Find relevant code by meaning, not exact words. Use this for high-level questions ("how this works", "where behavior is implemented", "repo overview"), cross-cutting flows across multiple files, or when symbol names are unknown.`,
    formatCall: ({ query }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Ищу по смыслу: "${query}"`
          : `Завершил поиск по смыслу: "${query}"`
        : status === `running`
          ? `Searching semantic: "${query}"`
          : `Searched semantic: "${query}"`,
    run: async ({ query, topK }) => {
      const result = await search({ query, topK: topK ?? Constants.search.defaultK });
      if (result.kind === `no_index`) {
        return `No vector index loaded. Run: coder index`;
      }
      if (result.kind === `no_results`) {
        return `No results for query.`;
      }

      const lines = result.hits.map(
        (hit, index) =>
          `${String(index + 1)}. ${hit.path}:${String(hit.startLine)}-${String(hit.endLine)} (distance ${String(hit.distance ?? 0)})\n${hit.text.slice(0, Constants.search.snippetMaxChars)}`,
      );

      return lines.join(`\n\n---\n\n`);
    },
    schema: z.object({
      query: z
        .string()
        .min(1)
        .describe(
          `Natural-language question about intent or behavior. Prefer concrete queries like "How does auth session validation work?" over isolated keywords.`,
        ),
      topK: z
        .number()
        .int()
        .min(1)
        .max(Constants.search.maxK)
        .optional()
        .describe(`Maximum number of results to return. Uses default when omitted.`),
    }),
  });
