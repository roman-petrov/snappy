import { i } from "@snappy/intl";
import { useStoreValue } from "@snappy/store";
import { $fog, $locale, $theme, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { api } from "../../core";

export const useSettingsState = () => {
  const [balanceEnd, setBalanceEnd] = useState(`›`);
  const [llmChatEnd, setLlmChatEnd] = useState(`›`);
  const [llmImageEnd, setLlmImageEnd] = useState(`›`);
  const [llmSpeechEnd, setLlmSpeechEnd] = useState(`›`);
  const fog = useStoreValue($fog);
  const theme = useStoreValue($theme);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => {
    const [bal, llm] = await Promise.all([api.balanceGet(), api.userLlmSettingsGet()]);
    setBalanceEnd(`${i.price(bal.balance)} ›`);
    if (llm.status === `ok`) {
      setLlmChatEnd(`${llm.llmChatModel} ›`);
      setLlmImageEnd(`${llm.llmImageModel} · ${llm.llmImageQuality} ›`);
      setLlmSpeechEnd(`${llm.llmSpeechRecognitionModel} ›`);
    }
  }, [locale]);
  const toggleFog = () => $fog.set(!fog);

  return { balanceEnd, fog, llmChatEnd, llmImageEnd, llmSpeechEnd, locale, theme, toggleFog };
};
