// cspell:disable
import { ModelChat, ModelDeepSeek } from "../../core-model";

export const AiModelDeepseekV4Flash = ModelChat({
  behavior: ModelDeepSeek,
  capabilities: { input: [`text`], output: [`text`] },
  cost: `low`,
  name: `deepseek-v4-flash`,
});
