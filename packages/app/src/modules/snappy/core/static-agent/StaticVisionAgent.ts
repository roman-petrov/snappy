/* eslint-disable functional/no-expression-statements */
import { AiVision } from "@snappy/ai";
import { Mime } from "@snappy/core";

import { StaticAgentFile } from "./StaticAgentFile";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

export const StaticVisionAgent = StaticAgentFile(async (input, file) => {
  const { answers, feed, isStopped, models, plan, prompt } = input;
  const visionPrompt = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
  const url = await Mime.blob(file);
  const session = AiVision.completions(models.vision, { prompt: visionPrompt, url });
  await feed.appendChatStream(session.chatText(isStopped));
});
