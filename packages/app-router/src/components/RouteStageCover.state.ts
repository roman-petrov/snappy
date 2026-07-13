import { ThemeVar } from "@snappy/hooks";
import { Cover, type Cover as CoverMotion } from "@snappy/motion";
import { Bridge } from "@snappy/platform";
import { useEffect, useLayoutEffect, useRef } from "react";

import type { RouteStageCoverProps } from "./RouteStageCover";

import { type OverlayPane, RouteMotion } from "../core";
import { useRouterGo } from "../hooks/useRouterGo";
import { useRouteStage } from "../hooks/useRouteStage";
import { useTrackMotion } from "../hooks/useTrackMotion";

type CoverPaneItem = { base: boolean; fadeMinHeight: string; pane: OverlayPane; scrollPad: string; track: boolean };

type PaneInsets = { fadeMinHeight: string; scrollPad: string };

export const useRouteStageCoverState = ({ panes }: RouteStageCoverProps) => {
  const {
    insets,
    keyboard,
    motion: { phase, setPhase },
    pageDockRef,
  } = useRouteStage();

  const cornerRadius = Bridge.screenCornerRadius();
  const go = useRouterGo();
  const overlayRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const frozenRef = useRef<Record<string, PaneInsets>>({});
  const paneCount = panes.length;
  const frameRef = useRef({ count: paneCount, index: Math.max(0, paneCount - 1) });
  const coverRef = useRef<CoverMotion>(undefined);

  frameRef.current = { count: paneCount, index: Math.max(0, paneCount - 1) };

  const patterns = new Set(panes.map(({ pattern }) => pattern));
  frozenRef.current = Object.fromEntries(
    Object.entries(frozenRef.current).filter(([pattern]) => patterns.has(pattern)),
  );

  for (const { pattern } of panes.slice(0, -1)) {
    frozenRef.current[pattern] ??= { fadeMinHeight: insets.page.fadeMinHeight, scrollPad: insets.page.scrollPad };
  }

  const live = insets.page;

  const items: CoverPaneItem[] = panes.map((pane, index) => {
    const frozen = frozenRef.current[pane.pattern];

    return {
      base: frozen !== undefined,
      fadeMinHeight: frozen?.fadeMinHeight ?? live.fadeMinHeight,
      pane,
      scrollPad: frozen?.scrollPad ?? live.scrollPad,
      track: index === panes.length - 1,
    };
  });

  coverRef.current ??= Cover({
    count: () => frameRef.current.count,
    drag: true,
    onClose: () => {
      void go(-1);
    },
    onIndex: target => {
      if (target < frameRef.current.index) {
        void go(-1);
      }
    },
    onMove: x => {
      if (paneRef.current !== null) {
        ThemeVar.write(`overlay-edge`, x >= 1 ? `1` : `0`, paneRef.current);
      }
    },
    onPhase: setPhase,
    root: overlayRef,
    track: paneRef,
  });
  const cover = coverRef.current;
  const hasPanes = paneCount > 0;
  const overlayOpen = hasPanes || phase.closing || phase.entering;

  useEffect(() => RouteMotion.bindCover(cover), [cover]);

  useLayoutEffect(() => {
    if (hasPanes && !cover.entering() && !cover.closing()) {
      cover.layout();
    }
  }, [cover, hasPanes, paneCount]);

  useTrackMotion(cover, hasPanes);

  return {
    cornerRadius,
    items,
    keyboard,
    overlayClosing: phase.closing,
    overlayEntering: phase.entering,
    overlayOpen,
    overlayRef,
    pageDockRef,
    paneRef,
  };
};
