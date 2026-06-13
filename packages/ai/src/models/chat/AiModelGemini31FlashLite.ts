// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGemini31FlashLite = ModelChat({
  capabilities: { input: [`text`, `image`, `audio`], output: [`text`] },
  name: `gemini-3.1-flash-lite`,
});
