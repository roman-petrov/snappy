import type { ApiPreset, PresetGroupId } from "@snappy/server-api";

import { useStoreValue } from "@snappy/store";
import { $locale, Locale, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../core";

export const useDashboardState = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [presets, setPresets] = useState<ApiPreset[]>([]);
  const [groupOrder, setGroupOrder] = useState<readonly PresetGroupId[]>([]);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => {
    setInitLoading(true);
    const loc = Locale.effective();
    const [remainingResponse, presetsResponse] = await Promise.all([api.remaining(), api.presetsList(loc)]);
    if (remainingResponse.remaining === 0 && remainingResponse.isPremium !== true) {
      setLimitReached(true);
    }
    setPresets([...presetsResponse.presets]);
    setGroupOrder(presetsResponse.groupOrder);
    setInitLoading(false);
  }, [locale]);

  const byGroup = presets.reduce((map, preset) => {
    const next = new Map(map);
    const bucket = [...(next.get(preset.group) ?? []), preset];
    next.set(preset.group, bucket);

    return next;
  }, new Map<PresetGroupId, ApiPreset[]>());

  const navigate = useNavigate();
  const [presetId, setPresetId] = useState(`free`);

  const onPick = (id: string) => {
    setPresetId(id);
    void navigate(`preset/${encodeURIComponent(id)}`);
  };

  return { byGroup, groupOrder, initLoading, limitReached, onPick, presetId };
};
