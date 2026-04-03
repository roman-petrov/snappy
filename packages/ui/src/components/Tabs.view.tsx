import type { useTabsState } from "./Tabs.state";

import { TabButton } from "./TabButton";
import styles from "./Tabs.module.scss";

export type TabsViewProps<T extends string> = ReturnType<typeof useTabsState<T>>;

export const TabsView = <T extends string>({
  disabled,
  indicatorStyle,
  isActive,
  onChange,
  options,
  tabs,
  tabsRef,
  value,
}: TabsViewProps<T>) => (
  <div className={styles.tabs} ref={tabsRef}>
    {tabs ? (
      <div className={styles.indicatorTrack}>
        <div className={styles.indicator} style={indicatorStyle} />
      </div>
    ) : undefined}
    {options.map(option => (
      <TabButton
        active={isActive?.(option.value) ?? option.value === value}
        disabled={disabled}
        key={option.value}
        onClick={() => onChange(option.value)}
        text={option.label}
        tip={option.title}
        toggle={!tabs}
      />
    ))}
  </div>
);
