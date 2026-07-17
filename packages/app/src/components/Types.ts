import type { RpcOutput } from "@snappy/app-server-api";

export type FeedArtifact = RpcOutput[`feed`][`list`][`items`][number];
