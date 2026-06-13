// cspell:disable
import { ModelImage } from "../../core-model";

export const AiModelGptImage2 = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  name: `gpt-image-2`,
});
