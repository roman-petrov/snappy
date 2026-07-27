// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelClaudeHaiku45 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`], webSearch: true },
  cost: `medium`,
  name: `claude-haiku-4.5`,
});
