// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelKimiK3 = ModelChat({
  capabilities: { input: [`text`, `image`], output: [`text`] },
  name: `kimi-k3`,
});
