import { useRouterGo, useRouterRuntime } from "@snappy/app-router";
import { Dom } from "@snappy/browser";
import { useEffect } from "react";

import { AnchorNavigation } from "../core/AnchorNavigation";

export const useAnchorNavigation = () => {
  const go = useRouterGo();
  const runtime = useRouterRuntime();
  const base = AnchorNavigation.base(runtime.href(`/`));

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const route = AnchorNavigation.fromClick(event, base, pathname => runtime.stateAt(pathname));
      if (route === undefined) {
        return;
      }

      event.preventDefault();
      void go(route);
    };

    return Dom.subscribe(document, `click`, onClick);
  }, [base, go, runtime]);
};
