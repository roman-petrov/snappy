// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelGptImage15 = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  imageSizes: AiConstants.imageSizePreset.gptImage,
  name: `gpt-image-1.5`,
});
