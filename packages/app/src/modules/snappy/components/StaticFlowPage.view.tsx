import { Page } from "@snappy/ui";

import type { useStaticFlowPageState } from "./StaticFlowPage.state";

import { BalanceTap } from "../../../components";
import { AgentChat } from "./agent-feed/AgentChat";
import { PresetMetaPageTitle } from "./PresetMetaPageTitle";

export type StaticFlowPageViewProps = ReturnType<typeof useStaticFlowPageState>;

export const StaticFlowPageView = ({ chatProps, title }: StaticFlowPageViewProps) => (
  <Page back title={<PresetMetaPageTitle {...title} />} trailing={<BalanceTap />}>
    <AgentChat {...chatProps} />
  </Page>
);
