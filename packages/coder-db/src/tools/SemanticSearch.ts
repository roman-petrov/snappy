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
    description: [
      [`goal`, `Find relevant code by meaning, not exact words.`],
      [
        `when_to_use`,
        `Use this for high-level questions ("how this works", "where behavior is implemented", "repo overview"), cross-cutting flows across multiple files, or when symbol names are unknown.`,
      ],
      [
        `ranking`,
        `Results are ranked best-first: item #1 is usually the strongest hit, later items are progressively weaker.`,
      ],
      [
        `distance`,
        `The shown distance is an ANN distance signal (lower is generally better), but final rank is a combined ranking and not distance-only.`,
      ],
      [
        `query_rules`,
        `Ask a full natural-language question (not keywords), include target behavior and execution context (where/when/in which layer), and include constraints or comparison intent when relevant. Prefer complete intent-focused queries over short keyword fragments.`,
      ],
    ],
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

      return result.kind === `no_index`
        ? `No vector index loaded. Run: coder index`
        : result.kind === `no_results`
          ? `No results for query.`
          : result.hits
              .map(
                (hit, index) =>
                  `${String(index + 1)}. ${hit.path}:${String(hit.startLine)}-${String(hit.endLine)} (distance ${String(hit.distance ?? 0)})\n${hit.text.slice(0, Constants.search.snippetMaxChars)}`,
              )
              .join(`\n\n---\n\n`);
    },
    schema: z.object({
      query: z
        .string()
        .min(1)
        .describe(
          `Natural-language question about intent or behavior. Write a specific, context-rich query with domain + action + scope (where/when). Good: "Where is request authorization validated before handler execution?", "How is search ranking adjusted between source code and documentation?". Bad: "authorization", "ranking".`,
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
