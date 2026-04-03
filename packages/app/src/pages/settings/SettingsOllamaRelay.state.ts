import { useAsyncEffect } from "@snappy/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "../../core";

export const useSettingsOllamaRelayState = () => {
  const [relayKey, setRelayKey] = useState(``);
  const [llmProvider, setLlmProvider] = useState<`community` | `self`>(`community`);
  const [communityTextModel, setCommunityTextModel] = useState(``);
  const [communityImageModel, setCommunityImageModel] = useState(``);
  const [communityChatOptions, setCommunityChatOptions] = useState<string[]>([]);
  const [communityImageOptions, setCommunityImageOptions] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const previousProvider = useRef<`community` | `self` | null>(null);

  const refreshCommunityCatalog = useCallback(async () => {
    try {
      const c = await api.communityModelsGet();
      if (c.status === `ok`) {
        setCommunityChatOptions([...c.chat]);
        setCommunityImageOptions([...c.image]);
      }
    } catch {
      // Catalog optional; settings still work
    }
  }, []);

  useAsyncEffect(async () => {
    try {
      const r = await api.settingsRelayGet();
      if (r.status === `ok`) {
        setRelayKey(r.ollamaRelayKey);
        setLlmProvider(r.llmProvider);
        setCommunityTextModel(r.communityTextModel);
        setCommunityImageModel(r.communityImageModel);
      }
    } catch {
      // Ignore
    }
    await refreshCommunityCatalog();
    setLoaded(true);
  }, [refreshCommunityCatalog]);

  useEffect(() => {
    if (previousProvider.current === `self` && llmProvider === `community`) {
      void refreshCommunityCatalog();
    }
    previousProvider.current = llmProvider;
  }, [llmProvider, refreshCommunityCatalog]);

  const save = useCallback(async () => {
    setSaving(true);
    await api.settingsRelayPatch({ communityImageModel, communityTextModel, llmProvider, ollamaRelayKey: relayKey });
    setSaving(false);
  }, [communityImageModel, communityTextModel, llmProvider, relayKey]);

  return {
    communityChatOptions,
    communityImageModel,
    communityImageOptions,
    communityTextModel,
    llmProvider,
    loaded,
    onCommunityImageModelChange: setCommunityImageModel,
    onCommunityTextModelChange: setCommunityTextModel,
    onLlmProviderChange: setLlmProvider,
    onRelayKeyChange: setRelayKey,
    refreshCommunityCatalog,
    relayKey,
    save,
    saving,
  };
};
