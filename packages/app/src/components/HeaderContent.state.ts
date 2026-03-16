import { useStoreValue } from "@snappy/store";
import { useGo } from "@snappy/ui";

import { api } from "../core";
import { $loggedIn } from "../Store";

export const useHeaderContentState = () => {
  const go = useGo();
  const loggedIn = useStoreValue($loggedIn);

  const logoutOnClick = loggedIn
    ? async () => {
        await api.logout();
        $loggedIn.set(false);
        void go(`/login`, { replace: true });
      }
    : undefined;

  return { logoutOnClick };
};
