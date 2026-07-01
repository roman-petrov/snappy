import type { TrpcRouter } from "@snappy/app-server";
import type { TRPCClient } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";

export type { TrpcRouter } from "@snappy/app-server";

export type TrpcClient = TRPCClient<TrpcRouter>;

export type TrpcOutputs = inferRouterOutputs<TrpcRouter>;
