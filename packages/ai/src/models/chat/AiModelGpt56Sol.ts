// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt56Sol = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`], webSearch: true },
  cost: `high`,
  name: `gpt-5.6-sol`,
});
