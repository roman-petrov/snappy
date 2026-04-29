import type { StaticFormPlan } from "../../../core";
import type { AgentComponentProps } from "../../../Types";

import { useStaticVisualAgentComponentState } from "./StaticVisualAgentComponent.state";
import { StaticVisualAgentComponentView } from "./StaticVisualAgentComponent.view";

export type StaticVisualAgentComponentProps = AgentComponentProps & {
  agentId: string;
  plan: StaticFormPlan;
  prompt: string;
};

export const StaticVisualAgentComponent = (props: StaticVisualAgentComponentProps) => (
  <StaticVisualAgentComponentView {...useStaticVisualAgentComponentState(props)} />
);
