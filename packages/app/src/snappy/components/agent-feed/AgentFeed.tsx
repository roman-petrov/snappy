import type { StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";
import type { Ref } from "react";

import type { AgentFeedArtifactSink, AgentFeedHandle } from "./Types";

import { useAgentFeedState } from "./AgentFeed.state";
import { AgentFeedView } from "./AgentFeed.view";

export type AgentFeedProps = {
  artifactSink?: AgentFeedArtifactSink;
  onFormSubmit: (value: StaticFormAnswersOf<StaticFormPlan>) => void;
  ref?: Ref<AgentFeedHandle>;
};

export const AgentFeed = (props: AgentFeedProps) => <AgentFeedView {...useAgentFeedState(props)} />;
