import { useStoreValue } from "@snappy/store";
import { useLocation, useNavigate } from "react-router-dom";

import { api, t } from "../core";
import { $loggedIn } from "../Store";

export type HeaderItem =
  | { label: string; onClick: () => Promise<void>; type: `button` }
  | { label: string; to: string; type: `link` }
  | { type: `locale` }
  | { type: `theme` };

export const useHeaderContentState = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const headerItems: HeaderItem[] = useStoreValue($loggedIn)
    ? [
        {
          label: t(`logout`),
          onClick: async () => {
            await api.logout();
            $loggedIn.set(false);
            await navigate(`/login`, { replace: true, viewTransition: true });
          },
          type: `button`,
        },
        { type: `theme` },
        { type: `locale` },
      ]
    : [
        ...(location.pathname === `/login` ? [] : [{ label: t(`login`), to: `/login`, type: `link` as const }]),
        ...(location.pathname === `/register`
          ? []
          : [{ label: t(`register`), to: `/register`, type: `link` as const }]),
        { type: `theme` },
        { type: `locale` },
      ];

  return { headerItems };
};
