// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelGptImage1Mini = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  cost: `low`,
  imageSizes: AiConstants.imageSizePreset.gptImage,
  name: `gpt-image-1-mini`,
});
