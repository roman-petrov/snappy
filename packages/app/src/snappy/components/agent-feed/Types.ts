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
  | { closed?: boolean; stream: AsyncIterable<string>; type: `reasoning` }
  | { closed?: boolean; stream: AsyncIterable<string>; type: `stream` }
  | { finished: Promise<{ label: string }>; text: string; type: `status` }
  | { finished: Promise<{ label: string }>; text: string; type: `tool-badge` }
  | { plan: StaticFormPlan; type: `form` }
  | { text: string; type: `user` };

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };
