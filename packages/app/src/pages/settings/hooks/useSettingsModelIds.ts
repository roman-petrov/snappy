import type { TrpcOutputs } from "@snappy/app-server-api";

import { Ai, type AiModelType } from "@snappy/ai";
import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { AgentAiFromSettings, trpc } from "../../../core";

export const useSettingsModelIds = (modelType: AiModelType) => {
  const [ids, setIds] = useState<string[]>([]);

  const [settingsResponse, setSettingsResponse] = useState<TrpcOutputs[`user`][`settings`][`get`] | undefined>(
    undefined,
  );

  useAsyncEffect(async () => {
    const settings = await trpc.user.settings.get.query();
    const agentAi = Ai(AgentAiFromSettings(settings).options);

    setIds(agentAi.models.filter(model => model.type === modelType).map(model => model.name));
    setSettingsResponse(settings);
  }, [modelType]);

  return { ids, settingsResponse };
};
