/* eslint-disable functional/no-expression-statements */
import { StaticAgentPrompt } from "../StaticAgentPrompt";
import { StaticAgent } from "./StaticAgent";

export const StaticVisualAgent = StaticAgent(async ({ ai, answers, feed, isStopped, models, plan, prompt }) => {
  const generationPrompt = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
  const session = ai.chat.completions.create({ model: models.chat, prompt: generationPrompt, reasoningEffort: `none` });

  feed.appendChatStream(session.chatText(isStopped));

  const imagePrompt = (await session.assistant()).content;
  if (isStopped()) {
    return;
  }
  await feed.generateImage({ ai, model: models.image, prompt: imagePrompt });
});
