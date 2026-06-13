// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt52 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `gpt-5.2`,
});
