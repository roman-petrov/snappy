// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelSeedream45 = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  imageAspectRatios: AiConstants.imageConfigPreset.gemini.aspectRatios,
  imageConfigKind: `gemini`,
  imageResolutions: AiConstants.imageConfigPreset.gemini.resolutions,
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `seedream-4.5`,
});
