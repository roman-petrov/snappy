import type { AgentTool } from "@snappy/agent";
import type { Locale } from "@snappy/intl";

import type { AgentAiConfig, AgentFeedRuntime } from "./Types";

export type SnappyToolContext = {
  config: AgentAiConfig;
  feed: AgentFeedRuntime;
  files: Record<string, File>;
  isStopped: () => boolean;
  locale: Locale;
  media: Record<string, string>;
};

export type SnappyToolFactory = (context: SnappyToolContext) => AgentTool | undefined;
