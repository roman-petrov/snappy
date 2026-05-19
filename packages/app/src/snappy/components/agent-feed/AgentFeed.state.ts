import { useImperativeHandle, useMemo, useRef, useState } from "react";

import type { AgentFeedProps } from "./AgentFeed";
import type { AgentFeedItem } from "./Types";

import { AgentFeedHandle } from "./AgentFeedHandle";

export const useAgentFeedState = ({ artifactSink, ref, ...rest }: AgentFeedProps) => {
  const [entries, setEntries] = useState<AgentFeedItem[]>([]);
  const sinkRef = useRef(artifactSink);
  sinkRef.current = artifactSink;

  const handle = useMemo(() => AgentFeedHandle({ commit: setEntries, getArtifactSink: () => sinkRef.current }), []);

  useImperativeHandle(ref, () => handle, [handle]);

  const rows = useMemo(() => handle.rows(entries), [handle, entries]);

  return { ...rest, rows };
};
