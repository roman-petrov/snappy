import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Theme } from "../Theme";
import { clearToken, getToken } from "./Auth";
import { t } from "./Locale";

type HeaderItem =
  | { type: `button`; label: string; onClick: () => void }
  | { type: `link`; to: string; label: string }
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
        ...(location.pathname !== `/login` ? [{ type: `link` as const, to: `/login`, label: t(`login`) }] : []),
        ...(location.pathname !== `/register` ? [{ type: `link` as const, to: `/register`, label: t(`register`) }] : []),
        { type: `locale` },
      ];

  const logoOnClick = (e: MouseEvent) => {
    e.preventDefault();
    Theme.toggle();
  };

  return {
    headerItems,
    logoOnClick,
    logoTitle: t(`themeToggle`),
    logoTo: `/` as const,
  };
};
