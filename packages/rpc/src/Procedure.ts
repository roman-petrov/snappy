/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { z } from "zod";

import { _ } from "@snappy/core";

const brand = Symbol(`rpc.procedure`);

export type RpcApiTree = { readonly [key: string]: RpcApiTree | RpcProcedure };

export type RpcDocLive = { room: string };

export type RpcLiveSource = { live: (listener: (userId: string, data: unknown) => void) => () => void };

export type RpcProcedure<TContext = any, TAuth = any, TInput = any, TOutput = any> = RpcProcedureBrand & {
  readonly authenticate: (context: TContext) => TAuth | undefined;
  readonly handle: (args: { auth: TAuth; ctx: TContext; input: TInput }) => Promise<TOutput>;
  readonly input?: z.ZodType<TInput>;
  readonly liveSource?: RpcLiveSource;
  readonly sync?: true;
};

export type RpcProcedureBrand = { readonly [brand]: true };

export type WireOut<TRaw, TMapped, TValue> = TValue extends { items: (infer Item)[] }
  ? Item extends TRaw
    ? Omit<TValue, `items`> & { items: WireOut<TRaw, TMapped, Item>[] }
    : TValue
  : [TValue] extends [TRaw]
    ? [TMapped] extends [TRaw]
      ? TValue
      : TMapped
    : TValue;

const isProcedure = (value: unknown): value is RpcProcedure => value instanceof Object && brand in value;
const isLive = (value: RpcProcedure): boolean => value.sync === true || value.liveSource !== undefined;

const procedure = <TContext, TAuth, TInput, TOutput>(base: {
  authenticate: (context: TContext) => TAuth | undefined;
  handle: (args: { auth: TAuth; ctx: TContext; input: TInput }) => Promise<TOutput>;
  input?: z.ZodType<TInput>;
  liveSource?: RpcLiveSource;
  sync?: true;
}): RpcProcedure<TContext, TAuth, TInput, TOutput> => ({ ...base, [brand]: true as const });

type AuthHandler<TAuth, TOutput> = (args: TAuth) => MaybePromise<TOutput>;

type HandlerBuilder<TContext, TAuth> = MappedHandlerBuilder<TContext, TAuth, never, never>;

type InputHandler<TAuth, TInput, TOutput> = (args: TAuth & { input: TInput }) => MaybePromise<TOutput>;

type LiveBaseBuilder<TContext, TAuth, TRaw, TMapped> = {
  <TOutput>(
    source: RpcLiveSource,
    handler: AuthHandler<TAuth, TOutput>,
  ): MappedProc<TContext, TAuth, TRaw, TMapped, undefined, TOutput>;
  <TInput, TOutput>(
    source: RpcLiveSource,
    schema: z.ZodType<TInput>,
    handler: InputHandler<TAuth, TInput, TOutput>,
  ): MappedProc<TContext, TAuth, TRaw, TMapped, TInput, TOutput>;
};

type MappedHandlerBuilder<TContext, TAuth, TRaw, TMapped> = {
  <TOutput>(handler: AuthHandler<TAuth, TOutput>): MappedProc<TContext, TAuth, TRaw, TMapped, undefined, TOutput>;
  <TInput, TOutput>(
    schema: z.ZodType<TInput>,
    handler: InputHandler<TAuth, TInput, TOutput>,
  ): MappedProc<TContext, TAuth, TRaw, TMapped, TInput, TOutput>;
};

type MappedMutBuilder<TContext, TAuth, TRaw, TMapped> = LiveBaseBuilder<TContext, TAuth, TRaw, TMapped> &
  MappedHandlerBuilder<TContext, TAuth, TRaw, TMapped>;

type MappedProc<TContext, TAuth, TRaw, TMapped, TInput, TOutput> = RpcProcedure<
  TContext,
  TAuth,
  TInput,
  WireOut<TRaw, TMapped, TOutput>
>;

type MaybePromise<T> = Promise<T> | T;

type MutBuilder<TContext, TAuth> = MappedMutBuilder<TContext, TAuth, never, never>;

const isLiveSource = (value: unknown): value is RpcLiveSource =>
  value instanceof Object && _.isFunction((value as RpcLiveSource).live);

const isZod = (value: unknown): value is z.ZodType => value instanceof Object && `safeParse` in value;

