// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelFlux2Pro = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  cost: `medium`,
  imageConfigKind: `flux`,
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `flux.2-pro`,
});
