import { ThemeVar, useRequiredContext } from "@snappy/hooks";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { Chrome, RouteStageContext } from "../core";

type TabFrame = (bar: HTMLElement, pageIndex: number, animating: boolean) => void;

export const useTabTrack = <TItem extends { color: string }>(items: readonly TItem[], onFrame: TabFrame) => {
  const { track } = useRequiredContext(RouteStageContext, `useTabTrack`, `RouteStageContext`);

  if (track === undefined) {
    throw new Error(`useTabTrack must be used within a RouteStage slide track`);
  }

  const { index, live } = track;
  const accents = useMemo(() => items.map(item => ThemeVar.accent(item.color)), [items]);
  const barRef = useRef<HTMLDivElement | null>(null);
  const unmount = useRef<(() => void) | undefined>(undefined);

  const apply = useCallback(
    (pageIndex: number, animating = false) => {
      Chrome.slide(accents, pageIndex);

      if (barRef.current !== null) {
        onFrame(barRef.current, pageIndex, animating);
      }
    },
    [accents, onFrame],
  );

  const bar = useCallback((node: HTMLDivElement | null) => {
    barRef.current = node;
    unmount.current?.();
    unmount.current = node === null ? undefined : Chrome.mount(node);
  }, []);

  useLayoutEffect(() => {
    apply(index);
  }, [apply, index]);

  useEffect(() => live.subscribe(apply), [apply, live]);

  return { bar, items };
};
