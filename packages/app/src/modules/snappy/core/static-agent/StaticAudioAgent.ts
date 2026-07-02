/* eslint-disable functional/no-expression-statements */
import { Bilingual } from "@snappy/intl";

import { AgentChat } from "..";
import { StaticAgentFile } from "./StaticAgentFile";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

export const StaticAudioAgent = StaticAgentFile(async (input, file) => {
  const { answers, feed, isStopped, locale, models, plan, prompt } = input;
  const transcribe = Promise.withResolvers<{ label: string }>();

  feed.appendStatus(Bilingual.pick(locale, [`Transcribing audio file…`, `Расшифровываю аудиофайл…`]), transcribe);

  const out = await models.speech.transcribe({ file });
  transcribe.resolve({ label: `` });
  if (isStopped()) {
    return;
  }

  const transcript = out.text;
  await feed.appendChatText(transcript);
  if (isStopped()) {
    return;
  }

  const brief = StaticAgentPrompt({ answers, locale, mainPrompt: prompt, plan });
  const generationPrompt = `${brief}\n\n${AgentChat.transcriptSection(locale, transcript)}`;
  await feed.generateText({ locale, model: models.chat, prompt: generationPrompt });
});
