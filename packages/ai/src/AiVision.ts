import type { AiChatModel } from "./core-model";
import type { AiChatCompletionSession } from "./Types";

type VisionInput = { prompt: string; url: string };

const completions = (model: AiChatModel, { prompt: text, url }: VisionInput): AiChatCompletionSession =>
  model.completions({
    messages: [
      {
        content: [
          { text, type: `text` },
          { type: `image`, url },
        ],
        role: `user`,
      },
    ],
  });

const prompt = async (model: AiChatModel, input: VisionInput) => (await completions(model, input).assistant()).content;

export const AiVision = { completions, prompt };
