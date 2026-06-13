// cspell:disable
import { ModelImage } from "../../core-model";

export const AiModelGemini3ProImagePreview = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`text`, `image`] },
  name: `gemini-3-pro-image-preview`,
});
