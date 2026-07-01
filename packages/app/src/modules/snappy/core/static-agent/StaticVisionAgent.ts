/* eslint-disable functional/no-expression-statements */
import { AiVision } from "@snappy/ai";
import { Mime } from "@snappy/core";

import { StaticAgentFile } from "./StaticAgentFile";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

export const StaticVisionAgent = StaticAgentFile(async (input, file) => {
  const { answers, feed, isStopped, locale, models, plan, prompt } = input;
  const vision = Promise.withResolvers<{ label: string }>();

  feed.appendStatus(locale === `ru` ? `Изучаю изображение…` : `Inspecting image…`, vision);

  const visionPrompt = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
  const url = await Mime.blob(file);
  const content = await AiVision.prompt(models.vision, { prompt: visionPrompt, url });
  vision.resolve({ label: `` });
  if (isStopped()) {
    return;
  }

  await feed.appendChatText(content);
});
