import { useTabTrack } from "@snappy/app-router";

import type { TabPagerProps } from "./TabPager";

import styles from "./TabPager.module.scss";

export const useTabPagerState = ({ items }: TabPagerProps) =>
  useTabTrack(items, (bar, pageIndex, animating) => {
    bar.style.setProperty(`--tab-index`, `${pageIndex}`);
    bar.classList.toggle(styles.barAnimating, animating);
  });
