// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGemini3FlashPreview = ModelChat({
  capabilities: { input: [`text`, `image`, `audio`], output: [`text`] },
  name: `gemini-3-flash-preview`,
});
