// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelQwen36Flash = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `qwen3.6-flash`,
});
