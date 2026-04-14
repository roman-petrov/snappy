import type { AiModelType } from "@snappy/domain";

import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { api } from "../../../core";

type SettingsResponse = Awaited<ReturnType<typeof api.userLlmSettingsGet>> | { status: `error` };

export const useSettingsModelIds = (modelType: AiModelType) => {
  const [ids, setIds] = useState<string[]>([]);
  const [settingsResponse, setSettingsResponse] = useState<SettingsResponse>({ status: `error` });

  useAsyncEffect(async () => {
    const [modelsResponse, nextSettingsResponse] = await Promise.all([
      api.llmModels().catch(() => ({ status: `error` as const })),
      api.userLlmSettingsGet().catch(() => ({ status: `error` as const })),
    ]);

    setIds(
      modelsResponse.status === `ok`
        ? modelsResponse.settings.models.filter(model => model.type === modelType).map(model => model.name)
        : [],
    );
    setSettingsResponse(nextSettingsResponse);
  }, [modelType]);

  return { ids, settingsResponse };
};
