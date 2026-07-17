import { useRouterGo } from "@snappy/app-router";
import { ShakeHost } from "@snappy/ui";

import { r } from "../data";
import { Routes } from "../Routes";

export const AppShake = () => {
  const go = useRouterGo();

  return <ShakeHost action={async () => go(Routes.snappy.chat)} signedIn={r.auth} />;
};
