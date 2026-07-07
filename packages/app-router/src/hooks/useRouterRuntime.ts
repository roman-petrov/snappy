import { useRequiredContext } from "@snappy/hooks";

import { RouterContext } from "../core";

export const useRouterRuntime = () => useRequiredContext(RouterContext, `useRouterRuntime`, `RouterContext`).runtime;
