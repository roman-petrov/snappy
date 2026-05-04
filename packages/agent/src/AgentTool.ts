import type { StructuredPrompt } from "@snappy/core";
import type { z } from "zod";

import type { AgentLocale } from "./Types";

export type AgentTool<TSchema extends z.ZodType = z.ZodType> = {
  description: string | StructuredPrompt;
  formatCall?: (args: z.infer<TSchema>, status: AgentToolCallStatus, locale: AgentLocale) => string;
  run: (args: z.infer<TSchema>) => Promise<AgentToolRunResult>;
  schema: TSchema;
};

export type AgentToolCallStatus = `completed` | `running`;

export type AgentToolGroup = Record<string, AgentTool>;

export type AgentToolRunResult = string | { error: string };

export const AgentTool = <TSchema extends z.ZodType>(tool: AgentTool<TSchema>): AgentTool<TSchema> => tool;
