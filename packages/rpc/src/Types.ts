import type { RpcProcedureBrand } from "./Procedure";

export type RpcClient<TApi> = {
  [K in keyof TApi]: IsProc<TApi[K]> extends true ? LeafClient<TApi[K]> : RpcClient<TApi[K]>;
} & { close: () => void; onReconnect: (listener: () => void) => () => void; open: () => void };

export type RpcInput<TApi> = {
  [K in keyof TApi]: IsProc<TApi[K]> extends true ? ProcInput<TApi[K]> : RpcInput<TApi[K]>;
};

export type RpcOutput<TApi> = {
  [K in keyof TApi]: IsProc<TApi[K]> extends true ? ProcOutput<TApi[K]> : RpcOutput<TApi[K]>;
};

type IsProc<T> = T extends RpcProcedureBrand ? true : false;

type LeafClient<TProc> = [ProcInput<TProc>] extends [undefined]
  ? { (): Promise<ProcOutput<TProc>>; on: (listener: (data: ProcOutput<TProc>) => void) => () => void }
  : {
      (input: ProcInput<TProc>): Promise<ProcOutput<TProc>>;
      on: (listener: (data: ProcOutput<TProc>) => void) => () => void;
    };

type ProcInput<T> = T extends { handle: (args: infer Args) => Promise<unknown> }
  ? Args extends { input: infer Input }
    ? Input
    : undefined
  : undefined;

type ProcOutput<T> = T extends { handle: (args: never) => Promise<infer Out> } ? Out : never;
