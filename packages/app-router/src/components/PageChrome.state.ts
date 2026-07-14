import { useMeasure } from "@snappy/hooks";
import { useCallback, useLayoutEffect, useState } from "react";

import type { PageChromeProps } from "./PageChrome";

import { useRouteStage } from "../hooks";

export const usePageChromeState = ({ active = false, shell = false, ...rest }: PageChromeProps) => {
  const { insets, pageDock, registerChrome, shellDock, shellPassive } = useRouteStage();
  const passive = shell && shellPassive;
  const target = shell ? shellDock : pageDock;
  const [element, setElement] = useState<HTMLDivElement | undefined>();
  const { height } = useMeasure(element, active);

  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(node ?? undefined);
  }, []);

  const scope = shell ? `shell` : `page`;

  useLayoutEffect(() => (active ? registerChrome(scope, height) : undefined), [active, height, registerChrome, scope]);

  return { ...rest, active, dockPad: insets.dockPad, hidden: target === undefined, passive, ref, target };
};
