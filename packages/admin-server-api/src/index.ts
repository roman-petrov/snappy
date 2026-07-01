import type { TrpcRouter } from "@snappy/admin-server";
import type { TRPCClient } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";

export type { TrpcRouter } from "@snappy/admin-server";

export type TrpcClient = TRPCClient<TrpcRouter>;

export type TrpcOutputs = inferRouterOutputs<TrpcRouter>;
