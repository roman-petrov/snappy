import { Json } from "@snappy/core";
import { z } from "zod";

import type { AgentTool, ToolRun } from "../Types";

const argsSchema = z.object({ prompt: z.string() }).strict();

const run: ToolRun = async (context, { args }) => {
  const parsed = argsSchema.safeParse(args);
  if (!parsed.success) {
    return { content: Json.stringify({ error: `invalid_args` }), kind: `tool_message` };
  }

  const content = await context
    .generatePng(parsed.data.prompt)
    .then(async png => context.persistPng(png))
    .catch(() => undefined);

  if (content === undefined) {
    return { content: Json.stringify({ error: `image_failed` }), kind: `tool_message` };
  }

  return { content, kind: `tool_message` };
};

export const generateImage: AgentTool = {
  apiDescription: `Generate a PNG image from a text prompt on the server.`,
  argsSchema,
  name: `generate_image`,
  run,
  systemPrompt: [
    `### generate_image (server)`,
    `Argument: { "prompt": "<description>" }. The backend renders a PNG and returns a file reference in the tool result.`,
  ].join(`\n`),
};
