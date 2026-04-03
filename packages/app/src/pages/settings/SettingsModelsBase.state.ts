import type { ApiUserLlmSettingsBody } from "@snappy/server-api";

import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import type { SettingsOptionListProps } from "./components";

import { api } from "../../core";

type ModelType = `chat` | `image` | `speech-recognition`;

type Parameters = { icon: string; modelType: ModelType; settingsField: SettingsField; title: string };

type SettingsField = keyof ApiUserLlmSettingsBody;

const settingsBody = (field: SettingsField, value: string): ApiUserLlmSettingsBody => ({ [field]: value });

export const useSettingsModelsBaseState = ({
  icon,
  modelType,
  settingsField,
  title,
}: Parameters): SettingsOptionListProps<string> & { title: string } => {
  const [options, setOptions] = useState<SettingsOptionListProps<string>[`options`]>([]);
  const [value, setValue] = useState(``);

  useAsyncEffect(async () => {
    const [modelsResponse, settingsResponse] = await Promise.all([
      api.llmModels().catch(() => ({ status: `error` as const })),
      api.userLlmSettingsGet().catch(() => ({ status: `error` as const })),
    ]);

    const ids =
      modelsResponse.status === `ok`
        ? modelsResponse.settings.models.filter(model => model.type === modelType).map(model => model.name)
        : [];

    setOptions(ids.map(id => ({ icon, label: id, value: id })));
    if (settingsResponse.status !== `ok`) {
      setValue(``);

      return;
    }

    const selected = settingsResponse[settingsField];
    setValue(ids.includes(selected) ? selected : (ids[0] ?? ``));
  }, []);

  const onSelect = async (next: string) => {
    const settingsSetResponse = await api.userLlmSettingsSet(settingsBody(settingsField, next));
    if (settingsSetResponse.status === `ok`) {
      setValue(settingsSetResponse[settingsField]);
    }
  };

  return { onSelect, options, title, value };
};
