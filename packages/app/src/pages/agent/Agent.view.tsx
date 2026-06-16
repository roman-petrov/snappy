import { Page, Redirect } from "@snappy/ui";

import type { useAgentState } from "./Agent.state";

import { BalanceTap } from "../../components";
import { Routes } from "../../Routes";
import { AgentChat } from "../../snappy/components";
import { AgentPageTitle } from "./AgentPageTitle";

export type AgentViewProps = ReturnType<typeof useAgentState>;

export const AgentView = ({ agent, chatProps }: AgentViewProps) =>
  agent === undefined || chatProps === undefined ? (
    <Redirect to={Routes.$.home} />
  ) : (
    <Page back title={<AgentPageTitle emoji={agent.meta.emoji} title={agent.meta.title} />} trailing={<BalanceTap />}>
      <AgentChat {...chatProps} />
    </Page>
  );
