// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelClaudeHaiku45 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `claude-haiku-4.5`,
});
