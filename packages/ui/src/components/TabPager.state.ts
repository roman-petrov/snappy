import { useTabTrack } from "@snappy/app-router";

import type { TabPagerProps } from "./TabPager";

export const useTabPagerState = ({ items }: TabPagerProps) => useTabTrack(items);
