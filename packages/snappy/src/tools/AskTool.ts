/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { AiContentPart } from "@snappy/ai";

import { AgentTool } from "@snappy/agent";
import { _, Mime } from "@snappy/core";

import type { SnappyToolFactory } from "../SnappyTypes";

import { StaticFormPlanSchema } from "../Schema";

export const AskTool: SnappyToolFactory = ({ feed, files, isStopped, media }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when critical requirements are missing or ambiguous and you need structured user clarification before continuing.`,
      ],
      [
        `input`,
        `Pass a clarification form plan (optional title + fields). Use image_input or audio_input when a file is needed.`,
      ],
      [
        `output`,
        `Returns structured answers as JSON. Uploaded files follow in the next user message, labeled by field id.`,
      ],
    ],
    execute: async plan => {
      if (isStopped()) {
        return ``;
      }
      const formAnswers = await feed.ask(plan);
      if (isStopped()) {
        return ``;
      }

      type FieldAttachment = { answer: unknown; attachment: readonly AiContentPart[]; file?: File; url?: string };

      const attachments = await Promise.all(
        plan.fields.map(async (field): Promise<readonly [string, FieldAttachment]> => {
          if (field.kind === `image_input` || field.kind === `audio_input`) {
            const raw = formAnswers[field.id];
            if (!(raw instanceof File)) {
              return [field.id, { answer: undefined, attachment: [] }];
            }

            const { id, kind, label } = field;
            const { name, size } = raw;
            const sizeLabel = _.byteSize(size);
            const image = kind === `image_input`;
            const heading = `Field ${id} (${label.text})`;

            const text: AiContentPart = {
              text: `${heading}: ${image ? `image` : `audio`} "${name === `` ? `unnamed` : name}" (${sizeLabel}), id "${id}".`,
              type: `text`,
            };

            if (!image) {
              return [id, { answer: id, attachment: [text], file: raw }];
            }

            const url = await Mime.blob(raw);

            return [id, { answer: id, attachment: [text, { type: `image`, url }], file: raw, url }];
          }

          return [field.id, { answer: formAnswers[field.id], attachment: [] }];
        }),
      );

      const assign = <T>(target: Record<string, T>, pick: (item: FieldAttachment) => T | undefined) =>
        Object.assign(
          target,
          _.fromEntries(
            attachments.flatMap(([id, item]) => {
              const value = pick(item);

              return value === undefined ? [] : [[id, value]];
            }),
          ),
        );

      assign(files, item => item.file);
      assign(media, item => item.url);

      const answers = _.fromEntries(attachments.map(([id, item]) => [id, item.answer]));
      const attachmentParts = attachments.flatMap(([, item]) => item.attachment);

      const context: AiContentPart[] =
        attachmentParts.length === 0
          ? []
          : [
              {
                text: plan.title === undefined ? `Form attachments:` : `Form "${plan.title}" attachments:`,
                type: `text`,
              },
              ...attachmentParts,
            ];

      const tool = JSON.stringify({ answers }, undefined, 2);

      return context.length === 0 ? tool : { context, tool };
    },
    inputSchema: StaticFormPlanSchema,
  });
