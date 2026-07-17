import { useStoreValue } from "@snappy/store";
import { $locale, $theme, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { r } from "../../../data";

export const useSettingsState = () => {
  const [email, setEmail] = useState<string>();
  const [settings] = r.settings();
  const theme = useStoreValue($theme);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => setEmail((await r.auth.user())?.email), [locale]);

  const aiTunnelDirect = settings?.aiTunnelDirect;
  const llmChatEnd = settings?.llmChatModel;
  const llmImageEnd = settings === undefined ? undefined : `${settings.llmImageModel} · ${settings.llmImageQuality}`;
  const llmSpeechEnd = settings?.llmSpeechRecognitionModel;
  const llmVisionEnd = settings?.llmVisionModel;
  const typeWriterSpeed = settings?.typeWriterSpeed;

  return { aiTunnelDirect, email, llmChatEnd, llmImageEnd, llmSpeechEnd, llmVisionEnd, locale, theme, typeWriterSpeed };
};
