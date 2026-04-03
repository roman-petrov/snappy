import { _ } from "@snappy/core";
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
      return _.noop;
    }

    const root = tabsRef.current;

    const syncIndicator = () => {
      const selected = root.querySelector(`[aria-pressed="true"]`);

      if (!(selected instanceof HTMLElement)) {
        return;
      }

      setIndicatorStyle({
        height: `${selected.offsetHeight}px`,
        left: `${selected.offsetLeft}px`,
        top: `${selected.offsetTop}px`,
        width: `${selected.offsetWidth}px`,
      });
    };

    syncIndicator();

    const observer = new ResizeObserver(syncIndicator);

    observer.observe(root);

    return () => observer.disconnect();
  }, [options, tabs, value]);

  return { disabled, indicatorStyle, isActive, onChange, options, tabs, tabsRef, value };
};
