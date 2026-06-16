import type { Ease } from "@snappy/core";
import type { LucideIcon } from "lucide-react";

import type { Color } from "../$";

import { useTabPagerState } from "./TabPager.state";
import { TabPagerView } from "./TabPager.view";

export type TabPagerItem = { color: Color; icon: LucideIcon; id: string; label: string; path: string };

export type TabPagerProps = { activeId?: string; ease: Ease; items: TabPagerItem[] };

export const TabPager = (props: TabPagerProps) => <TabPagerView {...useTabPagerState(props)} />;
