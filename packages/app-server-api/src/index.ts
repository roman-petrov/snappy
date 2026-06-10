import type { TrpcRouter } from "@snappy/app-server";
import type { inferRouterOutputs } from "@trpc/server";

export type { TrpcRouter } from "@snappy/app-server";

export type TrpcOutputs = inferRouterOutputs<TrpcRouter>;
