// cspell:disable
import { ModelSpeech } from "../../core-model";

export const AiModelQwen3AsrFlash = ModelSpeech({
  capabilities: { input: [`audio`], output: [`text`] },
  name: `qwen3-asr-flash-2026-02-10`,
});
