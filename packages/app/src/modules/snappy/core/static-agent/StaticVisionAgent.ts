/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { AiVision } from "@snappy/ai";

import { StaticAgentFile } from "./StaticAgentFile";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

export const StaticVisionAgent = StaticAgentFile(async (input, file) => {
  const url = URL.createObjectURL(file);

  try {
    const prompt = StaticAgentPrompt({ answers: input.answers, mainPrompt: input.prompt, plan: input.plan });
    const content = await AiVision.prompt(input.models.vision, { prompt, url });

    if (input.isStopped()) {
      return;
    }

    await input.feed.generateText({ model: input.models.chat, prompt: content });
  } finally {
    URL.revokeObjectURL(url);
  }
});
