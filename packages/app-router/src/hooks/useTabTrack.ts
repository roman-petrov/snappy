import { ThemeVar, useRequiredContext } from "@snappy/hooks";
import { useLayoutEffect, useMemo } from "react";

import { Chrome, RouteStageContext } from "../core";

export const useTabTrack = <TItem extends { color: string }>(items: readonly TItem[]) => {
  const { track } = useRequiredContext(RouteStageContext, `useTabTrack`, `RouteStageContext`);

  if (track === undefined) {
    throw new Error(`useTabTrack must be used within a RouteStage slide track`);
  }

  const { animating, pageIndex } = track;
  const accents = useMemo(() => items.map(item => ThemeVar.accent(item.color)), [items]);
  const accent = useMemo(() => Chrome.blend(accents, pageIndex), [accents, pageIndex]);
  const opacities = useMemo(() => Chrome.opacities(items.length, pageIndex), [items.length, pageIndex]);

  useLayoutEffect(() => {
    Chrome.publish(accent);
  }, [accent]);

  return { animating, items, opacities, pageIndex };
};
