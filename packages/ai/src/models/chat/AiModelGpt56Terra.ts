// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt56Terra = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  cost: `medium`,
  name: `gpt-5.6-terra`,
});
