// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelGemini31FlashLiteImage = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`text`, `image`] },
  imageAspectRatios: AiConstants.imageConfigPreset.geminiFlash.aspectRatios,
  imageConfigKind: `gemini`,
  imageResolutions: [`1K`],
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `gemini-3.1-flash-lite-image`,
});
