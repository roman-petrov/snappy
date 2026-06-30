import type { AiChatModel } from "./core-model";

const prompt = async (model: AiChatModel, { prompt: text, url }: { prompt: string; url: string }) =>
  (
    await model
      .completions({
        messages: [
          {
            content: [
              { text, type: `text` },
              { type: `image`, url },
            ],
            role: `user`,
          },
        ],
      })
      .assistant()
  ).content;

export const AiVision = { prompt };
