// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelQwen37Plus = ModelChat({
  capabilities: { input: [`text`], output: [`text`] },
  cost: `low`,
  name: `qwen3.7-plus`,
});
