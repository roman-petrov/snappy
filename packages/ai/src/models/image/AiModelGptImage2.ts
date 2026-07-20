// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelGptImage2 = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  cost: `high`,
  imageSizes: AiConstants.imageSizePreset.gptImage,
  name: `gpt-image-2`,
});
