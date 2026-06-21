import { useRequiredContext } from "@snappy/hooks";

import { RouteStageContext } from "../core";

export const useRouteStage = () => useRequiredContext(RouteStageContext, `useRouteStage`, `RouteStageContext`);
