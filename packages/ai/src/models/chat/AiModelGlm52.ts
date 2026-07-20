// cspell:disable
import { ModelChat } from "../../core-model";

export const AiModelGlm52 = ModelChat({
  capabilities: { input: [`text`], output: [`text`] },
  cost: `medium`,
  name: `glm-5.2`,
});
