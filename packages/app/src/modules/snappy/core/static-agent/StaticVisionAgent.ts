/* eslint-disable functional/no-expression-statements */
import { Mime } from "@snappy/core";

import { AgentChat } from "..";
import { StaticAgentFile } from "./StaticAgentFile";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

export const StaticVisionAgent = StaticAgentFile(async (input, file) => {
  const { answers, feed, isStopped, locale, models, plan, prompt } = input;
  const visionPrompt = StaticAgentPrompt({ answers, locale, mainPrompt: prompt, plan });
  const url = await Mime.blob(file);

  const session = models.vision.completions({
    messages: AgentChat.messages(locale, [
      { text: visionPrompt, type: `text` },
      { type: `image`, url },
    ]),
  });
  await feed.appendChatStream(session.chatText(isStopped));
});
