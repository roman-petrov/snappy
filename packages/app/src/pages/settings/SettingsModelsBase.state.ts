import type { AiModelType } from "@snappy/domain";
import type { ApiUserLlmSettingsBody } from "@snappy/server-api";

import { useEffect, useState } from "react";

import type { SettingsOptionListProps } from "./components";

import { api } from "../../core";
import { useSettingsModelIds } from "./hooks";

export const useSettingsModelsBaseState = ({
  icon,
  modelType,
  settingsField,
  title,
}: {
  icon: string;
  modelType: AiModelType;
  settingsField: keyof ApiUserLlmSettingsBody;
  title: string;
}): SettingsOptionListProps<string> & { title: string } => {
  const { ids, settingsResponse } = useSettingsModelIds(modelType);
  const [value, setValue] = useState(``);
  const options = ids.map(id => ({ icon, label: id, value: id }));

  useEffect(() => {
    if (settingsResponse.status !== `ok`) {
      setValue(``);

      return;
    }

    const selected = settingsResponse[settingsField];
    setValue(ids.includes(selected) ? selected : (ids[0] ?? ``));
  }, [ids, settingsField, settingsResponse]);

  const onSelect = async (next: string) => {
    const settingsSetResponse = await api.userLlmSettingsSet({ [settingsField]: next });
    if (settingsSetResponse.status === `ok`) {
      setValue(settingsSetResponse[settingsField]);
    }
  };

  return { onSelect, options, title, value };
};
