import type { Go } from "@snappy/router";

import { useRouterRuntime } from "./useRouterRuntime";

export const useRouterGo = (): Go => useRouterRuntime().go;