const mapLive = (source: RpcLiveSource, map: (data: unknown) => unknown): RpcLiveSource => ({
  live: listener => source.live((userId, data) => listener(userId, map(data))),
});

const applyMap = (map: (data: unknown) => unknown, value: unknown) => {
  const items = value !== null && _.isObject(value) ? (value as { items?: unknown }).items : undefined;

  return _.isArray(items) ? { ...(value as object), items: items.map(map) } : map(value);
};

const handlerProcedure = <TContext, TAuth extends object, TArgs extends object>(
  authenticate: (context: TContext) => TAuth | undefined,
  handler: (args: TArgs) => MaybePromise<unknown>,
  argsOf: (auth: TAuth, context: TContext) => TArgs,
) => procedure({ authenticate, handle: async ({ auth, ctx }) => await handler(argsOf(auth, ctx)) });

const schemaProcedure = <TContext, TAuth extends object, TArgs extends object>(
  authenticate: (context: TContext) => TAuth | undefined,
  schema: z.ZodType,
  handler: (args: TArgs & { input: unknown }) => MaybePromise<unknown>,
  argsOf: (auth: TAuth, context: TContext) => TArgs,
) =>
  procedure({
    authenticate,
    handle: async ({ auth, ctx, input }) => await handler({ ...argsOf(auth, ctx), input }),
    input: schema,
  });

const handlerBuilder = <TContext, TAuth extends object>(
  authenticate: (context: TContext) => TAuth | undefined,
  wrap: <TInput, TOutput>(
    proc: RpcProcedure<TContext, TAuth, TInput, TOutput>,
  ) => RpcProcedure<TContext, TAuth, TInput, TOutput>,
): HandlerBuilder<TContext, TAuth> =>
  ((
    schemaOrHandler: ((args: TAuth) => MaybePromise<unknown>) | z.ZodType,
    maybeHandler?: (args: TAuth & { input: unknown }) => MaybePromise<unknown>,
  ) =>
    wrap(
      _.isFunction(schemaOrHandler)
        ? handlerProcedure(authenticate, schemaOrHandler, auth => auth)
        : schemaProcedure(
            authenticate,
            schemaOrHandler,
            maybeHandler as (args: TAuth & { input: unknown }) => MaybePromise<unknown>,
            auth => auth,
          ),
    )) as HandlerBuilder<TContext, TAuth>;

export type RpcMappedScope<TContext, TAuth extends object, TRaw, TMapped> = {
  doc: MappedDocBuilder<TContext, TAuth, TRaw, TMapped>;
  mut: MappedMutBuilder<TContext, TAuth, TRaw, TMapped>;
  query: MappedHandlerBuilder<TContext, TAuth, TRaw, TMapped>;
};

export type RpcScope<TContext, TAuth extends object> = {
  doc: DocBuilder<TContext, TAuth>;
  map: <TRaw, TMapped = TRaw>(fn: (data: TRaw) => TMapped) => RpcMappedScope<TContext, TAuth, TRaw, TMapped>;
  mut: MutBuilder<TContext, TAuth>;
  open: OpenBuilder<TContext>;
  query: HandlerBuilder<TContext, TAuth>;
};

type DocBuilder<TContext, TAuth> = MappedDocBuilder<TContext, TAuth, never, never>;

type MappedDocBuilder<TContext, TAuth, TRaw, TMapped> = LiveBaseBuilder<TContext, TAuth, TRaw, TMapped> & {
  <TOutput>(
    source: RpcLiveSource,
    live: RpcDocLive,
    handler: AuthHandler<TAuth, TOutput>,
  ): MappedProc<TContext, TAuth, TRaw, TMapped, undefined, TOutput>;
  <TInput, TOutput>(
    source: RpcLiveSource,
    live: RpcDocLive,
    schema: z.ZodType<TInput>,
    handler: InputHandler<TAuth, TInput, TOutput>,
  ): MappedProc<TContext, TAuth, TRaw, TMapped, TInput, TOutput>;
};

const markLive = <TContext, TAuth, TInput, TOutput>(
  proc: RpcProcedure<TContext, TAuth, TInput, TOutput>,
  source?: RpcLiveSource,
): RpcProcedure<TContext, TAuth, TInput, TOutput> =>
  procedure({
    authenticate: proc.authenticate,
    handle: proc.handle,
    input: proc.input,
    liveSource: source,
    sync: true,
  });

