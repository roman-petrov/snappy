import type { Ai } from "@snappy/ai";
import type { StaticFormPlan } from "@snappy/snappy-sdk";

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
  | { finished: Promise<{ label: string }>; text: string; type: `status` }
  | { finished: Promise<{ label: string }>; text: string; type: `tool-badge` }
  | { plan: StaticFormPlan; type: `form` }
  | { stream: AsyncIterable<string>; type: `reasoning` }
  | { stream: AsyncIterable<string>; type: `stream` }
  | { text: string; type: `user` };

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };
