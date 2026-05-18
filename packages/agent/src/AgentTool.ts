import type { AiToolRunResult } from "@snappy/ai";
import type { Locale } from "@snappy/intl";
import type { z } from "zod";

import { _, StructuredPrompt } from "@snappy/core";

export type AgentTool<TSchema extends z.ZodType = z.ZodType> = {
  description: string;
  execute: (args: z.infer<TSchema>) => Promise<AgentToolRunResult>;
  formatCall?: (args: z.infer<TSchema>, status: AgentToolCallStatus, locale: Locale) => string;
  inputSchema: TSchema;
};

export type AgentToolCallStatus = `completed` | `running`;

export type AgentToolGroup = Record<string, AgentTool>;

export type AgentToolRunResult = AiToolRunResult;

export const AgentTool = <TSchema extends z.ZodType>({
  description,
  execute,
  formatCall,
  inputSchema,
}: {
  description: string | StructuredPrompt;
  execute: (args: z.infer<TSchema>) => Promise<AgentToolRunResult>;
  formatCall?: (args: z.infer<TSchema>, status: AgentToolCallStatus, locale: Locale) => string;
  inputSchema: TSchema;
}): AgentTool<TSchema> => ({
  description: _.isString(description) ? description : StructuredPrompt(description),
  execute,
  inputSchema,
  ...(formatCall === undefined ? {} : { formatCall }),
});
