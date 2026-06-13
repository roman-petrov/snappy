import type { TrpcOutputs } from "@snappy/app-server-api";

import { type AiModelItem, AiModels, type AiModelType } from "@snappy/ai";
import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../../../core";

export const useSettingsModelIds = (modelType: AiModelType, modelFilter?: (model: AiModelItem) => boolean) => {
  const [ids, setIds] = useState<string[]>([]);

  const [settingsResponse, setSettingsResponse] = useState<TrpcOutputs[`user`][`settings`][`get`] | undefined>(
    undefined,
  );

  useAsyncEffect(async () => {
    const settings = await trpc.user.settings.get.query();

    setIds(
      AiModels.items
        .filter(entry => entry.type === modelType && (modelFilter === undefined || modelFilter(entry)))
        .map(entry => entry.name),
    );
    setSettingsResponse(settings);
  }, [modelFilter, modelType]);

  return { ids, settingsResponse };
};
