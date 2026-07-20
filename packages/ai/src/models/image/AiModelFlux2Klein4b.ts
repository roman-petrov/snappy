// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelFlux2Klein4b = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  imageConfigKind: `flux`,
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `flux.2-klein-4b`,
});
