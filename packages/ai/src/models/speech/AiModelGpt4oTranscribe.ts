// cspell:disable
import { ModelSpeech } from "../../core-model";

export const AiModelGpt4oTranscribe = ModelSpeech({
  capabilities: { input: [`audio`], output: [`text`] },
  name: `gpt-4o-transcribe`,
});
