/* eslint-disable @typescript-eslint/require-await */
import type { ToolRun, ToolRunResult } from "@snappy/agent";
import type { z } from "zod";

import { Json } from "@snappy/core";

const withParsedArgs =
  <S extends z.ZodType>(
    schema: S,
    errorCode: string,
    next: (data: z.infer<S>, toolCallId: string) => ToolRunResult,
  ): ToolRun =>
  async (_context, { args, toolCallId }) => {
    const parsed = schema.safeParse(args);

    return parsed.success
      ? next(parsed.data, toolCallId)
      : { content: Json.stringify({ error: errorCode }), kind: `tool_message` };
  };

export const ToolCommon = { withParsedArgs };
