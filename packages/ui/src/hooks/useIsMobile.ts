import { _ } from "@snappy/core";

import { useMediaQuery } from "./useMediaQuery";

const readMobileBreakpoint = () => {
  if (typeof window === `undefined`) {
    return 0;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-mobile`).trim();
  const parsed = _.dec(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const useIsMobile = () => useMediaQuery(`(max-width: ${readMobileBreakpoint()}px)`);
