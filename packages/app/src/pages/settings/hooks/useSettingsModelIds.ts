import type { ApiUserSettingsResult } from "@snappy/server-api";

import { Ai, type AiModelType } from "@snappy/ai";
import { Locale, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { api } from "../../../core";

export const useSettingsModelIds = (modelType: AiModelType) => {
  const [ids, setIds] = useState<string[]>([]);
  const [settingsResponse, setSettingsResponse] = useState<ApiUserSettingsResult | undefined>(undefined);

  useAsyncEffect(async () => {
    const [ai, nextSettingsResponse] = await Promise.all([
      Ai({ locale: Locale.effective(), url: `${globalThis.location.origin}/api/ai-tunnel/v1` }),
      api.userSettingsGet(),
    ]);

    setIds(ai.models.filter(model => model.type === modelType).map(model => model.name));
    setSettingsResponse(nextSettingsResponse);
  }, [modelType]);

  return { ids, settingsResponse };
};
