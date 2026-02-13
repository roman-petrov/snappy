import type { MouseEvent } from "react";

import { Theme } from "@snappy/ui";
import { useLocation, useNavigate } from "react-router-dom";

import { clearToken, getToken } from "../core/Auth";
import { t } from "../core/Locale";

type HeaderItem =
  | { label: string; onClick: () => void; type: `button` }
  | { label: string; to: string; type: `link` }
  | { type: `locale` };

export const useLayoutState = () => {
  const token = getToken();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = token !== undefined;

  const headerItems: HeaderItem[] = isAuth
    ? [
        {
          label: t(`logout`),
          onClick: () => {
            clearToken();
            navigate(`/login`, { replace: true, viewTransition: true });
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