type OpenBuilder<TContext> = <TOutput>(
  handler: (args: { ctx: TContext }) => MaybePromise<TOutput>,
) => RpcProcedure<TContext, object, undefined, TOutput>;

type WrapProc<TContext, TAuth> = <TInput, TOutput>(
  proc: RpcProcedure<TContext, TAuth, TInput, TOutput>,
) => RpcProcedure<TContext, TAuth, TInput, TOutput>;

const builders = <TContext, TAuth extends object>(
  authenticate: (context: TContext) => TAuth | undefined,
  wrap: WrapProc<TContext, TAuth>,
) => {
  const query = handlerBuilder(authenticate, wrap);

  const fromHandler = <TOutput>(source: RpcLiveSource, handler: AuthHandler<TAuth, TOutput>) =>
    wrap(markLive(procedure({ authenticate, handle: async ({ auth }) => handler(auth) }), source));

  const fromSchema = <TInput, TOutput>(
    source: RpcLiveSource,
    schema: z.ZodType<TInput>,
    handler: InputHandler<TAuth, TInput, TOutput>,
  ) =>
    wrap(
      markLive(
        procedure({ authenticate, handle: async ({ auth, input }) => handler({ ...auth, input }), input: schema }),
        source,
      ),
    );

  const mut = ((liveOrInput: unknown, schemaOrHandler?: unknown, handler?: unknown) =>
    isLiveSource(liveOrInput)
      ? _.isFunction(schemaOrHandler) && handler === undefined
        ? fromHandler(liveOrInput, schemaOrHandler as AuthHandler<TAuth, unknown>)
        : fromSchema(liveOrInput, schemaOrHandler as z.ZodType, handler as InputHandler<TAuth, unknown, unknown>)
      : handlerBuilder(authenticate, proc => wrap(markLive(proc)))(
          liveOrInput as never,
          schemaOrHandler as never,
        )) as MutBuilder<TContext, TAuth>;

  const doc = ((
    source: RpcLiveSource,
    handlerOrSchemaOrLive: unknown,
    schemaOrHandler?: unknown,
    handler?: unknown,
  ) => {
    if (_.isFunction(handlerOrSchemaOrLive) && schemaOrHandler === undefined) {
      return fromHandler(source, handlerOrSchemaOrLive as AuthHandler<TAuth, unknown>);
    }
    if (isZod(handlerOrSchemaOrLive)) {
      return fromSchema(source, handlerOrSchemaOrLive, schemaOrHandler as InputHandler<TAuth, unknown, unknown>);
    }

    const { room } = handlerOrSchemaOrLive as RpcDocLive;
    const roomSource: RpcLiveSource = { live: listener => source.live((_userId, data) => listener(room, data)) };

    return _.isFunction(schemaOrHandler)
      ? fromHandler(roomSource, schemaOrHandler as AuthHandler<TAuth, unknown>)
      : fromSchema(roomSource, schemaOrHandler as z.ZodType, handler as InputHandler<TAuth, unknown, unknown>);
  }) as DocBuilder<TContext, TAuth>;

  return { doc, mut, query };
};

const scope = <TContext, TAuth extends object>(
  authenticate: (context: TContext) => TAuth | undefined,
): RpcScope<TContext, TAuth> => {
  const identity: WrapProc<TContext, TAuth> = proc => proc;
  const base = builders(authenticate, identity);

  return {
    ...base,
    map: <TRaw, TMapped = TRaw>(fn: (data: TRaw) => TMapped) => {
      const map = (data: unknown) => fn(data as TRaw);

      return builders(
        authenticate,
        (proc: RpcProcedure<TContext, TAuth>) =>
          procedure({
            authenticate: proc.authenticate,
            handle: async args => applyMap(map, await proc.handle(args)),
            input: proc.input,
            liveSource: proc.liveSource === undefined ? undefined : mapLive(proc.liveSource, map),
            sync: proc.sync,
          }) as typeof proc,
      );
    },
    open: ((handler: (args: { ctx: TContext }) => MaybePromise<unknown>) =>
      handlerProcedure(
        () => ({}),
        handler,
        (_auth, context) => ({ ctx: context }),
      )) as OpenBuilder<TContext>,
  };
};

export const Procedure = { isLive, isProcedure, scope };
