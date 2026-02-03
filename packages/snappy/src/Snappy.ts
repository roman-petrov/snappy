/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-expression-statements */
import type { Agent } from "node:https";

// eslint-disable-next-line @typescript-eslint/naming-convention -- GigaChat is the product/brand name
import GigaChat from "gigachat";

import { type FeatureType, Prompts } from "./prompts";

const defaultTimeout = 600;

export type SnappyInitParameters = {
  credentials: string;
  httpsAgent?: Agent;
  model?: string;
  scope?: string;
  timeout?: number;
};

const state: { client: InstanceType<typeof GigaChat> | undefined } = { client: undefined };

const init = (parameters: SnappyInitParameters): void => {
  const { credentials, httpsAgent, model = `GigaChat`, scope, timeout = defaultTimeout } = parameters;

  // eslint-disable-next-line functional/immutable-data -- single init, then read-only
  state.client = new GigaChat({
    credentials,
    ...(httpsAgent !== undefined && { httpsAgent }),
    model,
    ...(scope !== undefined && { scope }),
    timeout,
  });
};

const processText = async (text: string, feature: FeatureType): Promise<string> => {
  if (state.client === undefined) {
    throw new Error(`Snappy is not initialized. Call Snappy.init() first.`);
  }

  const prompt = Prompts.systemPrompt(feature);

  const resp = await state.client.chat({
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
};

export const Snappy = { init, processText };
