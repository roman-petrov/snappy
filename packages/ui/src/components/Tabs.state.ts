import type { TabOption, TabsProps } from "./Tabs";

import { AndroidBridge } from "../AndroidBridge";

export const useTabsState = <T extends string = string>({
  ariaLabel,
  cn,
  disabled = false,
  onChange,
  options,
  value,
}: TabsProps<T>) => {
  const index = Math.max(
    0,
    options.findIndex(opt => opt.value === value),
  );

  const onTabClick = (tabValue: T) => {
    AndroidBridge.hapticImpact(`segmentTick`);
    onChange(tabValue);
  };

  const optionsWithTitle: (TabOption<T> & { title: string | undefined })[] = options.map(opt => ({
    ...opt,
    title: typeof opt.label === `string` ? opt.label : undefined,
  }));

  const rootClassName = (cn ?? ``).trim();
  const rootStyle = { "--tab-count": options.length, "--tab-index": index } as Record<string, number>;

  return { ariaLabel, disabled, index, onTabClick, optionsWithTitle, rootClassName, rootStyle, value };
};
