import type { ReadonlyStore } from "@snappy/core";
import type { MetricsProvider } from "@snappy/metrics";

import { useMetricsRouteState } from "./MetricsRoute.state";
import { MetricsRouteView } from "./MetricsRoute.view";

export type MetricsRouteProps = { metrics: readonly MetricsProvider[]; signedIn?: ReadonlyStore<boolean> };

export const MetricsRoute = (props: MetricsRouteProps) => <MetricsRouteView {...useMetricsRouteState(props)} />;
