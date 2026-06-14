// cspell:disable
import { ModelImage } from "../../core-model";

export const AiModelGemini25FlashImage = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`text`, `image`] },
  name: `gemini-2.5-flash-image`,
});
