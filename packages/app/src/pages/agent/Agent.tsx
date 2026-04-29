import { useAgentState } from "./Agent.state";
import { AgentView } from "./Agent.view";

export const Agent = () => <AgentView {...useAgentState()} />;
