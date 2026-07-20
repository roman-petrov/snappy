// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt56SolPro = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  cost: `high`,
  name: `gpt-5.6-sol-pro`,
});
