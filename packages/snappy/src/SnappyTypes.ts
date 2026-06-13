import type { AgentTool } from "@snappy/agent";
import type { Ai } from "@snappy/ai";
import type { Locale } from "@snappy/intl";
import type { AgentAiConfig, AgentFeedRuntime } from "@snappy/snappy-sdk";

export type SnappyToolContext = {
  ai: Ai;
  config: AgentAiConfig;
  feed: AgentFeedRuntime;
  files: Record<string, File>;
  isStopped: () => boolean;
  locale: Locale;
  media: Record<string, string>;
};

export type SnappyToolFactory = (context: SnappyToolContext) => AgentTool;
