import { TabButton } from "./TabButton";
import styles from "./Tabs.module.scss";

export type TabsProps<T extends string> = {
  disabled?: boolean;
  isActive?: (value: T) => boolean;
  onChange: (value: T) => void;
  options: readonly { label: string; title: string; value: T }[];
  value: T;
};

export const Tabs = <T extends string>({ disabled = false, isActive, onChange, options, value }: TabsProps<T>) => (
  <div className={styles.tabs}>
    {options.map(option => (
      <TabButton
        active={isActive?.(option.value) ?? option.value === value}
        disabled={disabled}
        key={option.value}
        onClick={() => onChange(option.value)}
        text={option.label}
        tip={option.title}
      />
    ))}
  </div>
);
