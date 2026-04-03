import { useStoreValue } from "@snappy/store";
import { useGo } from "@snappy/ui";

import { api } from "../core";
import { Routes } from "../Routes";
import { $loggedIn } from "../Store";

export const useHeaderContentState = () => {
  const go = useGo();
  const loggedIn = useStoreValue($loggedIn);

  const logoutOnClick = loggedIn
    ? async () => {
        await api.logout();
        $loggedIn.set(false);
        void go(Routes.login, { replace: true });
      }
    : undefined;

  return { balanceVisible: loggedIn, logoutOnClick };
};
