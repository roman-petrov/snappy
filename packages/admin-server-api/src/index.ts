import type { TrpcRouter } from "@snappy/admin-server";
import type { inferRouterOutputs } from "@trpc/server";

export type { TrpcRouter } from "@snappy/admin-server";

export type TrpcOutputs = inferRouterOutputs<TrpcRouter>;
