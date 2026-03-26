import type { useSettingsPanelTabsState } from "./SettingsPanelTabs.state";

import { SettingsPanelButton } from "./SettingsPanelButton";
import styles from "./SettingsPanelTabs.module.scss";

export type SettingsPanelTabsViewProps<T extends string> = ReturnType<typeof useSettingsPanelTabsState<T>>;

export const SettingsPanelTabsView = <T extends string>({
  disabled,
  indicatorStyle,
  isActive,
  onChange,
  options,
  segmentedRef,
  tabs,
  value,
}: SettingsPanelTabsViewProps<T>) => (
  <div className={styles.segmented} ref={segmentedRef}>
    {tabs ? (
      <div className={styles.indicatorTrack}>
        <div className={styles.indicator} style={indicatorStyle} />
      </div>
    ) : undefined}
    {options.map(option => (
      <SettingsPanelButton
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
