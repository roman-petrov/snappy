/* eslint-disable functional/no-expression-statements */
import { StaticAgentChat } from "./StaticAgentChat";
import { StaticAgentFile } from "./StaticAgentFile";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

export const StaticAudioAgent = StaticAgentFile(async (input, file) => {
  const { answers, feed, isStopped, locale, models, plan, prompt } = input;
  const transcribe = Promise.withResolvers<{ label: string }>();

  feed.appendStatus(locale === `ru` ? `Расшифровываю аудиофайл…` : `Transcribing audio file…`, transcribe);

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

  const generationPrompt = StaticAgentChat.withPolicy(
    locale,
    `${StaticAgentPrompt({ answers, mainPrompt: prompt, plan })}\n\nTranscript:\n${transcript}`,
  );
  await feed.generateText({ model: models.chat, prompt: generationPrompt });
});
