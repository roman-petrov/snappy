import type { Action } from "@snappy/core";
import type { RouterPageState } from "@snappy/router";

import { createContext, type RefObject } from "react";

import type { RouteLayer } from "./RouteOverlay";

export type ChromeRole = `page` | `shell`;

export type RouteStageValue = {
  contentRef: RefObject<HTMLDivElement | null>;
  idlePage?: RouterPageState;
  layer: RouteLayer | undefined;
  registerChrome: (role: ChromeRole, height: number) => Action;
  scrollPaddingBottom: number;
  scrollSafeArea: boolean;
  shellBarHidden: boolean;
};

export const RouteStageContext = createContext<RouteStageValue | undefined>(undefined);
