// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelClaudeSonnet5 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `claude-sonnet-5`,
});
