/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import type { AgentToolRunResult } from "@snappy/agent";
import type { AiContentPart } from "@snappy/ai";

import { Mime } from "@snappy/core";

import type { AgentFeedArtifactResult } from "./Types";

const mediaImage = (mediaId: string, url: string): AiContentPart[] => [
  { text: `Image (media id "${mediaId}"):`, type: `text` },
  { type: `image`, url },
];

const dataUrl = async (url: string) => (url.startsWith(`data:`) ? url : Mime.blob(await (await fetch(url)).blob()));

const publishImage = async <Input>({
  generate,
  input,
  isStopped,
  media,
}: {
  generate: (input: Input) => Promise<AgentFeedArtifactResult>;
  input: Input;
  isStopped: () => boolean;
  media: Record<string, string>;
}): Promise<AgentToolRunResult> => {
  const { artifactId, content } = await generate(input);
  if (isStopped()) {
    return ``;
  }

  const url = await dataUrl(content);
  if (isStopped()) {
    return ``;
  }

  media[artifactId] = url;

  const context = mediaImage(artifactId, url);
  const tool = JSON.stringify({ mediaId: artifactId, status: `published` }, undefined, 2);

  return { context, tool };
};

export const ToolContext = { mediaImage, publishImage };
