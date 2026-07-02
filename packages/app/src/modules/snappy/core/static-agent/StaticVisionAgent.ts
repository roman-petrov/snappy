/* eslint-disable functional/no-expression-statements */
import { Mime } from "@snappy/core";

import { StaticAgentChat } from "./StaticAgentChat";
import { StaticAgentFile } from "./StaticAgentFile";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

export const StaticVisionAgent = StaticAgentFile(async (input, file) => {
  const { answers, feed, isStopped, locale, models, plan, prompt } = input;
  const visionPrompt = StaticAgentPrompt({ answers, mainPrompt: prompt, plan });
  const url = await Mime.blob(file);

  const session = models.vision.completions({
    messages: StaticAgentChat.messages(locale, [
      { text: visionPrompt, type: `text` },
      { type: `image`, url },
    ]),
  });
  await feed.appendChatStream(session.chatText(isStopped));
});
