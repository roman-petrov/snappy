import type { MouseEvent } from "react";

import { useStoreValue } from "@snappy/store";
import { Theme } from "@snappy/ui";
import { useLocation, useNavigate } from "react-router-dom";

import { api } from "../core/Api";
import { t } from "../core/Locale";
import { $loggedIn } from "../Store";

type HeaderItem =
  | { label: string; onClick: () => Promise<void>; type: `button` }
  | { label: string; to: string; type: `link` }
  | { type: `locale` };

export const useLayoutState = () => {
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
        { type: `locale` },
      ]
    : [
        ...(location.pathname === `/login` ? [] : [{ label: t(`login`), to: `/login`, type: `link` as const }]),
        ...(location.pathname === `/register`
          ? []
          : [{ label: t(`register`), to: `/register`, type: `link` as const }]),
        { type: `locale` },
      ];

  const logoOnClick = (event: MouseEvent) => {
    event.preventDefault();
    Theme.toggle();
  };

  return { headerItems, logoOnClick, logoTitle: t(`themeToggle`), logoTo: `/` as const };
};
