/* eslint-disable functional/no-expression-statements */
import { StaticAgentPrompt } from "../StaticAgentPrompt";
import { StaticAgent } from "./StaticAgent";

export const StaticAudioAgent = StaticAgent(async ({ ai, answers, feed, isStopped, locale, models, plan, prompt }) => {
  const file = answers[`audio`];
  if (!(file instanceof File)) {
    return;
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const transcribe = Promise.withResolvers<{ label: string }>();

  feed.appendStatus(locale === `ru` ? `Расшифровка…` : `Transcribing…`, transcribe);

  const out = await ai.audio.transcriptions.create({
    file: { bytes, fileName: file.name, mimeType: file.type.trim() === `` ? `application/octet-stream` : file.type },
    model: models.speech,
  });
  transcribe.resolve({ label: locale === `ru` ? `Расшифровано` : `Transcribed` });
  if (isStopped()) {
    return;
  }
  const generationPrompt = `${StaticAgentPrompt({ answers, mainPrompt: prompt, plan })}\n\nTranscript:\n${out.text.trim()}`;
  await feed.generateText({ ai, model: models.chat, prompt: generationPrompt });
});
