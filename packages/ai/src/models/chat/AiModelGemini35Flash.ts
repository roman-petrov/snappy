// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGemini35Flash = ModelChat({
  capabilities: { input: [`text`, `image`, `audio`], output: [`text`] },
  cost: `medium`,
  name: `gemini-3.5-flash`,
});
