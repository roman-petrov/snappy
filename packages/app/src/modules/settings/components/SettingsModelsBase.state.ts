import type { SettingsModelsBaseProps } from "./SettingsModelsBase";

import { $data } from "../../../data";
import { ModelNames } from "../core";

export const useSettingsModelsBaseState = ({
  modelFilter,
  modelType,
  settingsField,
  title,
}: SettingsModelsBaseProps) => {
  const { patch, settings } = $data.settings();
  const names = ModelNames.forType(modelType, modelFilter);
  const options = names.map(modelId => ({ label: modelId, value: modelId }));
  const selected = settings?.[settingsField] ?? ``;
  const value = names.includes(selected) ? selected : (names[0] ?? ``);
  const select = async (modelId: string) => patch({ [settingsField]: modelId });

  return { options, select, title, value };
};
