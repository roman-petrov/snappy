// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt5Mini = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  cost: `low`,
  name: `gpt-5-mini`,
});
