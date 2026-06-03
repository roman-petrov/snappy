import { useAgentState } from "./Agent.state";
import { AgentView } from "./Agent.view";

export type AgentProps = { agentId: string };

export const Agent = (props: AgentProps) => <AgentView {...useAgentState(props)} />;
