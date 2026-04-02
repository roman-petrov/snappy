import { useStoreValue } from "@snappy/store";
import { $fog, $locale, $theme, useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { api } from "../../core";

export const useSettingsState = () => {
  const [subscription, setSubscription] = useState<{ autoRenew?: boolean; premiumUntil?: number }>({});
  const fog = useStoreValue($fog);
  const theme = useStoreValue($theme);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => setSubscription(await api.subscriptionGet()), [locale]);
  const toggleFog = () => $fog.set(!fog);

  return { fog, locale, subscription, theme, toggleFog };
};
