/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/prefer-tacit */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { FastifyReply, FastifyRequest } from "fastify";

import { type ApiBalancePaymentUrlBody, type ApiUserSettingsBody, Endpoints } from "@snappy/server-api";
import { AiTunnelRoute, type ServerApp } from "@snappy/server-app";

import type { RequestWithUserId } from "./Middleware";
import type { Route } from "./Router";

const getUserId = (request: FastifyRequest) => (request as RequestWithUserId).userId;

const withBody =
  <TBody, TSuccess>(
    run: (api: ServerApp, body: TBody) => Promise<TSuccess | { status: string }>,
    bodyFromRequest: (request: FastifyRequest) => TBody,
  ) =>
  async (api: ServerApp, request: FastifyRequest) =>
    run(api, bodyFromRequest(request));

const withUserIdRequired =
  <TSuccess>(
    runWithId: (api: ServerApp, userId: string, request: FastifyRequest) => Promise<TSuccess | { status: string }>,
  ) =>
  async (api: ServerApp, request: FastifyRequest): Promise<TSuccess | { status: string }> =>
    runWithId(api, getUserId(request), request);

const withUserId = <TSuccess>(run: (api: ServerApp, userId: string) => Promise<TSuccess | { status: string }>) =>
  withUserIdRequired(run);

const withUserIdRaw =
  (run: (api: ServerApp, userId: string, request: FastifyRequest, reply: FastifyReply) => Promise<void>) =>
  async (api: ServerApp, request: FastifyRequest, reply: FastifyReply) =>
    run(api, getUserId(request), request, reply);

const withUserIdAndBody = <TBody, TSuccess>(
  run: (api: ServerApp, userId: string, body: TBody) => Promise<TSuccess | { status: string }>,
  bodyFromRequest: (request: FastifyRequest) => TBody,
) => withUserIdRequired(async (api, id, request) => run(api, id, bodyFromRequest(request)));

const body = <T>(request: FastifyRequest): T => (request.body ?? {}) as T;

const route = <T = unknown>(
  method: `get` | `post`,
  path: string,
  run: Route<T>[`run`],
  successBody: Route<T>[`successBody`],
  extra?: Partial<Route<T>>,
): Route<T> => ({ method, path, run, successBody, ...extra });

const routeRaw = (
  method: `get` | `post`,
  path: string,
  runRaw: NonNullable<Route[`runRaw`]>,
  extra?: Partial<Route>,
): Route => ({ method, path, run: async () => ({ status: `ok` as const }), runRaw, successBody: undefined, ...extra });

const withMethod =
  (method: `get` | `post`) =>
  <T = unknown>(
    path: string,
    run: Route<T>[`run`],
    successBody: Route<T>[`successBody`],
    extra?: Partial<Route<T>>,
  ): Route<T> =>
    route(method, path, run, successBody, extra);

const post = withMethod(`post`);
const get = withMethod(`get`);

const postRaw = (path: string, runRaw: NonNullable<Route[`runRaw`]>, extra?: Partial<Route>): Route =>
  routeRaw(`post`, path, runRaw, extra);

const ok = () => ({ status: `ok` as const });
const id = <T>(r: T): T => r;

export const Routes = [
  get(
    Endpoints.user.balance,
    withUserId(async (api, userId) => ({ balance: await api.balance.read(userId) })),
    id,
  ),
  postRaw(
    `${AiTunnelRoute}/*`,
    withUserIdRaw(async (api, userId, request, reply) =>
      api.aiTunnelProxy(userId, (request.params as { readonly [`*`]: string })[`*`], request, reply),
    ),
  ),
  get(
    Endpoints.user.settings,
    withUserId(async (api, userId) => api.userSettings.get(userId)),
    id,
  ),
  post(
    Endpoints.user.settings,
    withUserIdAndBody(async (api, userId, b) => api.userSettings.set(userId, b), body<ApiUserSettingsBody>),
    id,
  ),
  post(
    Endpoints.balance.paymentUrl,
    withUserIdAndBody(
      async (api, userId, b) => api.balancePayment.paymentUrl(userId, b.amount ?? 0),
      body<ApiBalancePaymentUrlBody>,
    ),
    id,
  ),
  post(
    Endpoints.webhooks.yookassa,
    withBody(async (api, b) => api.balancePayment.webhook(b), body),
    ok,
    { noAuth: true },
  ),
] as Route[];
