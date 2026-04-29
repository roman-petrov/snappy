import { i } from "@snappy/intl";
import { useStoreValue } from "@snappy/store";
import { $fog, $locale, $theme, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { t, trpc } from "../../core";

export const useSettingsState = () => {
  const [aiTunnelEnd, setAiTunnelEnd] = useState(`›`);
  const [balanceEnd, setBalanceEnd] = useState(`›`);
  const [llmChatEnd, setLlmChatEnd] = useState(`›`);
  const [llmImageEnd, setLlmImageEnd] = useState(`›`);
  const [llmSpeechEnd, setLlmSpeechEnd] = useState(`›`);
  const fog = useStoreValue($fog);
  const theme = useStoreValue($theme);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => {
    const [balance, llm] = await Promise.all([trpc.user.balance.query(), trpc.user.settings.get.query()]);
    setAiTunnelEnd(`${llm.aiTunnelDirect ? t(`settings.aiTunnelModeDirect`) : t(`settings.aiTunnelModeProxy`)} ›`);
    setBalanceEnd(`${i.price(balance)} ›`);
    setLlmChatEnd(`${llm.llmChatModel} ›`);
    setLlmImageEnd(`${llm.llmImageModel} · ${llm.llmImageQuality} ›`);
    setLlmSpeechEnd(`${llm.llmSpeechRecognitionModel} ›`);
  }, [locale]);
  const toggleFog = () => $fog.set(!fog);

  return { aiTunnelEnd, balanceEnd, fog, llmChatEnd, llmImageEnd, llmSpeechEnd, locale, theme, toggleFog };
};
