/* eslint-disable functional/no-expression-statements */
import { Ai } from "@snappy/ai";

import { StaticAgentPrompt } from "../StaticAgentPrompt";
import { StaticAgent } from "./StaticAgent";

export const StaticVisualAgent = StaticAgent(async ({ aiConfig, feed, isStopped, plan, prompt }) => {
  const answers = await feed.ask(plan);
  if (isStopped()) {
    return;
  }
  const generationPrompt = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
  const ai = Ai(aiConfig.options);

  const session = ai.chat.completions.create({
    model: aiConfig.models.chat,
    prompt: generationPrompt,
    reasoningEffort: `none`,
  });

  feed.appendChatStream(session.chatText(isStopped));

  const imagePrompt = (await session.assistant()).content;
  if (isStopped()) {
    return;
  }
  await feed.generateImage({ ai, model: aiConfig.models.image, prompt: imagePrompt });
});
