import { useStoreValue } from "@snappy/store";
import { useNavigate } from "react-router-dom";

import { api, t } from "../core";
import { $loggedIn } from "../Store";

export type LogoutItem = { label: string; onClick: () => Promise<void> };

export const useHeaderContentState = () => {
  const navigate = useNavigate();
  const loggedIn = useStoreValue($loggedIn);

  const logout: LogoutItem | undefined = loggedIn
    ? {
        label: t(`logout`),
        onClick: async () => {
          await api.logout();
          $loggedIn.set(false);
          await navigate(`/login`, { replace: true, viewTransition: true });
        },
      }
    : undefined;

  return { logout };
};
