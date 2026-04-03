import type { AgentTool } from "@snappy/agent";

import { z } from "zod";

import { ToolCommon } from "../ToolCommon";

const argsSchema = z.object({ image_base64: z.string().describe(`Raw base64 PNG bytes, no data URL prefix`) }).strict();

const run = ToolCommon.withParsedArgs(argsSchema, `invalid_args`, (data, toolCallId) => ({
  args: { image_base64: data.image_base64 },
  kind: `pending_client_tool`,
  toolCallId,
}));

export const vectorizeImage: AgentTool = {
  apiDescription: `Request client-side vectorization of a PNG to SVG. Pass raw base64 PNG.`,
  argsSchema,
  name: `vectorize_image`,
  run,
  systemPrompt: [
    `### vectorize_image (runs on the client)`,
    `The model passes { "image_base64": "<raw base64 png>" }. The server does not run vectorization: it returns pendingClientTool to the app, the browser traces the image to SVG, and the SVG string is sent back as the next tool message.`,
    `Use after generate_image when you need SVG output, or when the user supplied a raster to trace.`,
  ].join(`\n`),
};
