import type { Ai } from "@snappy/ai";
import type { AgentFeedRuntime, StaticFormPlan } from "@snappy/snappy-sdk";
import type { Color, Typography } from "@snappy/ui";

import type { AgentArtifact } from "../Types";

export type AgentFeedArtifactSink = {
  publish: (artifact: AgentArtifact) => Promise<void> | void;
  remove?: (id: string) => Promise<void> | void;
};

export type AgentFeedEntry =
  | {
      ai?: Ai;
      artifact: AgentArtifact;
      model?: string;
      onArtifactError?: (error: unknown) => void;
      onArtifactGenerated?: (artifact: AgentArtifact) => void;
      type: `artifact`;
    }
  | { closed?: boolean; color?: Color; stream: AsyncIterable<string>; type: `stream`; typography?: Typography }
  | { finished: Promise<{ label: string }>; text: string; type: `status` }
  | { finished: Promise<{ label: string }>; text: string; type: `tool-badge` }
  | { plan: StaticFormPlan; type: `form` }
  | { text: string; type: `user` };

export type AgentFeedHandle = AgentFeedRuntime & {
  appendArtifact: (artifact: AgentArtifact, options?: { ai?: Ai; model?: string }) => number;
  appendForm: (plan: StaticFormPlan) => number;
  appendUserText: (text: string) => number;
  clear: () => void;
  removeEntry: (key: number) => void;
  updateArtifact: (id: string, patch: Partial<AgentArtifact>) => void;
};

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };
