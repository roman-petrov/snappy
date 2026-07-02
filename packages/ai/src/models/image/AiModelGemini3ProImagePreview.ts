// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelGemini3ProImagePreview = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`text`, `image`] },
  imageAspectRatios: AiConstants.imageConfigPreset.gemini.aspectRatios,
  imageConfigKind: `gemini`,
  imageResolutions: AiConstants.imageConfigPreset.gemini.resolutions,
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `gemini-3-pro-image-preview`,
});
