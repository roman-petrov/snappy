import { useRequiredContext } from "../../hooks/useRequiredContext";
import { RouteStageContext } from "../RouteStageContext";

export const useRouteStage = () => useRequiredContext(RouteStageContext, `useRouteStage`, `RouteStageContext`);
