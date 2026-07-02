// cspell:disable
import { AiConstants } from "../../AiConstants";
import { ModelImage } from "../../core-model";

export const AiModelFlux2Max = ModelImage({
  capabilities: { input: [`text`, `image`], output: [`image`] },
  imageConfigKind: `flux`,
  imageSizes: AiConstants.imageSizePreset.gemini,
  name: `flux.2-max`,
});
