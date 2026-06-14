// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGemini25Flash = ModelChat({
  capabilities: { input: [`text`, `image`, `audio`], output: [`text`] },
  name: `gemini-2.5-flash`,
});
