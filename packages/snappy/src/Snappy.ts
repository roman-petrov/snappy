/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/naming-convention */
// cspell:words PERS
import GigaChat from "gigachat";
import { Agent } from "node:https";

export type SnappyOptions = { gigaChatAuthKey: string };

export const Snappy = ({ gigaChatAuthKey }: SnappyOptions) => {
  const client = new GigaChat({
    credentials: gigaChatAuthKey,
    httpsAgent: new Agent({ rejectUnauthorized: false }),
    model: `GigaChat`,
    scope: `GIGACHAT_API_PERS`,
    timeout: 600,
  });

  const processText = async (text: string, systemPrompt: string) => {
    const { choices } = await client.chat({
      messages: [
        { content: systemPrompt, role: `system` },
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
