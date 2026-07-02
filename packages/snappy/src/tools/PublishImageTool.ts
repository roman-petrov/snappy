import { AgentTool } from "@snappy/agent";
import { ImageSize } from "@snappy/ai";

import type { SnappyToolFactory } from "../SnappyTypes";

import { ImageTool } from "../ImageTool";
import { ToolContext } from "../ToolContext";

export const PublishImageTool: SnappyToolFactory = ({
  config: {
    models: { image: model },
  },
  feed,
  isStopped,
  locale,
  media,
}) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when the user expects an image as the final result. Ask clarification first if key visual requirements are still unclear.`,
      ],
      [
        `input`,
        `Pass a self-contained prompt with required visual details and constraints. Set sizing fields only when the user requested dimensions or composition depends on them.`,
      ],
      [`output`, `Returns mediaId. The published image follows in the next user message.`],
    ],
    execute: async ({ prompt, ...fields }) =>
      isStopped()
        ? ``
        : ToolContext.publishImage({
            generate: feed.generateImage,
            input: { locale, model, prompt, ...ImageSize.request(model.imageConfigKind, fields) },
            isStopped,
            media,
          }),
    inputSchema: ImageTool.inputSchema(
      model,
      `Self-contained image prompt with all required visual details and constraints.`,
    ),
  });
