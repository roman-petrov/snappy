import { AiConstants, type AiImageQuality } from "@snappy/ai";
import { useEffect, useState } from "react";

import type { SettingsOption } from "./components";

import { api } from "../../core";
import { useSettingsModelIds } from "./hooks";

export const useSettingsModelsImageState = () => {
  const { ids, settingsResponse } = useSettingsModelIds(`image`);
  const [modelValue, setModelValue] = useState(``);
  const [qualityValue, setQualityValue] = useState<AiImageQuality>(AiConstants.imageQuality[0]);
  const modelOptions: readonly SettingsOption<string>[] = ids.map(id => ({ icon: `🎨`, label: id, value: id }));

  useEffect(() => {
    if (settingsResponse === undefined) {
      setModelValue(ids[0] ?? ``);
      setQualityValue(AiConstants.imageQuality[0]);

      return;
    }
    setModelValue(ids.includes(settingsResponse.llmImageModel) ? settingsResponse.llmImageModel : (ids[0] ?? ``));
    setQualityValue(settingsResponse.llmImageQuality);
  }, [ids, settingsResponse]);

  const onModelSelect = async (next: string) => {
    const response = await api.userSettingsSet({ llmImageModel: next });
    setModelValue(response.llmImageModel);
  };

  const onQualitySelect = async (next: AiImageQuality) => {
    const response = await api.userSettingsSet({ llmImageQuality: next });
    setQualityValue(response.llmImageQuality);
  };

  const qualityOptions = AiConstants.imageQuality;

  return { modelOptions, modelValue, onModelSelect, onQualitySelect, qualityOptions, qualityValue };
};
