import { useCallback, useRef } from "react";

import { Chrome } from "../core";

export const useChromeAccentHost = (active = false) => {
  const unmount = useRef<(() => void) | undefined>(undefined);

  return useCallback(
    (node: HTMLElement | null) => {
      unmount.current?.();
      unmount.current = active && node !== null ? Chrome.mount(node) : undefined;
    },
    [active],
  );
};
