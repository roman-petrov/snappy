// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt56Luna = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  cost: `medium`,
  name: `gpt-5.6-luna`,
});
