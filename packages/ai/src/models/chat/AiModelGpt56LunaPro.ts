// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt56LunaPro = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  cost: `medium`,
  name: `gpt-5.6-luna-pro`,
});
