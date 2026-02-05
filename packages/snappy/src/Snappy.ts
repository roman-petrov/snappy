/* eslint-disable functional/no-promise-reject */
// cspell:words PERS
// eslint-disable-next-line @typescript-eslint/naming-convention -- GigaChat is the product/brand name
import GigaChat from "gigachat";
import { Agent } from "node:https";

import { type FeatureType, Prompts } from "./prompts";

export type SnappyOptions = { gigaChatAuthKey: string };

export const Snappy = ({ gigaChatAuthKey }: SnappyOptions) => {
  const client = new GigaChat({
    credentials: gigaChatAuthKey,
    httpsAgent: new Agent({ rejectUnauthorized: false }),
    model: `GigaChat`,
    scope: `GIGACHAT_API_PERS`,
    timeout: 600,
  });

  const processText = async (text: string, feature: FeatureType) => {
    const prompt = Prompts.systemPrompt(feature);

    const { choices } = await client.chat({
      messages: [
        { content: prompt, role: `system` },
        { content: text, role: `user` },
      ],
      repetitionPenalty: 1,
    });

    const [firstChoice] = choices;
    if (firstChoice === undefined) {
      throw new Error(`No response from GigaChat`);
    }
    const { message } = firstChoice;
    const { content } = message;
    if (content === undefined || content === ``) {
      throw new Error(`No response from GigaChat`);
    }

    return content.trim();
  };

  return { processText };
};

export type Snappy = ReturnType<typeof Snappy>;
