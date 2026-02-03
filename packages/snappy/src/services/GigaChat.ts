/* eslint-disable functional/no-promise-reject */
import gigaChatClient from "gigachat";
import { Agent } from "node:https";

import { AppConfiguration } from "../AppConfiguration";
import { Config } from "../Config";
import { type FeatureType, systemPrompt } from "../prompts";

const httpsAgent = new Agent({ rejectUnauthorized: false });

const client = new gigaChatClient({
  credentials: Config.GIGACHAT_AUTH_KEY,
  httpsAgent,
  model: `GigaChat`,
  scope: AppConfiguration.gigaChatScope,
  timeout: 600,
});

export const gigaChatService = {
  processText: async (text: string, feature: FeatureType) => {
    const prompt = systemPrompt(feature);

    const resp = await client.chat({
      messages: [
        { content: prompt, role: `system` },
        { content: text, role: `user` },
      ],
      repetitionPenalty: 1,
    });

    const [firstChoice] = resp.choices;
    if (firstChoice === undefined) {
      throw new Error(`No response from GigaChat`);
    }
    const { message } = firstChoice;
    const { content } = message;
    if (content === undefined || content === ``) {
      throw new Error(`No response from GigaChat`);
    }

    return content.trim();
  },
};
