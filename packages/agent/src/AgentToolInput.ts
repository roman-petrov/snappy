/* eslint-disable functional/no-try-statements */
import { z } from "zod";

const json = (argumentsJson: string): { error: string; ok: false } | { ok: true; value: unknown } => {
  const trimmed = argumentsJson.trim();
  if (trimmed === ``) {
    return { ok: true, value: {} };
  }
  try {
    return { ok: true, value: JSON.parse(trimmed) as unknown };
  } catch {
    return { error: `Invalid tool arguments: malformed JSON`, ok: false };
  }
};

const parse = <TSchema extends z.ZodType>(
  argumentsJson: string,
  schema: TSchema,
): { data: z.infer<TSchema>; ok: true } | { error: string; ok: false } => {
  const jsonResult = json(argumentsJson);
  if (!jsonResult.ok) {
    return jsonResult;
  }
  const result = schema.safeParse(jsonResult.value);

  return result.success
    ? { data: result.data, ok: true }
    : { error: `Invalid tool arguments: ${z.prettifyError(result.error)}`, ok: false };
};

export const AgentToolInput = { parse };
