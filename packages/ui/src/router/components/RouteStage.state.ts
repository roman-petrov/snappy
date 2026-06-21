import type { RouterPageState } from "@snappy/router";

import { useStoreValue } from "@snappy/store";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { TabPagerProps } from "../../components";
import type { ChromeRole, RouteStageValue } from "../RouteStageContext";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useRouter } from "../hooks/useRouter";
import { useRouterPath } from "../hooks/useRouterPath";
import { type RouteLayerOf, RouteOverlay } from "../RouteOverlay";
import { RouteTransition } from "../RouteTransition";
import { RouteUnderlay } from "../RouteUnderlay";

export type { RouteLayer, RouteLayerOf } from "../RouteOverlay";

export type RouteStageProps = { layerOf?: RouteLayerOf; tabs?: TabPagerProps };

type Chrome = { height: number; role: ChromeRole };

type Fade = `chrome` | `hidden` | `safeArea`;

export const useRouteStageState = ({ layerOf, tabs }: RouteStageProps) => {
  const mobile = useIsMobile();
  const [chrome, setChrome] = useState<Chrome | undefined>();
  const [overlayScope, setOverlayScope] = useState<string | undefined>();
  const { $page, parent, pattern, stateAt } = useRouter();
  const path = useRouterPath();
  const state = useStoreValue($page);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const topPaneRef = useRef<HTMLDivElement>(null);
  const preservedTab = useRef<RouterPageState | undefined>(undefined);
  const routePattern = pattern(path);
  const layer = layerOf?.(routePattern);

  const registerChrome = useCallback((role: ChromeRole, height: number) => {
    setChrome(previous => (previous?.role === role && previous.height === height ? previous : { height, role }));

    return () => {
      setChrome(previous => (previous?.role === role ? undefined : previous));
    };
  }, []);

  const chromeHeight = chrome?.height;
  const fade: Fade = chromeHeight === undefined ? (mobile ? `safeArea` : `hidden`) : `chrome`;
  const edge = mobile ? 8 : 16;
  const scrollPaddingBottom = chromeHeight === undefined ? edge : edge * 2 + chromeHeight;
  const scrollSafeArea = mobile && chromeHeight === undefined;

  const overlay = RouteOverlay.stage({
    current: state,
    layerOf,
    parent,
    path,
    pattern: routePattern,
    preserved: preservedTab.current,
    stateAt,
  });
  preservedTab.current = overlay.preserved;

  const underlay = RouteUnderlay.stage(layer, overlayScope);

  const stage: RouteStageValue = {
    contentRef,
    idlePage: overlay.idle,
    layer,
    registerChrome,
    scrollPaddingBottom,
    scrollSafeArea,
    slides: layer !== `flip`,
    underlay,
  };

  const onScopeRef = useRef(setOverlayScope);
  onScopeRef.current = setOverlayScope;

  useLayoutEffect(() => {
    RouteTransition.install({
      content: contentRef.current ?? undefined,
      onScope: scope => {
        onScopeRef.current(scope);
      },
      overlay: overlayRef.current ?? undefined,
    });
  }, []);

  useEffect(
    () => () => {
      RouteTransition.install({});
    },
    [],
  );

  useEffect(() => {
    topPaneRef.current?.scrollTo({ behavior: `instant`, left: 0, top: 0 });
    document.documentElement.scrollTo({ behavior: `instant`, left: 0, top: 0 });
  }, [path]);

  const overlayOpen = overlay.open || underlay.exiting;
  const { panes } = overlay;
  const page = state;

  return { fade, overlayOpen, overlayRef, page, panes, stage, tabs, topPaneRef };
};
