// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGrok45 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `grok-4.5`,
});
