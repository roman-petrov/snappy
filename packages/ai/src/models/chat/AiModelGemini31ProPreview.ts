// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGemini31ProPreview = ModelChat({
  capabilities: { input: [`text`, `image`, `audio`], output: [`text`] },
  name: `gemini-3.1-pro-preview`,
});
