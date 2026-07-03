import { _, Cookie } from "@snappy/core";
import { useEffect, useState } from "react";

const consentCookie = `cookie-consent`;
const consentExpiresMs = _.day * _.daysInYear;

export const useCookieBannerState = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Cookie.value(document.cookie, consentCookie) === undefined) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    void cookieStore.set({ expires: _.now() + consentExpiresMs, name: consentCookie, path: `/`, value: `1` });
    setVisible(false);
  };

  return { accept, visible };
};
