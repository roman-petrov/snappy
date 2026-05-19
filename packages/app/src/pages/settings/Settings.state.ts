import { i } from "@snappy/intl";
import { useStoreValue } from "@snappy/store";
import { $fog, $locale, $theme, useAsyncEffect, useGo } from "@snappy/ui";
import { useState } from "react";

import { Auth, t, trpc } from "../../core";
import { Routes } from "../../Routes";
import { $loggedIn } from "../../Store";

export const useSettingsState = () => {
  const go = useGo();
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
    setAiTunnelEnd(`${llm.aiTunnelDirect ? t(`settings.aiTunnel.mode.direct`) : t(`settings.aiTunnel.mode.proxy`)} ›`);
    setBalanceEnd(`${i.price(balance)} ›`);
    setLlmChatEnd(`${llm.llmChatModel} ›`);
    setLlmImageEnd(`${llm.llmImageModel} · ${llm.llmImageQuality} ›`);
    setLlmSpeechEnd(`${llm.llmSpeechRecognitionModel} ›`);
  }, [locale]);
  const toggleFog = () => $fog.set(!fog);

  const logoutOnClick = async () => {
    await Auth.signOut();
    $loggedIn.set(false);
    void go(Routes.login, { replace: true });
  };

  return {
    aiTunnelEnd,
    balanceEnd,
    fog,
    llmChatEnd,
    llmImageEnd,
    llmSpeechEnd,
    locale,
    logoutOnClick,
    theme,
    toggleFog,
  };
};
