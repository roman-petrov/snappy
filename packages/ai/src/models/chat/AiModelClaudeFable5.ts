// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelClaudeFable5 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  cost: `high`,
  name: `claude-fable-5`,
});
