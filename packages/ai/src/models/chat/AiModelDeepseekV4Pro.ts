// cspell:disable
import { ModelChat, ModelDeepSeek } from "../../core-model";

export const AiModelDeepseekV4Pro = ModelChat({
  behavior: ModelDeepSeek,
  capabilities: { input: [`text`], output: [`text`] },
  name: `deepseek-v4-pro`,
});
