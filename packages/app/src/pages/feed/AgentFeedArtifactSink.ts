import type { AgentArtifact } from "../../snappy/components/Types";

import { ChatFeed } from "./ChatFeed";

export type AgentFeedArtifactSink = ReturnType<typeof AgentFeedArtifactSink>;

export const AgentFeedArtifactSink = () => ({
  publish: async (artifact: AgentArtifact) =>
    ChatFeed.upsert(
      artifact.type === `text`
        ? { generationPrompt: artifact.generationPrompt, id: artifact.id, text: artifact.text, type: `text` }
        : { generationPrompt: artifact.generationPrompt, id: artifact.id, src: artifact.src, type: `image` },
    ),
  remove: async (id: string) => ChatFeed.remove(id),
});
