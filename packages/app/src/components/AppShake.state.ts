import { useRouterGo } from "@snappy/app-router";

import { r } from "../data";
import { Routes } from "../Routes";

export const useAppShakeState = () => {
  const go = useRouterGo();

  return { action: async () => go(Routes.snappy.chat), signedIn: r.auth };
};
