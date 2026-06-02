import { i } from "@snappy/intl";
import { useStoreValue } from "@snappy/store";
import { $fog, $locale, $theme, useAsyncEffect, useGo } from "@snappy/ui";
import { useState } from "react";

import { Auth, t, trpc, type UserSettings } from "../../core";
import { Routes } from "../../Routes";
import { $signedIn } from "../../Store";

export const useSettingsState = () => {
  const go = useGo();
  const [aiTunnelEnd, setAiTunnelEnd] = useState<string>();
  const [balanceEnd, setBalanceEnd] = useState<string>();
  const [llmChatEnd, setLlmChatEnd] = useState<string>();
  const [llmImageEnd, setLlmImageEnd] = useState<string>();
  const [llmSpeechEnd, setLlmSpeechEnd] = useState<string>();
  const [typeWriterSpeed, setTypeWriterSpeed] = useState<UserSettings[`typeWriterSpeed`]>(undefined);
  const fog = useStoreValue($fog);
  const theme = useStoreValue($theme);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => {
    const [balance, llm] = await Promise.all([trpc.user.balance.query(), trpc.user.settings.get.query()]);
    setAiTunnelEnd(llm.aiTunnelDirect ? t(`settings.aiTunnel.mode.direct`) : t(`settings.aiTunnel.mode.proxy`));
    setBalanceEnd(i.price(balance));
    setLlmChatEnd(llm.llmChatModel);
    setLlmImageEnd(`${llm.llmImageModel} · ${llm.llmImageQuality}`);
    setLlmSpeechEnd(llm.llmSpeechRecognitionModel);
    setTypeWriterSpeed(llm.typeWriterSpeed);
  }, [locale]);
  const toggleFog = () => $fog.set(!fog);

  const signOutOnClick = async () => {
    await Auth.signOut();
    $signedIn.set(false);
    void go(Routes.signIn, { replace: true });
  };

  return {
    aiTunnelEnd,
    balanceEnd,
    fog,
    llmChatEnd,
    llmImageEnd,
    llmSpeechEnd,
    locale,
    signOutOnClick,
    theme,
    toggleFog,
    typeWriterSpeed,
  };
};
