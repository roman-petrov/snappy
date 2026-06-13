/* eslint-disable functional/no-expression-statements */
import { StaticAgentPrompt } from "../StaticAgentPrompt";
import { StaticAgent } from "./StaticAgent";

export const StaticAudioAgent = StaticAgent(async ({ ai, answers, feed, isStopped, locale, models, plan, prompt }) => {
  const file = answers[`audio`];
  if (!(file instanceof File)) {
    return;
  }
  const transcribe = Promise.withResolvers<{ label: string }>();

  feed.appendStatus(locale === `ru` ? `Расшифровка…` : `Transcribing…`, transcribe);

  const out = await ai.audio.transcriptions.create({ file, model: models.speech });
  transcribe.resolve({ label: `` });
  if (isStopped()) {
    return;
  }

  const transcript = out.text;
  await feed.appendChatText(transcript);
  if (isStopped()) {
    return;
  }

  const generationPrompt = `${StaticAgentPrompt({ answers, mainPrompt: prompt, plan })}\n\nTranscript:\n${transcript}`;
  await feed.generateText({ ai, model: models.chat, prompt: generationPrompt });
});
