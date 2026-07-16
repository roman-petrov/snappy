import { _ } from "@snappy/core";

import { Chip } from "./Chip";
import styles from "./Tabs.module.scss";

export type TabsProps<T extends string> = {
  disabled?: boolean;
  isActive?: (value: T) => boolean;
  onChange: (value: T) => void;
  options: readonly { label: string; title: string; value: T }[];
  stretch?: boolean;
  value: T;
};

export const Tabs = <T extends string>({
  disabled = false,
  isActive,
  onChange,
  options,
  stretch = false,
  value,
}: TabsProps<T>) => (
  <div className={_.cn(styles.tabs, stretch && styles.stretch)}>
    {options.map(option => (
      <Chip
        color={(isActive?.(option.value) ?? option.value === value) ? `accent` : `soft`}
        disabled={disabled}
        key={option.value}
        onClick={() => onChange(option.value)}
        text={option.label}
        tile
        tip={option.title}
      />
    ))}
  </div>
);
