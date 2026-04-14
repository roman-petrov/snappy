import { z } from "zod";

const glob = (maxChars: number) =>
  z
    .string()
    .min(1)
    .max(maxChars)
    .describe(`Glob pattern relative to workspace root. You can pass a concrete file path too.`);

export const ToolSchema = { glob };
