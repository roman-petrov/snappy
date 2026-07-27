/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable functional/no-expression-statements */
import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { Bilingual } from "@snappy/intl";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

import { System } from "../System";

export const WebSearchTool: SnappyToolFactory = ({ config, feed, isStopped, locale }) => {
  if (config.models.chat.capabilities.webSearch === true) {
    return undefined;
  }

  const { contextSize, maxResults, maxUses } = AiConstants.defaults.webSearch;

  return AgentTool({
    description: [
      [
        `when`,
        `Use when you need current or external facts from the web: news, prices, docs, product info, or anything outside this chat.`,
      ],
      [
        `input`,
        `Pass a focused natural-language search query. Optionally override search budget (results, uses, context size); defaults apply if omitted.`,
      ],
      [
        `output`,
        `Streams a readable answer with markdown source links into the chat, then returns the same text. After that, do not restate the findings at length — only a short orientation, next step, or publish when needed.`,
      ],
    ],
    execute: async input => {
      if (isStopped()) {
        return ``;
      }

      const session = config.models.webSearch.completions({
        messages: [
          {
            content: `${System.language(locale)}

Search the web for the user query. Reply with concise facts and markdown links to sources. Do not invent URLs. Do not mention the search provider.`,
            role: `system`,
          },
          { content: input.query, role: `user` },
        ],
        webSearch: { contextSize: input.contextSize, maxResults: input.maxResults, maxUses: input.maxUses },
      });
      await feed.appendDetailStream({
        completed: Bilingual.pick(locale, [
          `Found web results: "${input.query}"`,
          `Нашёл в интернете: "${input.query}"`,
        ]),
        running: Bilingual.pick(locale, [`Searching the web: "${input.query}"`, `Ищу в интернете: "${input.query}"`]),
        stream: session.chatText(isStopped),
      });

      return isStopped() ? `` : (await session.assistant()).content;
    },
    inputSchema: z.object({
      contextSize: z
        .enum([`high`, `low`, `medium`])
        .default(contextSize)
        .describe(`How much page text to pull per result: low, medium, or high. Default: ${contextSize}.`),
      maxResults: z
        .number()
        .int()
        .min(1)
        .max(25)
        .default(maxResults)
        .describe(`Max results per search call (1–25). Default: ${maxResults}.`),
      maxUses: z
        .number()
        .int()
        .min(1)
        .max(5)
        .default(maxUses)
        .describe(`Max search calls for this request (1–5). Default: ${maxUses}.`),
      query: z
        .string()
        .min(1)
        .describe(`Natural-language web search query. Be specific about topic, time, and locale when relevant.`),
    }),
  });
};
