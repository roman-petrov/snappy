/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PageProps, RouterPageState } from "@snappy/router";

import { _ } from "@snappy/core";
import { ThemeVar, useHasTouchInput } from "@snappy/hooks";
import { Cover, Flip, Slide } from "@snappy/motion";
import { Bridge } from "@snappy/platform";
import { useStoreValue } from "@snappy/store";
import {
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { RouteStageProps } from "./RouteStage";

import {
  Chrome,
  type ChromeScope,
  RouteMotion,
  RouterContext,
  RouteStack,
  type RouteStageValue,
  type TrackListener,
  type TrackLive,
} from "../core";
import { useRouter } from "../hooks/useRouter";
import { useRouterGo } from "../hooks/useRouterGo";
import { useRouterPath } from "../hooks/useRouterPath";
import { useStageInsets } from "../hooks/useStageInsets";
import { useTrackMotion } from "../hooks/useTrackMotion";

type ChromeInsets = Partial<Record<ChromeScope, number>>;

type CoverPaneItem = { fadeMinHeight: string; node: ReactNode; pattern: string; scrollPad: string; track: boolean };

type PaneInsets = { fadeMinHeight: string; scrollPad: string };

export const useRouteStageState = ({ content = false, track: trackItems = [] }: RouteStageProps) => {
  const { layerOf } = useContext(RouterContext) ?? {};
  const [chrome, setChrome] = useState<ChromeInsets>({});
  const [phase, setPhase] = useState<RouteStageValue[`motion`][`phase`]>({ closing: false, entering: false });
  const [flipAnimating, setFlipAnimating] = useState(false);
  const [shellDock, setShellDock] = useState<HTMLDivElement | undefined>();
  const [pageDock, setPageDock] = useState<HTMLDivElement | undefined>();
  const { $page, parent, pattern, stack, stateAt } = useRouter();
  const path = useRouterPath();
  const go = useRouterGo();
  const touch = useHasTouchInput();
  const state = useStoreValue($page);
  const stateRef = useRef(state);
  stateRef.current = state;
  const render = (pageState: RouterPageState | undefined): ReactNode =>
    pageState === undefined
      ? undefined
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        createElement(pageState.page as (props: PageProps) => ReactNode, pageState.params);

  const contentRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const basePaneRef = useRef<HTMLDivElement>(null);
  const preservedTab = useRef<RouterPageState | undefined>(undefined);
  const underlayRef = useRef<RouterPageState | undefined>(undefined);
  const routePattern = pattern(path);
  const layer = layerOf?.(routePattern);
  const track = trackItems.length > 0 ? trackItems : undefined;

  useLayoutEffect(() => {
    Chrome.present(
      track !== undefined && (layer === undefined || (layer === `cover` && (phase.entering || phase.closing))),
    );
  }, [layer, phase, track]);

  const { insets } = useStageInsets(chrome.shell, chrome.page);

  const registerChrome = useCallback((scope: ChromeScope, height: number) => {
    setChrome(previous => (previous[scope] === height ? previous : { ...previous, [scope]: height }));

    return () => {
      setChrome(previous =>
        previous[scope] === undefined ? previous : _.filterEntries(previous, key => key !== scope),
      );
    };
  }, []);

  const shellDockRef = useCallback((node: HTMLDivElement | null) => {
    setShellDock(node ?? undefined);
  }, []);

  const pageDockRef = useCallback((node: HTMLDivElement | null) => {
    setPageDock(node ?? undefined);
  }, []);

  const stageStack = RouteStack.stage({
    current: state,
    layerOf,
    parent,
    path,
    pattern: routePattern,
    patternAt: pattern,
    preserved: preservedTab.current,
    stack: stack(),
    stateAt,
  });

  if (layer === `flip`) {
    preservedTab.current = undefined;
  } else if (layer === undefined) {
    preservedTab.current = stageStack.preserved;
  }

  const { idle, panes } = stageStack;
  const paneCount = panes.length;
  const shallow = paneCount === 1;
  const shellPassive = layer === `cover` || phase.closing || phase.entering || flipAnimating;
  const flipUnderlay = layer === `cover` && preservedTab.current === undefined;
  const slide = track !== undefined && layer !== `flip` && !flipUnderlay;
  const contentPage = flipUnderlay ? (underlayRef.current ?? idle ?? state) : (idle ?? state);

  if (layer !== `cover`) {
    underlayRef.current = contentPage;
  }

  const cornerRadius = Bridge.screenCornerRadius();
  const frozenRef = useRef<Record<string, PaneInsets>>({});
  const edgeRef = useRef(``);
  const shallowRef = useRef(false);
  const stackPanes = panes.slice(-2);

  shallowRef.current = shallow;

  const coverRef = useRef<Cover>(undefined);
  const patterns = new Set(panes.map(({ pattern: panePattern }) => panePattern));
  frozenRef.current = _.filterEntries(frozenRef.current, panePattern => patterns.has(panePattern));

  for (const { pattern: panePattern } of stackPanes.slice(0, -1)) {
    frozenRef.current[panePattern] ??= { fadeMinHeight: insets.page.fadeMinHeight, scrollPad: insets.page.scrollPad };
  }

  const frozen = frozenRef.current;
  const { page: pageInsets, shell: shellInsets } = insets;

  const coverItems: CoverPaneItem[] = stackPanes.map((pane, index) => ({
    fadeMinHeight: frozen[pane.pattern]?.fadeMinHeight ?? pageInsets.fadeMinHeight,
    node: render(pane.state),
    pattern: pane.pattern,
    scrollPad: frozen[pane.pattern]?.scrollPad ?? pageInsets.scrollPad,
    track: index === stackPanes.length - 1,
  }));

  const underlayTargets = (): readonly HTMLElement[] => {
    const node = shallowRef.current ? contentRef.current : basePaneRef.current;

    return node === null ? [] : [node];
  };

  coverRef.current ??= Cover({
    drag: true,
    onDismiss: () => {
      void go(-1);
    },
    onMove: x => {
      const edge = x >= 1 ? `1` : `0`;
      const pane = paneRef.current;

      if (pane === null || edgeRef.current === edge) {
        return;
      }

      edgeRef.current = edge;
      ThemeVar.write(`overlay-edge`, edge, pane);
    },
    onPhase: setPhase,
    root: overlayRef,
    track: paneRef,
    underlay: { fade: () => shallowRef.current, targets: underlayTargets },
  });
  const cover = coverRef.current;
  const hasPanes = paneCount > 0;
  const overlayClosing = phase.closing;
  const overlayEntering = phase.entering;
  const overlayOpen = hasPanes || overlayClosing || overlayEntering;

  useEffect(() => RouteMotion.bindCover(cover), [cover]);
  useLayoutEffect(() => {
    if (!overlayOpen) {
      edgeRef.current = ``;
      cover.reset();
    }
  }, [cover, overlayOpen]);
  useTrackMotion(cover, hasPanes);

  const slideRef = useRef<Slide>(undefined);
  const lastIndexRef = useRef<number | undefined>(undefined);
  const itemsRef = useRef(trackItems);
  const liveRef = useRef<{ listeners: Set<TrackListener> }>({ listeners: new Set() });
  const liveApi = useRef<TrackLive>(undefined);

  liveApi.current ??= {
    subscribe: listener => {
      liveRef.current.listeners.add(listener);

      return () => {
        liveRef.current.listeners.delete(listener);
      };
    },
  };

  const emit = useCallback((value: number, moving: boolean) => {
    for (const listener of liveRef.current.listeners) {
      listener(value, moving);
    }
  }, []);

  const trackAt = useCallback(
    (itemPattern: string) => {
      const slot = trackItems.findIndex(item => pattern(item.path) === itemPattern);

      return slot === -1 ? undefined : slot;
    },
    [pattern, trackItems],
  );

  const index = slide
    ? (trackAt(routePattern) ??
      RouteStack.tabIndex(routePattern, stack(), trackAt) ??
      trackAt(RouteStack.tabRoot(routePattern, layerOf, parent)) ??
      lastIndexRef.current ??
      trackAt(`/`) ??
      0)
    : 0;

  if (slide) {
    lastIndexRef.current = index;
  }

  itemsRef.current = trackItems;

  if (slide) {
    slideRef.current ??= Slide({
      count: () => itemsRef.current.length,
      index,
      onIndex: target => {
        const targetPath = itemsRef.current[target]?.path;

        if (targetPath !== undefined) {
          void go(targetPath);
        }
      },
      onPageIndex: emit,
      root: contentRef,
      track: laneRef,
    });
  }

  const slideMotion = slideRef.current;

  if (slide && slideMotion !== undefined) {
    slideMotion.frame(touch);
  }

  useEffect(() => {
    if (!slide || slideMotion === undefined) {
      return undefined;
    }

    return RouteMotion.bindSlide(slideMotion, trackAt);
  }, [slide, slideMotion, trackAt]);

  useLayoutEffect(() => {
    if (!slide || slideMotion === undefined) {
      return;
    }

    slideMotion.sync(index);
    slideMotion.layout();
  }, [index, slide, slideMotion, touch]);

  useEffect(() => {
    if (!slide || slideMotion === undefined) {
      return undefined;
    }

    const unbindResize = slideMotion.resize();
    const unbindPointer = layer === undefined && touch ? slideMotion.pointer() : undefined;

    return () => {
      unbindResize();
      unbindPointer?.();
    };
  }, [layer, slide, slideMotion, touch]);

  const [outgoing, setOutgoing] = useState<RouterPageState | undefined>();
  const hostRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<Flip>(undefined);

  if (!slide) {
    flipRef.current ??= Flip({ host: inRef, onAnimating: setFlipAnimating, outgoing: outRef, root: hostRef });
  }

  const flip = flipRef.current;

  useEffect(() => {
    if (slide || flip === undefined) {
      return undefined;
    }

    return RouteMotion.bindFlip(flip, () => stateRef.current, setOutgoing);
  }, [flip, slide]);

  const stage: RouteStageValue = {
    contentRef,
    insets,
    layer,
    motion: { flipAnimating, phase, setFlipAnimating, setPhase },
    pageDock,
    pageDockRef,
    registerChrome,
    shellDock,
    shellDockRef,
    shellPassive,
    track: slide ? { index, live: liveApi.current } : undefined,
  };

  const baseRef = shallow ? undefined : basePaneRef;
  const nested = paneCount > 1;
  const pageNode = content ? undefined : render(contentPage);
  const outgoingNode = render(outgoing);
  const laneCount = slide ? trackItems.length : 1;
  const lanes = slide ? trackItems.map(item => ({ node: render(stateAt(item.path)), path: item.path })) : undefined;
  const pageHostDimmed = shallow;
  const laneInsets = layer === `flip` ? pageInsets : shellInsets;
  const scrollPaddingBottom = laneInsets.scrollPad;
  const shellFadeMinHeight = laneInsets.fadeMinHeight;

  return {
    baseRef,
    content,
    contentRef,
    cornerRadius,
    coverItems,
    hostRef,
    inRef,
    laneCount,
    laneRef,
    lanes,
    nested,
    outgoingNode,
    outRef,
    overlayClosing,
    overlayEntering,
    overlayOpen,
    overlayRef,
    pageDockRef,
    pageHostDimmed,
    pageNode,
    paneRef,
    scrollPaddingBottom,
    shellDockRef,
    shellFadeMinHeight,
    slide,
    stage,
  };
};
