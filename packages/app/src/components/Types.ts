import type { TrpcOutputs } from "@snappy/app-server-api";

export type FeedArtifact = TrpcOutputs[`feed`][`list`][`items`][number];
