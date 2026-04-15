/* eslint-disable functional/no-promise-reject */
import type { OpenAI } from "openai";

import type { AiGenericChatModel } from "../Types";

export type OpenAiChatModelDefinition = { cost: (promptTok: number, completionTok: number) => number; name: string };

export const OpenAiChatModel =
  ({ cost, name }: OpenAiChatModelDefinition) =>
  (client: OpenAI): AiGenericChatModel => {
    const process: AiGenericChatModel[`process`] = async prompt => {
      const completionResponse = await client.chat.completions.create({
        messages: [{ content: prompt, role: `user` }],
        model: name,
      });

      const [choice] = completionResponse.choices;
      if (choice === undefined) {
        throw new Error(`openai_chat_invalid`);
      }

      const {
        message: { content },
      } = choice;

      const { completion_tokens: completionTok = 0, prompt_tokens: promptTok = 0 } = completionResponse.usage ?? {};
      const costValue = cost(promptTok, completionTok);

      return { cost: costValue, text: content ?? `` };
    };

    return { name, process, type: `chat` };
  };
