import { useRouterGo } from "@snappy/app-router";
import { Dom } from "@snappy/browser";
import { Bridge } from "@snappy/platform";
import { useEffect } from "react";

import { AppBase } from "../AppBase";

export const useAppExternalReturnState = () => {
  const go = useRouterGo();

  useEffect(
    () =>
      Dom.subscribe(window, Bridge.externalReturnEvent, event => {
        const url = new URL(event.detail.url);
        const base = AppBase.url(``);

        const path =
          url.pathname === base || url.pathname.startsWith(`${base}/`)
            ? url.pathname.slice(base.length) || `/`
            : url.pathname;
        void go(`${path}${url.search}`, { instant: true, replace: true });
      }),
    [go],
  );

  return {};
};
