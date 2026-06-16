import { type RouteStageProps, useRouteStageState } from "./RouteStage.state";
import { RouteStageView } from "./RouteStage.view";

export const RouteStage = (props: RouteStageProps) => <RouteStageView {...useRouteStageState(props)} />;
