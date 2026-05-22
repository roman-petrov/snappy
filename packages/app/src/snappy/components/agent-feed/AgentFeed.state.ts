import { useImperativeHandle, useMemo, useState } from "react";

import type { AgentFeedProps } from "./AgentFeed";
import type { AgentFeedItem } from "./Types";

import { AgentFeedHandle } from "./AgentFeedHandle";

export const useAgentFeedState = ({ aiOptions, ref, typeWriterSpeed }: AgentFeedProps) => {
  const [entries, setEntries] = useState<AgentFeedItem[]>([]);

  const handle = useMemo(
    () => AgentFeedHandle({ aiOptions, commit: setEntries, typeWriterSpeed }),
    [aiOptions, typeWriterSpeed],
  );

  useImperativeHandle(ref, () => handle, [handle]);

  const rows = useMemo(() => handle.rows(entries), [handle, entries]);

  return { rows };
};
