import { useLocation } from "wouter";

import { api, t } from "../core";
import { $loggedIn } from "../Store";

export type LogoutItem = { label: string; onClick: () => Promise<void> };

export const useHeaderContentState = () => {
  const [, navigate] = useLocation();
  const loggedIn = $loggedIn.value;

  const logout: LogoutItem | undefined = loggedIn
    ? {
        label: t(`logout`),
        onClick: async () => {
          await api.logout();
          $loggedIn.value = false;
          navigate(`/login`, { replace: true });
        },
      }
    : undefined;

  return { logout };
};
