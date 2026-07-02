import type { AiChatModel } from "./core-model";
import type { AiChatCompletionSession, AiChatMessage } from "./Types";

type VisionInput = { prompt: string; system?: string; url: string };

const completions = (model: AiChatModel, { prompt: text, system, url }: VisionInput): AiChatCompletionSession => {
  const messages: AiChatMessage[] = [
    ...(system === undefined ? [] : [{ content: system, role: `system` as const }]),
    {
      content: [
        { text, type: `text` },
        { type: `image`, url },
      ],
      role: `user`,
    },
  ];

  return model.completions({ messages });
};

const prompt = async (model: AiChatModel, input: VisionInput) => (await completions(model, input).assistant()).content;

export const AiVision = { completions, prompt };
