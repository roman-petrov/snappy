// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt54Pro = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `gpt-5.4-pro`,
});
