import type { Ref } from "react";

import type { AgentFeedArtifactSink, AgentFeedHandle } from "./Types";

import { useAgentFeedState } from "./AgentFeed.state";
import { AgentFeedView } from "./AgentFeed.view";

export type AgentFeedProps = { artifactSink?: AgentFeedArtifactSink; ref?: Ref<AgentFeedHandle> };

export const AgentFeed = (props: AgentFeedProps) => <AgentFeedView {...useAgentFeedState(props)} />;
