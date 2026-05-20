import { StaticAgentPrompt } from "../StaticAgentPrompt";
import { StaticAgent } from "./StaticAgent";

export const StaticTextAgent = StaticAgent(async ({ ai, answers, feed, models, plan, prompt }) =>
  feed.generateText({ ai, model: models.chat, prompt: StaticAgentPrompt({ answers, mainPrompt: prompt, plan }) }),
);
