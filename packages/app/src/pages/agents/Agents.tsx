import { useAgentsState } from "./Agents.state";
import { AgentsView } from "./Agents.view";

export const Agents = () => <AgentsView {...useAgentsState()} />;
