// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt55Pro = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `gpt-5.5-pro`,
});
