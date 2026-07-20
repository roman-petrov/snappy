// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelGemini3ProImage = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`text`, `image`] },
  cost: `high`,
  imageAspectRatios: AiConstants.imageConfigPreset.geminiPro.aspectRatios,
  imageConfigKind: `gemini`,
  imageResolutions: AiConstants.imageConfigPreset.geminiPro.resolutions,
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `gemini-3-pro-image`,
});
