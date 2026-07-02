// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelQwenImageEdit = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  imageSizes: AiConstants.imageSizePreset.gptImage,
  name: `qwen-image-edit`,
});
