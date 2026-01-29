import gigaChatClient from "gigachat";
import { Agent } from "node:https";

import { config } from "../config";
import { type FeatureType, getSystemPrompt } from "../prompts";

const httpsAgent = new Agent({ rejectUnauthorized: false });

const client = new gigaChatClient({
  credentials: config.GIGACHAT_AUTH_KEY,
  httpsAgent,
  model: `GigaChat`,
  scope: config.GIGACHAT_SCOPE,
  timeout: 600,
});

export const gigaChatService = {
  processText: async (text: string, feature: FeatureType): Promise<string> => {
    const systemPrompt = getSystemPrompt(feature);

    const resp = await client.chat({
      messages: [
        { content: systemPrompt, role: `system` },
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

