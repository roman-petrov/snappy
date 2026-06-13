import type { TypeWriterSpeed } from "@snappy/domain";
import type { Ref } from "react";

import type { AgentFeedHandle } from "./AgentFeedHandle";

import { useAgentFeedState } from "./AgentFeed.state";
import { AgentFeedView } from "./AgentFeed.view";

export type AgentFeedProps = { ref?: Ref<AgentFeedHandle>; typeWriterSpeed?: TypeWriterSpeed };

export const AgentFeed = (props: AgentFeedProps) => <AgentFeedView {...useAgentFeedState(props)} />;
