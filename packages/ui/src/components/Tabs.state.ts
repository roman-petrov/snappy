import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

import type { TabsProps } from "./Tabs";

export const useTabsState = <T extends string>({
  disabled = false,
  isActive,
  onChange,
  options,
  tabs = true,
  value,
}: TabsProps<T>) => {
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});

  useLayoutEffect(() => {
    if (!tabs || tabsRef.current === null) {
      return;
    }

    const selected = tabsRef.current.querySelector(`[aria-pressed="true"]`);

    if (!(selected instanceof HTMLElement)) {
      return;
    }

    setIndicatorStyle({ left: `${selected.offsetLeft}px`, width: `${selected.offsetWidth}px` });
  }, [options, tabs, value]);

  return { disabled, indicatorStyle, isActive, onChange, options, tabs, tabsRef, value };
};
