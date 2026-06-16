import type { RouterRuntime } from "@snappy/router";

import { createContext } from "react";

export const RouterContext = createContext<RouterRuntime | undefined>(undefined);
