import type { LucideIcon } from "lucide-react";

import type { Color } from "../$";

import { useTabPagerState } from "./TabPager.state";
import { TabPagerView } from "./TabPager.view";

export type TabPagerItem = { color: Color; icon: LucideIcon; id: string; label: string; path: string; tag?: string };

export type TabPagerProps = { items: TabPagerItem[] };

export const TabPager = (props: TabPagerProps) => <TabPagerView {...useTabPagerState(props)} />;
