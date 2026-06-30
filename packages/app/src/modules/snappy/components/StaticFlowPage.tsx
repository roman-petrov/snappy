import type { AgentEntry } from "@snappy/snappy";

import type { PresetFlowPageProps, PresetMeta } from "../core";

import { useStaticFlowPageState } from "./StaticFlowPage.state";
import { StaticFlowPageView } from "./StaticFlowPage.view";

export type StaticFlowPageProps = PresetFlowPageProps & { agent: AgentEntry; meta: PresetMeta };

export const StaticFlowPage = (props: StaticFlowPageProps) => <StaticFlowPageView {...useStaticFlowPageState(props)} />;
