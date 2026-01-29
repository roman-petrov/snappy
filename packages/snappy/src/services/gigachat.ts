import GigaChat from "gigachat";
import { Agent } from "node:https";
import type { FeatureType } from "../prompts/index";
import { getSystemPrompt } from "../prompts/index";
import { config } from "../config";

const httpsAgent = new Agent({ rejectUnauthorized: false });

const client = new GigaChat({
  credentials: config.GIGACHAT_AUTH_KEY.trim().replace(/\s+/g, ``),
  scope: config.GIGACHAT_SCOPE,
  model: `GigaChat`,
  timeout: 600,
  httpsAgent,
});

export const gigaChatService = {
  processText: async (text: string, feature: FeatureType): Promise<string> => {
    const systemPrompt = getSystemPrompt(feature);

    const resp = await client.chat({
      messages: [
        { role: `system`, content: systemPrompt },
        { role: `user`, content: text },
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
