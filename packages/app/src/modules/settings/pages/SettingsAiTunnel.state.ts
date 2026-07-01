import { useEffect, useState } from "react";

import { $data } from "../../../data";

export const useSettingsAiTunnelState = () => {
  const { patch, settings } = $data.settings();
  const aiTunnelDirect = settings?.aiTunnelDirect ?? false;
  const loading = settings === undefined;
  const [tunnelKey, setTunnelKey] = useState(``);

  useEffect(() => {
    setTunnelKey(settings?.aiTunnelKey ?? ``);
  }, [settings?.aiTunnelKey]);

  const toggleDirect = () => {
    if (loading) {
      return;
    }
    void patch({ aiTunnelDirect: !aiTunnelDirect });
  };

  const tunnelKeyBlur = () => {
    if (loading || !aiTunnelDirect) {
      return;
    }
    void patch({ aiTunnelKey: tunnelKey });
  };

  return { aiTunnelDirect, loading, setTunnelKey, toggleDirect, tunnelKey, tunnelKeyBlur };
};
