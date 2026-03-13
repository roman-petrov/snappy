import type { ReactNode } from "react";

import { useTabsState } from "./Tabs.state";
import { TabsView } from "./Tabs.view";

export type TabOption<T extends string = string> = { label: ReactNode; value: T };

export type TabsProps<T extends string = string> = {
  ariaLabel?: string;
  cn?: string;
  disabled?: boolean;
  onChange: (value: T) => void;
  options: TabOption<T>[];
  value: T;
};

export const Tabs = <T extends string = string>(props: TabsProps<T>) => <TabsView {...useTabsState(props)} />;
