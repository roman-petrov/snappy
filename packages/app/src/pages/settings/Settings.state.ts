import { useStoreValue } from "@snappy/store";
import { $fog, $locale, $theme, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { Auth, t, trpc, type UserSettings } from "../../core";

export const useSettingsState = () => {
  const [aiTunnelEnd, setAiTunnelEnd] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [llmChatEnd, setLlmChatEnd] = useState<string>();
  const [llmImageEnd, setLlmImageEnd] = useState<string>();
  const [llmVisionEnd, setLlmVisionEnd] = useState<string>();
  const [llmSpeechEnd, setLlmSpeechEnd] = useState<string>();
  const [typeWriterSpeed, setTypeWriterSpeed] = useState<UserSettings[`typeWriterSpeed`]>(undefined);
  const fog = useStoreValue($fog);
  const theme = useStoreValue($theme);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => {
    const [settings, profile] = await Promise.all([trpc.user.settings.get.query(), Auth.user()]);
    setAiTunnelEnd(settings.aiTunnelDirect ? t(`settings.aiTunnel.mode.direct`) : t(`settings.aiTunnel.mode.proxy`));
    setEmail(profile?.email);
    setLlmChatEnd(settings.llmChatModel);
    setLlmImageEnd(`${settings.llmImageModel} · ${settings.llmImageQuality}`);
    setLlmVisionEnd(settings.llmVisionModel);
    setLlmSpeechEnd(settings.llmSpeechRecognitionModel);
    setTypeWriterSpeed(settings.typeWriterSpeed);
  }, [locale]);
  const toggleFog = () => $fog.set(!fog);

  return {
    aiTunnelEnd,
    email,
    fog,
    llmChatEnd,
    llmImageEnd,
    llmSpeechEnd,
    llmVisionEnd,
    locale,
    theme,
    toggleFog,
    typeWriterSpeed,
  };
};
