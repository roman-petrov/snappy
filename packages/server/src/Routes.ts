/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/prefer-tacit */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { ServerAppApi } from "@snappy/server-app";
import type { FastifyRequest } from "fastify";

import {
  type ApiAuthBody,
  type ApiBalancePaymentUrlBody,
  type ApiForgotPasswordBody,
  type ApiLlmChatBody,
  type ApiLlmImageBody,
  type ApiLlmImageOk,
  type ApiLlmSpeechRecognitionBody,
  type ApiResetPasswordBody,
  type ApiUserLlmSettingsBody,
  Endpoints,
} from "@snappy/server-api";

import type { Route } from "./Router";

type RequestWithUserId = FastifyRequest & { userId?: number };

const getUserId = (request: FastifyRequest): number | undefined => (request as RequestWithUserId).userId;

const withBody =
  <TBody, TSuccess>(
    run: (api: ServerAppApi, body: TBody) => Promise<TSuccess | { status: string }>,
    bodyFromRequest: (request: FastifyRequest) => TBody,
  ) =>
  async (api: ServerAppApi, request: FastifyRequest) =>
    run(api, bodyFromRequest(request));

const withUserIdRequired =
  <TSuccess>(
    runWithId: (api: ServerAppApi, userId: number, request: FastifyRequest) => Promise<TSuccess | { status: string }>,
  ) =>
  async (api: ServerAppApi, request: FastifyRequest): Promise<TSuccess | { status: string }> =>
    runWithId(api, getUserId(request) ?? 0, request);

const withUserId = <TSuccess>(run: (api: ServerAppApi, userId: number) => Promise<TSuccess | { status: string }>) =>
  withUserIdRequired(run);

const withUserIdAndBody = <TBody, TSuccess>(
  run: (api: ServerAppApi, userId: number, body: TBody) => Promise<TSuccess | { status: string }>,
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

const postBinary = <TSuccess>(
  path: string,
  run: Route<TSuccess>[`run`],
  raw: NonNullable<Route<TSuccess>[`rawSuccess`]>,
  extra?: Partial<Route<TSuccess>>,
): Route<TSuccess> => ({ method: `post`, path, rawSuccess: raw, run, ...extra });

const get = withMethod(`get`);
const ok = () => ({ status: `ok` as const });
const id = <T>(r: T): T => r;
const withOkStatus = <T extends object>(r: T) => ({ ...r, status: `ok` as const });

const authBodyOk = (
  path: string,
  run: (api: ServerAppApi, b: ApiAuthBody) => Promise<Record<string, unknown> | { status: string }>,
) => post(path, withBody(run, body<ApiAuthBody>), ok, { setAuthCookie: true });

export const Routes = [
  authBodyOk(Endpoints.auth.register, async (api, b) => api.auth.register(b)),
  authBodyOk(Endpoints.auth.login, async (api, b) => api.auth.login(b)),
  post(Endpoints.auth.logout, async () => ok(), id, { clearAuthCookie: true }),
  get(Endpoints.auth.me, async () => ok(), id, { auth: true }),
  post(
    Endpoints.auth.forgotPassword,
    withBody(async (api, b) => api.auth.forgotPassword(b), body<ApiForgotPasswordBody>),
    id,
  ),
  post(
    Endpoints.auth.resetPassword,
    withBody(async (api, b) => api.auth.resetPassword(b), body<ApiResetPasswordBody>),
    ok,
  ),
  get(
    Endpoints.user.balance,
    withUserId(async (api, userId) => api.balance.balance(userId)),
    withOkStatus,
    { auth: true },
  ),
  post(
    Endpoints.llm.chat,
    withUserIdAndBody(async (api, userId, b) => api.llm.chat(userId, b), body<ApiLlmChatBody>),
    id,
    { auth: true },
  ),
  post(
    Endpoints.llm.speechRecognition,
    withUserIdAndBody(
      async (api, userId, b) => api.llm.speechRecognition(userId, b),
      body<ApiLlmSpeechRecognitionBody>,
    ),
    id,
    { auth: true },
  ),
  postBinary<ApiLlmImageOk>(
    Endpoints.llm.image,
    withUserIdAndBody(async (api, userId, b) => api.llm.image(userId, b), body<ApiLlmImageBody>),
    { body: r => Buffer.from(r.bytes), contentType: `image/png` },
    { auth: true },
  ),
  get(
    Endpoints.llm.models,
    withUserId(async api => api.llm.models()),
    withOkStatus,
    { auth: true },
  ),
  get(
    Endpoints.user.llmSettings,
    withUserId(async (api, userId) => api.userLlmSettings.get(userId)),
    withOkStatus,
    { auth: true },
  ),
  post(
    Endpoints.user.llmSettings,
    withUserIdAndBody(async (api, userId, b) => api.userLlmSettings.set(userId, b), body<ApiUserLlmSettingsBody>),
    id,
    { auth: true },
  ),
  post(
    Endpoints.balance.paymentUrl,
    withUserIdAndBody(
      async (api, userId, b) => api.balancePayment.paymentUrl(userId, b.amount ?? 0),
      body<ApiBalancePaymentUrlBody>,
    ),
    id,
    { auth: true },
  ),
  post(
    Endpoints.webhooks.yookassa,
    withBody(async (api, b) => api.balancePayment.webhook(b), body),
    ok,
  ),
] as Route[];
