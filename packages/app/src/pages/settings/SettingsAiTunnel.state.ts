import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../../core";

export const useSettingsAiTunnelState = () => {
  const [aiTunnelDirect, setAiTunnelDirect] = useState(false);
  const [tunnelKey, setTunnelKey] = useState(``);
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    setLoading(true);
    const s = await trpc.user.settings.get.query();
    setAiTunnelDirect(s.aiTunnelDirect);
    setTunnelKey(s.aiTunnelKey);
    setLoading(false);
  }, []);

  const onToggleDirect = async (next: boolean) => {
    setAiTunnelDirect(next);
    await trpc.user.settings.set.mutate({ aiTunnelDirect: next });
  };

  const persistKeyOnBlur = async () => {
    if (loading || !aiTunnelDirect) {
      return;
    }
    await trpc.user.settings.set.mutate({ aiTunnelKey: tunnelKey });
    const s = await trpc.user.settings.get.query();
    setTunnelKey(s.aiTunnelKey);
  };

  return { aiTunnelDirect, loading, onToggleDirect, persistKeyOnBlur, setTunnelKey, tunnelKey };
};
