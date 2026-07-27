// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelClaudeOpus48 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`], webSearch: true },
  cost: `high`,
  name: `claude-opus-4.8`,
});
