import { useEffect, useState } from "react";

import type { SettingsModelsBaseProps } from "./SettingsModelsBase";

import { api } from "../../core";
import { useSettingsModelIds } from "./hooks";

export const useSettingsModelsBaseState = ({ icon, modelType, settingsField, title }: SettingsModelsBaseProps) => {
  const { ids, settingsResponse } = useSettingsModelIds(modelType);
  const [value, setValue] = useState(``);
  const options = ids.map(id => ({ icon, label: id, value: id }));

  useEffect(() => {
    if (settingsResponse === undefined) {
      setValue(``);

      return;
    }

    const selected = settingsResponse[settingsField];
    setValue(ids.includes(selected) ? selected : (ids[0] ?? ``));
  }, [ids, settingsField, settingsResponse]);

  const onSelect = async (next: string) => {
    const settingsSetResponse = await api.userLlmSettingsSet({ [settingsField]: next });
    setValue(settingsSetResponse[settingsField]);
  };

  return { onSelect, options, title, value };
};
