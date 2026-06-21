import { useTrack } from "@snappy/app-router";
import { ThemeVar } from "@snappy/hooks";
import { useLayoutEffect } from "react";

import type { TabPagerProps } from "./TabPager";

import { Theme } from "../core/Theme";
import { TabPagerLogic } from "./TabPager.logic";

export const useTabPagerState = ({ items }: TabPagerProps) => {
  const { animating, pageIndex } = useTrack();
  const accents = items.map(item => ThemeVar.accent(item.color));
  const backdrop = ThemeVar.ref(`color-backdrop`);
  const { chromeColor, indicatorTints, panelTints } = TabPagerLogic.chromeFrame(accents, backdrop, pageIndex);

  useLayoutEffect(() => {
    Theme.chrome(chromeColor);
  }, [chromeColor]);

  return { animating, indicatorTints, items, pageIndex, panelTints };
};
