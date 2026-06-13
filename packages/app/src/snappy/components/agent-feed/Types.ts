import type { AiChatModel, AiImageModel } from "@snappy/ai";
import type { AgentFeedArtifactResult, StaticFormAnswers, StaticFormPlan } from "@snappy/snappy-sdk";

import type { AgentArtifact } from "../Types";

export type AgentFeedArtifactEntry =
  | (AgentFeedEntryDone<AgentFeedArtifactResult> & {
      artifact: AgentImageArtifact;
      model: AiImageModel;
      type: `artifact`;
      variant: `image`;
    })
  | (AgentFeedEntryDone<AgentFeedArtifactResult> & {
      artifact: AgentTextArtifact;
      model: AiChatModel;
      type: `artifact`;
      variant: `text`;
    });

export type AgentFeedBadgeLabel = { label: string };

export type AgentFeedEntry =
  | AgentFeedArtifactEntry
  | (AgentFeedEntryDone<AgentFeedBadgeLabel> & { text: string; type: `status` })
  | (AgentFeedEntryDone<AgentFeedBadgeLabel> & { text: string; type: `tool-badge` })
  | (AgentFeedEntryDone<StaticFormAnswers> & { plan: StaticFormPlan; type: `form` })
  | (AgentFeedEntryDone<void> & { stream: AsyncIterable<string>; type: `reasoning` })
  | (AgentFeedEntryDone<void> & { stream: AsyncIterable<string>; type: `stream` })
  | { text: string; type: `user` };

export type AgentFeedEntryDone<T> = { done: PromiseWithResolvers<T> };

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };

export type AgentImageArtifact = Extract<AgentArtifact, { type: `image` }>;

export type AgentTextArtifact = Extract<AgentArtifact, { type: `text` }>;
