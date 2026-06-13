// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelClaudeSonnet46 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `claude-sonnet-4.6`,
});
