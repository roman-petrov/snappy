import type { TabOption } from "./Tabs";
import type { useTabsState } from "./Tabs.state";

import styles from "./Tabs.module.scss";

type TabsViewProps<T extends string = string> = Omit<TabsViewPropsBase, `onTabClick` | `optionsWithTitle` | `value`> & {
  onTabClick: (value: T) => void;
  optionsWithTitle: (TabOption<T> & { title: string | undefined })[];
  value: T;
};

type TabsViewPropsBase = ReturnType<typeof useTabsState>;

export const TabsView = <T extends string = string>({
  ariaLabel,
  disabled,
  onTabClick,
  optionsWithTitle,
  rootClassName,
  rootStyle,
  value,
}: TabsViewProps<T>) => (
  <div aria-label={ariaLabel} className={`${styles.root} ${rootClassName}`.trim()} role="group" style={rootStyle}>
    <div aria-hidden="true" className={styles.indicatorTrack}>
      <span className={styles.indicator} />
    </div>
    {optionsWithTitle.map(opt => (
      <button
        aria-pressed={opt.value === value}
        className={styles.tab}
        disabled={disabled}
        key={opt.value}
        onClick={() => onTabClick(opt.value)}
        title={opt.title}
        type="button"
      >
        {opt.label}
      </button>
    ))}
  </div>
);
