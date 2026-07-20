import { AiConstants, type AiImageQuality } from "@snappy/ai";

import { r } from "../../../../data";
import { ModelNames } from "../../core";

export const useSettingsModelsImageState = () => {
  const [settings, patch] = r.settings();
  const names = ModelNames.forType(`image`);
  const modelSelected = settings?.llmImageModel ?? ``;
  const modelValue = names.includes(modelSelected) ? modelSelected : (names[0] ?? ``);
  const qualityValue = settings?.llmImageQuality ?? AiConstants.imageQuality[0];
  const qualityOptions = AiConstants.imageQuality;
  const selectModel = async (modelId: string) => patch({ llmImageModel: modelId });
  const selectQuality = async (quality: AiImageQuality) => patch({ llmImageQuality: quality });

  return { modelValue, qualityOptions, qualityValue, selectModel, selectQuality };
};
