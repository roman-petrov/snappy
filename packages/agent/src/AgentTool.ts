import type { z } from "zod";

export type AgentTool<TSchema extends z.ZodType = z.ZodType> = {
  description: string;
  formatCall: (args: z.infer<TSchema>, status: AgentToolCallStatus, locale: string) => string;
  run: (args: z.infer<TSchema>) => Promise<AgentToolRunResult>;
  schema: TSchema;
};

export type AgentToolCallStatus = `completed` | `running`;

export type AgentToolGroup = Record<string, AgentTool>;

export type AgentToolRunResult = string | { error: string };

export const AgentTool = <TSchema extends z.ZodType>(tool: AgentTool<TSchema>): AgentTool<TSchema> => tool;
