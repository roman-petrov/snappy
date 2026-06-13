// cspell:disable
import { ModelSpeech } from "../../core-model";

export const AiModelGpt4oMiniTranscribe = ModelSpeech({
  capabilities: { input: [`audio`], output: [`text`] },
  name: `gpt-4o-mini-transcribe`,
});
