import { useEffect, useState } from "react";

import type { SettingsModelsBaseProps } from "./SettingsModelsBase";

import { trpc } from "../../../core";
import { useSettingsModelIds } from "../hooks";

export const useSettingsModelsBaseState = ({ modelType, settingsField, title }: SettingsModelsBaseProps) => {
  const { ids, settingsResponse } = useSettingsModelIds(modelType);
  const [value, setValue] = useState(``);
  const options = ids.map(modelId => ({ label: modelId, value: modelId }));

  useEffect(() => {
    if (settingsResponse === undefined) {
      setValue(``);

      return;
    }

    const selected = settingsResponse[settingsField];
    setValue(ids.includes(selected) ? selected : (ids[0] ?? ``));
  }, [ids, settingsField, settingsResponse]);

  const select = async (modelId: string) => {
    const settingsSetResponse = await trpc.user.settings.set.mutate({ [settingsField]: modelId });
    setValue(settingsSetResponse[settingsField]);
  };

  return { options, select, title, value };
};
