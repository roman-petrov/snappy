// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGpt56TerraPro = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `gpt-5.6-terra-pro`,
});
