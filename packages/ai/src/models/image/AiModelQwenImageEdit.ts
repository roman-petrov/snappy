// cspell:disable
import { ModelImage } from "../../core-model";

export const AiModelQwenImageEdit = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  name: `qwen-image-edit`,
});
