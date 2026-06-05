import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../../core";

export const useSettingsAiTunnelState = () => {
  const [aiTunnelDirect, setAiTunnelDirect] = useState(false);
  const [tunnelKey, setTunnelKey] = useState(``);
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    setLoading(true);
    const settings = await trpc.user.settings.get.query();
    setAiTunnelDirect(settings.aiTunnelDirect);
    setTunnelKey(settings.aiTunnelKey);
    setLoading(false);
  }, []);

  const saveDirect = async (direct: boolean) => {
    setAiTunnelDirect(direct);
    await trpc.user.settings.set.mutate({ aiTunnelDirect: direct });
  };

  const persistKeyOnBlur = async () => {
    if (loading || !aiTunnelDirect) {
      return;
    }
    await trpc.user.settings.set.mutate({ aiTunnelKey: tunnelKey });
    const settings = await trpc.user.settings.get.query();
    setTunnelKey(settings.aiTunnelKey);
  };

  const toggleDirect = () => {
    if (loading) {
      return;
    }
    saveDirect(!aiTunnelDirect).catch(() => undefined);
  };

  const tunnelKeyBlur = () => {
    persistKeyOnBlur().catch(() => undefined);
  };

  return { aiTunnelDirect, loading, setTunnelKey, toggleDirect, tunnelKey, tunnelKeyBlur };
};
