import { MediaQuery, ThemeVar } from "@snappy/browser";
import { _, Browser } from "@snappy/core";

import { Bridge } from "./Bridge";

export type Platform = `desktop-web` | `mobile-web` | `native`;

export const Platform = (): Platform =>
  Bridge.available
    ? `native`
    : Browser.mobile(typeof navigator === `undefined` ? `` : navigator.userAgent) ||
        MediaQuery.matches(`(max-width: ${_.px(ThemeVar.mobileBreakpoint())})`)
      ? `mobile-web`
      : `desktop-web`;
