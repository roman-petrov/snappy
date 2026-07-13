import type { RouterPageState } from "@snappy/router";

import { _ } from "@snappy/core";
import { useStoreValue } from "@snappy/store";
import { useCallback, useContext, useLayoutEffect, useRef, useState } from "react";

import type { RouteStageProps } from "./RouteStage";

import { Chrome, type ChromeScope, RouterContext, RouteStack, type RouteStageValue } from "../core";
import { useRouter } from "../hooks/useRouter";
import { useRouterPath } from "../hooks/useRouterPath";
import { useStageInsets } from "../hooks/useStageInsets";

export type { RouteLayer, RouteLayerOf } from "../core";

type ChromeInsets = Partial<Record<ChromeScope, number>>;

export const useRouteStageState = ({ content = false, track }: RouteStageProps) => {
  const { layerOf } = useContext(RouterContext) ?? {};
  const [chrome, setChrome] = useState<ChromeInsets>({});
  const [phase, setPhase] = useState<RouteStageValue[`motion`][`phase`]>({ closing: false, entering: false });
  const [flipAnimating, setFlipAnimating] = useState(false);
  const [shellDock, setShellDock] = useState<HTMLDivElement | undefined>();
  const [pageDock, setPageDock] = useState<HTMLDivElement | undefined>();
  const { $page, parent, pattern, stack, stateAt } = useRouter();
  const path = useRouterPath();
  const state = useStoreValue($page);
  const contentRef = useRef<HTMLDivElement>(null);
  const preservedTab = useRef<RouterPageState | undefined>(undefined);
  const underlayRef = useRef<RouterPageState | undefined>(undefined);
  const routePattern = pattern(path);
  const layer = layerOf?.(routePattern);

  useLayoutEffect(() => {
    Chrome.present(
      track !== undefined && (layer === undefined || (layer === `cover` && (phase.entering || phase.closing))),
    );
  }, [layer, phase, track]);

  const { insets, keyboard } = useStageInsets(chrome.shell, chrome.page);

  const registerChrome = useCallback((scope: ChromeScope, height: number) => {
    setChrome(previous => (previous[scope] === height ? previous : { ...previous, [scope]: height }));

    return () => {
      setChrome(previous =>
        previous[scope] === undefined
          ? previous
          : _.fromEntries(Object.entries(previous).filter(([key]) => key !== scope)),
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

  const { panes } = stageStack;

  const underlay = {
    contentDimmed: (layer === `cover` && !phase.entering) || phase.closing,
    shellPassive: layer === `cover` || phase.closing || phase.entering || flipAnimating,
  };

  const stage: RouteStageValue = {
    contentRef,
    insets,
    keyboard,
    layer,
    motion: { flipAnimating, phase, setFlipAnimating, setPhase },
    pageDock,
    pageDockRef,
    registerChrome,
    shellDock,
    shellDockRef,
    underlay,
  };

  const flipUnderlay = layer === `cover` && preservedTab.current === undefined;
  const slide = track !== undefined && layer !== `flip` && !flipUnderlay;
  const { idle } = stageStack;
  const contentPage = flipUnderlay ? (underlayRef.current ?? idle ?? state) : (idle ?? state);

  if (layer !== `cover`) {
    underlayRef.current = contentPage;
  }

  return { content, contentPage, panes, slide, stage, trackItems: track };
};
