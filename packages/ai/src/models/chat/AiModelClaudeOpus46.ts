// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelClaudeOpus46 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `claude-opus-4.6`,
});
