import type { AiModelType } from "@snappy/ai";

import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { aiForModelsList, trpc } from "../../../core";

export const useSettingsModelIds = (modelType: AiModelType) => {
  const [ids, setIds] = useState<string[]>([]);

  const [settingsResponse, setSettingsResponse] = useState<
    Awaited<ReturnType<typeof trpc.user.settings.get.query>> | undefined
  >(undefined);

  useAsyncEffect(async () => {
    const nextSettingsResponse = await trpc.user.settings.get.query();
    const ai = await aiForModelsList(nextSettingsResponse);

    setIds(
      ai.models
        .list()
        .filter(model => model.type === modelType)
        .map(model => model.name),
    );
    setSettingsResponse(nextSettingsResponse);
  }, [modelType]);

  return { ids, settingsResponse };
};
