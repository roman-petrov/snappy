import type { RouterRuntime } from "@snappy/router";

import { createContext } from "react";

import type { RouteLayerOf } from "./RouteStack";

export type RouterContextValue = { layerOf?: RouteLayerOf; runtime: RouterRuntime };

export const RouterContext = createContext<RouterContextValue | undefined>(undefined);
