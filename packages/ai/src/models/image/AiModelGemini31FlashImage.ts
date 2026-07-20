// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelGemini31FlashImage = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`text`, `image`] },
  cost: `medium`,
  imageAspectRatios: AiConstants.imageConfigPreset.geminiFlash.aspectRatios,
  imageConfigKind: `gemini`,
  imageResolutions: AiConstants.imageConfigPreset.geminiFlash.resolutions,
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `gemini-3.1-flash-image`,
});
