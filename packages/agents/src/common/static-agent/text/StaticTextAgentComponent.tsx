import type { StaticFormPlan } from "../../../core";
import type { AgentComponentProps } from "../../../Types";

import { useStaticTextAgentComponentState } from "./StaticTextAgentComponent.state";
import { StaticTextAgentComponentView } from "./StaticTextAgentComponent.view";

export type StaticTextAgentComponentProps = AgentComponentProps & {
  agentId: string;
  plan: StaticFormPlan;
  prompt: string;
};

export const StaticTextAgentComponent = (props: StaticTextAgentComponentProps) => (
  <StaticTextAgentComponentView {...useStaticTextAgentComponentState(props)} />
);
