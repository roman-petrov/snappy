import type { Ai } from "@snappy/ai";
import type { StaticFormPlan } from "@snappy/snappy-sdk";
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

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };

export type { AgentFeedHandle } from "./AgentFeedInterface";
