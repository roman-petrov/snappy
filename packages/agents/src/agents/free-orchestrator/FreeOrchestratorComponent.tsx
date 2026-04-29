import type { AgentComponentProps } from "../../Types";

import { useFreeOrchestratorComponentState } from "./FreeOrchestratorComponent.state";
import { FreeOrchestratorComponentView } from "./FreeOrchestratorComponent.view";

export type FreeOrchestratorComponentProps = AgentComponentProps;

export const FreeOrchestratorComponent = (props: FreeOrchestratorComponentProps) => (
  <FreeOrchestratorComponentView {...useFreeOrchestratorComponentState(props)} />
);
