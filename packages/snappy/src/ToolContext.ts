/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import type { AgentToolRunResult } from "@snappy/agent";
import type { AiContentPart } from "@snappy/ai";

import type { AgentFeedRuntime } from "./Types";

const mediaImage = (mediaId: string, url: string): AiContentPart[] => [
  { text: `Image (media id "${mediaId}"):`, type: `text` },
  { type: `image`, url },
];

const publishImage = async ({
  feed,
  input,
  isStopped,
  media,
}: {
  feed: AgentFeedRuntime;
  input: Parameters<AgentFeedRuntime[`generateImage`]>[0];
  isStopped: () => boolean;
  media: Record<string, string>;
}): Promise<AgentToolRunResult> => {
  const { artifactId, content } = await feed.generateImage(input);
  if (isStopped()) {
    return ``;
  }

  media[artifactId] = content;

  const context = mediaImage(artifactId, content);
  const tool = JSON.stringify({ mediaId: artifactId, status: `published` }, undefined, 2);

  return { context, tool };
};

export const ToolContext = { mediaImage, publishImage };
