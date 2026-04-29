import type { StaticFormPlan } from "../../../core";
import type { AgentComponentProps } from "../../../Types";

import { useStaticAudioAgentComponentState } from "./StaticAudioAgentComponent.state";
import { StaticAudioAgentComponentView } from "./StaticAudioAgentComponent.view";

export type StaticAudioAgentComponentProps = AgentComponentProps & {
  agentId: string;
  plan: StaticFormPlan;
  prompt: string;
};

export const StaticAudioAgentComponent = (props: StaticAudioAgentComponentProps) => (
  <StaticAudioAgentComponentView {...useStaticAudioAgentComponentState(props)} />
);
