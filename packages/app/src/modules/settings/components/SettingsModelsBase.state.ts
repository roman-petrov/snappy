import type { SettingsModelsBaseProps } from "./SettingsModelsBase";

import { r } from "../../../data";
import { ModelNames } from "../core";

export const useSettingsModelsBaseState = ({
  modelFilter,
  modelType,
  settingsField,
  title,
}: SettingsModelsBaseProps) => {
  const [settings, patch] = r.settings();
  const names = ModelNames.forType(modelType, modelFilter);
  const selected = settings?.[settingsField] ?? ``;
  const value = names.includes(selected) ? selected : (names[0] ?? ``);
  const select = async (modelId: string) => patch({ [settingsField]: modelId });
  const grouped = modelType !== `speech-recognition`;

  if (grouped) {
    return { grouped: true as const, modelFilter, modelType, select, title, value };
  }

  const options = names.map(modelId => ({ label: modelId, value: modelId }));

  return { grouped: false as const, options, select, title, value };
};
