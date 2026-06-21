import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { TabPagerProps } from "./TabPager";

import { Theme } from "../core/Theme";
import { useHasTouchInput } from "../hooks/useHasTouchInput";
import { useRouterGo, useRouterPath, useRouteStage } from "../router";
import { TabPagerDom } from "./TabPager.dom";

export const useTabPagerState = ({ activeId, ease, items }: TabPagerProps) => {
  const { contentRef, idlePage, layer, scrollPaddingBottom } = useRouteStage();
  const pathname = useRouterPath();
  const go = useRouterGo();
  const track = layer === undefined;
  const slides = layer !== `flip`;
  const contentDimmed = layer === `cover`;
  const touch = useHasTouchInput();
  const domRef = useRef<TabPagerDom>(undefined);
  const [settling, setSettling] = useState(false);
  const [barOffset, setBarOffset] = useState<number | undefined>(undefined);

  const navigate = useCallback(
    (target: string) => {
      void go(target, { replace: true });
    },
    [go],
  );

  domRef.current ??= TabPagerDom({ contentRef, setBarOffset, setSettling });

  const dom = domRef.current;

  const { barIndex, chromeColor, index, indicatorTints, panelTints } = dom.frame({
    activeId,
    barOffset,
    ease,
    items,
    navigate,
    pathname,
    touch,
  });

  const select = (id: string) => dom.select(id);

  useLayoutEffect(() => {
    dom.layout(slides);
  }, [dom, index, slides, touch]);

  useLayoutEffect(() => {
    if (track) {
      Theme.chrome(chromeColor);
    } else {
      Theme.resetChrome();
    }
  }, [chromeColor, track]);

  useEffect(() => (track && touch ? dom.pointer() : undefined), [dom, touch, track]);

  const { trackRef } = dom;

  const content = {
    contentDimmed,
    contentRef,
    idlePage,
    index,
    items,
    scrollPaddingBottom,
    settling,
    slides,
    trackRef,
  };

  return { animating: barOffset !== undefined, barIndex, content, indicatorTints, panelTints, select, track };
};
