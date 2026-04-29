/* eslint-disable functional/no-expression-statements */
import { Ai } from "@snappy/ai";

import { StaticAgentPrompt } from "../StaticAgentPrompt";
import { StaticAgent } from "./StaticAgent";

export const StaticAudioAgent = StaticAgent(async ({ aiConfig, feed, isStopped, plan, prompt }) => {
  const answers = await feed.ask(plan);
  if (isStopped()) {
    return;
  }
  const file = answers[`audio`];
  if (!(file instanceof File)) {
    return;
  }
  const ai = await Ai({ ...aiConfig.options });
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (isStopped()) {
    return;
  }
  const out = await ai.audio.transcriptions.create({
    file: { bytes, fileName: file.name, mimeType: file.type.trim() === `` ? `application/octet-stream` : file.type },
    model: aiConfig.models.speech,
  });
  if (isStopped()) {
    return;
  }
  const generationPrompt = `${StaticAgentPrompt({ answers, mainPrompt: prompt, plan })}\n\nTranscript:\n${out.text.trim()}`;
  await feed.generateText({ ai, model: aiConfig.models.chat, prompt: generationPrompt });
});
