// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGrok43 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `grok-4.3`,
});
