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
  const ai = await Ai({ ...aiConfig.options });
  if (isStopped()) {
    return;
  }
  if (generationPrompt.trim() === ``) {
    return;
  }

  const session = ai.chat.completions.create({
    model: aiConfig.models.chat,
    prompt: generationPrompt,
    reasoningEffort: `none`,
  });

  feed.appendChatStream(session.chatText(isStopped));

  await session.cost();
  const streamed = (await session.assistant()).content;
  const imagePrompt = streamed.trim() === `` ? generationPrompt : streamed.trim();
  if (isStopped() || imagePrompt.trim() === ``) {
    return;
  }
  await feed.generateImage({ ai, model: aiConfig.models.image, prompt: imagePrompt });
});
