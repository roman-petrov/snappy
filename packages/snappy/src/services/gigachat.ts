import GigaChat from "gigachat";
import { Agent } from "node:https";

import type { FeatureType } from "../prompts/index";

import { config } from "../config";
import { getSystemPrompt } from "../prompts/index";

const httpsAgent = new Agent({ rejectUnauthorized: false });

const client = new GigaChat({
  credentials: config.GIGACHAT_AUTH_KEY.trim().replace(/\s+/g, ``),
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
      repetition_penalty: 1,
    });

    const content = resp.choices[0]?.message?.content;
    if (content == null || content === ``) {
      throw new Error(`No response from GigaChat`);
    }

    return content.trim();
  },
};
