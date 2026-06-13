// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGemini35Flash = ModelChat({
  capabilities: { input: [`text`, `image`, `audio`], output: [`text`] },
  name: `gemini-3.5-flash`,
});
