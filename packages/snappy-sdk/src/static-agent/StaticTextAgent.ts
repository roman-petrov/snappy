/* eslint-disable functional/no-expression-statements */
import { Ai } from "@snappy/ai";

import { StaticAgentPrompt } from "../StaticAgentPrompt";
import { StaticAgent } from "./StaticAgent";

export const StaticTextAgent = StaticAgent(async ({ aiConfig, feed, isStopped, plan, prompt }) => {
  const answers = await feed.ask(plan);
  if (isStopped()) {
    return;
  }
  await feed.generateText({
    ai: Ai(aiConfig.options),
    model: aiConfig.models.chat,
    prompt: StaticAgentPrompt({ answers, mainPrompt: prompt, plan }),
  });
});
