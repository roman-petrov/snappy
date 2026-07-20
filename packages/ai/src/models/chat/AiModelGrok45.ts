// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGrok45 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  cost: `medium`,
  name: `grok-4.5`,
});
