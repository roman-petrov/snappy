import { useSettingsPanelTabsState } from "./SettingsPanelTabs.state";
import { SettingsPanelTabsView } from "./SettingsPanelTabs.view";

export type SettingsPanelTabsProps<T extends string> = {
  disabled?: boolean;
  isActive?: (value: T) => boolean;
  onChange: (value: T) => void;
  options: readonly { label: string; title: string; value: T }[];
  tabs?: boolean;
  value: T;
};

export const SettingsPanelTabs = <T extends string>(props: SettingsPanelTabsProps<T>) => (
  <SettingsPanelTabsView {...useSettingsPanelTabsState(props)} />
);
