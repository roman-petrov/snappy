import { CookieConsent } from "@snappy/ui-core";
import { useEffect, useState } from "react";

export const useCookieBannerState = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (CookieConsent.missing()) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    CookieConsent.accept();
    setVisible(false);
  };

  return { accept, visible };
};
