/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
import { AgentTool } from "@snappy/agent";
import { DataUrl } from "@snappy/browser";
import { StaticFormPlanSchema } from "@snappy/snappy-sdk";

import type { SnappyToolFactory } from "../SnappyTypes";

export const AskTool: SnappyToolFactory = ({ feed, files, isStopped, media }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when critical requirements are missing or ambiguous and you need structured user clarification before continuing.`,
      ],
      [
        `input`,
        `Pass a clarification form plan (optional title + fields). Include file_input for images or audio when needed. File answers return field ids — pass those ids to look_image, edit_image, or transcribe_audio.`,
      ],
      [`output`, `Returns structured answers as JSON. Use look_image with returned ids to inspect uploaded images.`],
    ],
    execute: async plan => {
      if (isStopped()) {
        return ``;
      }
      const formAnswers = await feed.ask(plan);
      if (isStopped()) {
        return ``;
      }

      const answers: Record<string, unknown> = {};
      const context: { type: `image`; url: string }[] = [];

      for (const field of plan.fields) {
        if (field.kind === `file_input`) {
          const raw: unknown = formAnswers[field.id];
          if (raw instanceof File) {
            files[field.id] = raw;
            answers[field.id] = field.id;
            if (raw.type.startsWith(`image/`)) {
              const url = await DataUrl.blob(raw);
              media[field.id] = url;
              context.push({ type: `image`, url });
            }
          } else {
            answers[field.id] = undefined;
          }
        } else {
          answers[field.id] = formAnswers[field.id];
        }
      }

      const tool = JSON.stringify({ answers }, undefined, 2);

      return context.length === 0 ? tool : { context, tool };
    },
    inputSchema: StaticFormPlanSchema,
  });
