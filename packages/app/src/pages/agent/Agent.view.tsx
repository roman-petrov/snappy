import { Page } from "@snappy/ui";
import { Navigate } from "react-router-dom";

import type { useAgentState } from "./Agent.state";

import { Routes } from "../../Routes";
import { AgentChat } from "../../snappy/components";

export type AgentViewProps = ReturnType<typeof useAgentState>;

export const AgentView = ({ chatProps, title }: AgentViewProps) =>
  title === undefined || chatProps === undefined ? (
    <Navigate replace to={Routes.home} />
  ) : (
    <Page title={title}>
      <AgentChat {...chatProps} />
    </Page>
  );
