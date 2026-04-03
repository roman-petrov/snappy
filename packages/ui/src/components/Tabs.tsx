import { useTabsState } from "./Tabs.state";
import { TabsView } from "./Tabs.view";

export type TabsProps<T extends string> = {
  disabled?: boolean;
  isActive?: (value: T) => boolean;
  onChange: (value: T) => void;
  options: readonly { label: string; title: string; value: T }[];
  tabs?: boolean;
  value: T;
};

export const Tabs = <T extends string>(props: TabsProps<T>) => <TabsView {...useTabsState(props)} />;
