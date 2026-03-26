import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

import type { SettingsPanelTabsProps } from "./SettingsPanelTabs";

export const useSettingsPanelTabsState = <T extends string>({
  disabled = false,
  isActive,
  onChange,
  options,
  tabs = true,
  value,
}: SettingsPanelTabsProps<T>) => {
  const segmentedRef = useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});

  useLayoutEffect(() => {
    if (!tabs || segmentedRef.current === null) {
      return;
    }

    const selected = segmentedRef.current.querySelector(`[aria-pressed="true"]`);

    if (!(selected instanceof HTMLElement)) {
      return;
    }

    setIndicatorStyle({ left: `${selected.offsetLeft}px`, width: `${selected.offsetWidth}px` });
  }, [options, tabs, value]);

  return { disabled, indicatorStyle, isActive, onChange, options, segmentedRef, tabs, value };
};
