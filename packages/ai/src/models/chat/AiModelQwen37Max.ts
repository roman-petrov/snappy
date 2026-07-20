// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelQwen37Max = ModelChat({
  capabilities: { input: [`text`], output: [`text`] },
  cost: `medium`,
  name: `qwen3.7-max`,
});
