import { useImperativeHandle, useMemo, useRef, useState } from "react";

import type { AgentFeedProps } from "./AgentFeed";
import type { AgentFeedItem } from "./Types";

import { AgentFeedInterface } from "./AgentFeedInterface";

export type { AgentFeedRow } from "./AgentFeedInterface";

export const useAgentFeedState = ({ artifactSink, ref, ...rest }: AgentFeedProps) => {
  const [entries, setEntries] = useState<AgentFeedItem[]>([]);
  const sinkRef = useRef(artifactSink);
  sinkRef.current = artifactSink;

  const core = useMemo(() => AgentFeedInterface({ commit: setEntries, getArtifactSink: () => sinkRef.current }), []);

  useImperativeHandle(ref, () => core.handle, [core]);

  const rows = useMemo(() => core.rows(entries), [core, entries]);

  return { ...rest, rows };
};
