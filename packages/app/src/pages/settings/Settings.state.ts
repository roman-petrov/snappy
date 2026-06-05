import { i } from "@snappy/intl";
import { useStoreValue } from "@snappy/store";
import { $fog, $locale, $theme, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { Auth, t, trpc, type UserSettings } from "../../core";

export const useSettingsState = () => {
  const [aiTunnelEnd, setAiTunnelEnd] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [balanceEnd, setBalanceEnd] = useState<string>();
  const [llmChatEnd, setLlmChatEnd] = useState<string>();
  const [llmImageEnd, setLlmImageEnd] = useState<string>();
  const [llmSpeechEnd, setLlmSpeechEnd] = useState<string>();
  const [typeWriterSpeed, setTypeWriterSpeed] = useState<UserSettings[`typeWriterSpeed`]>(undefined);
  const fog = useStoreValue($fog);
  const theme = useStoreValue($theme);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => {
    const [balance, llm, profile] = await Promise.all([
      trpc.user.balance.query(),
      trpc.user.settings.get.query(),
      Auth.user(),
    ]);
    setAiTunnelEnd(llm.aiTunnelDirect ? t(`settings.aiTunnel.mode.direct`) : t(`settings.aiTunnel.mode.proxy`));
    setBalanceEnd(i.price(balance));
    setEmail(profile?.email);
    setLlmChatEnd(llm.llmChatModel);
    setLlmImageEnd(`${llm.llmImageModel} · ${llm.llmImageQuality}`);
    setLlmSpeechEnd(llm.llmSpeechRecognitionModel);
    setTypeWriterSpeed(llm.typeWriterSpeed);
  }, [locale]);
  const toggleFog = () => $fog.set(!fog);

  return {
    aiTunnelEnd,
    balanceEnd,
    email,
    fog,
    llmChatEnd,
    llmImageEnd,
    llmSpeechEnd,
    locale,
    theme,
    toggleFog,
    typeWriterSpeed,
  };
};
