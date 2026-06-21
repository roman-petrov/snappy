import { useCallback, useLayoutEffect, useState } from "react";

import type { PageChromeProps } from "./PageChrome";

import { useMeasure } from "../hooks/useMeasure";
import { useRouteStage } from "../router/hooks";

export const usePageChromeState = ({ active = false, fixed = true, role, ...rest }: PageChromeProps) => {
  const { registerChrome, underlay } = useRouteStage();
  const reserve = active && role === `shell`;
  const passive = role === `shell` && underlay.shellPassive;
  const [element, setElement] = useState<HTMLDivElement | undefined>();
  const { height } = useMeasure(element, reserve);

  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(node ?? undefined);
  }, []);

  useLayoutEffect(() => (reserve ? registerChrome(role, height) : undefined), [height, registerChrome, reserve, role]);

  return { ...rest, fixed, hidden: false, passive, ref };
};
