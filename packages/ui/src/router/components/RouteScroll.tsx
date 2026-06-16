import type { ReactNode, Ref } from "react";

import { useRouteScrollState } from "./RouteScroll.state";
import { RouteScrollView } from "./RouteScroll.view";

export type RouteScrollProps = { children: ReactNode; dimmed?: boolean; ref?: Ref<HTMLDivElement>; scroll?: boolean };

export const RouteScroll = (props: RouteScrollProps) => <RouteScrollView {...useRouteScrollState(props)} />;
