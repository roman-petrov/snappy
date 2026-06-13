// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelQwen37Plus = ModelChat({
  capabilities: { input: [`text`], output: [`text`] },
  name: `qwen3.7-plus`,
});
