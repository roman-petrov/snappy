import type { Ai } from "@snappy/ai";
import type { AgentFeedArtifactResult, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import type { AgentArtifact } from "../Types";

export type AgentFeedBadgeLabel = { label: string };

export type AgentFeedEntry =
  | (AgentFeedEntryDone<AgentFeedArtifactResult> & {
      ai?: Ai;
      artifact: AgentArtifact;
      model?: string;
      type: `artifact`;
    })
  | (AgentFeedEntryDone<AgentFeedBadgeLabel> & { text: string; type: `status` })
  | (AgentFeedEntryDone<AgentFeedBadgeLabel> & { text: string; type: `tool-badge` })
  | (AgentFeedEntryDone<StaticFormAnswersOf<StaticFormPlan>> & { plan: StaticFormPlan; type: `form` })
  | (AgentFeedEntryDone<void> & { stream: AsyncIterable<string>; type: `reasoning` })
  | (AgentFeedEntryDone<void> & { stream: AsyncIterable<string>; type: `stream` })
  | { text: string; type: `user` };

export type AgentFeedEntryDone<T> = { done: PromiseWithResolvers<T> };

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };
