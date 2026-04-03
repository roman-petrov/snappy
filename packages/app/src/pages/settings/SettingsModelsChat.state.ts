import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { api } from "../../core";

export const useSettingsModelsChatState = () => {
  const [options, setOptions] = useState<{ icon: string; label: string; value: string }[]>([]);
  const [value, setValue] = useState(``);

  useAsyncEffect(async () => {
    const [modelsResponse, settingsResponse] = await Promise.all([
      api.llmModels().catch(() => ({ status: `error` as const })),
      api.userLlmSettingsGet().catch(() => ({ status: `error` as const })),
    ]);

    const ids =
      modelsResponse.status === `ok`
        ? modelsResponse.settings.models.filter(model => model.type === `chat`).map(model => model.name)
        : [];
    setOptions(ids.map(id => ({ icon: `🤖`, label: id, value: id })));
    if (settingsResponse.status === `ok`) {
      const v = settingsResponse.llmChatModel;
      setValue(ids.includes(v) ? v : (ids[0] ?? ``));
    } else {
      setValue(``);
    }
  }, []);

  const onSelect = async (next: string) => {
    const settingsSetResponse = await api.userLlmSettingsSet({ llmChatModel: next });
    if (settingsSetResponse.status === `ok`) {
      setValue(settingsSetResponse.llmChatModel);
    }
  };

  return { onSelect, options, value };
};
