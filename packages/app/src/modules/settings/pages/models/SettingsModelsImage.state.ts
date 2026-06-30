import { AiConstants, type AiImageQuality } from "@snappy/ai";
import { useEffect, useState } from "react";

import type { SettingsOption } from "../../components";

import { trpc } from "../../../../core";
import { useSettingsModelIds } from "../../hooks";

export const useSettingsModelsImageState = () => {
  const { ids, settingsResponse } = useSettingsModelIds(`image`);
  const [modelValue, setModelValue] = useState(``);
  const [qualityValue, setQualityValue] = useState<AiImageQuality>(AiConstants.imageQuality[0]);
  const modelOptions: readonly SettingsOption<string>[] = ids.map(modelId => ({ label: modelId, value: modelId }));

  useEffect(() => {
    if (settingsResponse === undefined) {
      setModelValue(ids[0] ?? ``);
      setQualityValue(AiConstants.imageQuality[0]);

      return;
    }
    setModelValue(ids.includes(settingsResponse.llmImageModel) ? settingsResponse.llmImageModel : (ids[0] ?? ``));
    setQualityValue(settingsResponse.llmImageQuality);
  }, [ids, settingsResponse]);

  const selectModel = async (modelId: string) => {
    const response = await trpc.user.settings.set.mutate({ llmImageModel: modelId });
    setModelValue(response.llmImageModel);
  };

  const selectQuality = async (quality: AiImageQuality) => {
    const response = await trpc.user.settings.set.mutate({ llmImageQuality: quality });
    setQualityValue(response.llmImageQuality);
  };

  const qualityOptions = AiConstants.imageQuality;

  return { modelOptions, modelValue, qualityOptions, qualityValue, selectModel, selectQuality };
};
