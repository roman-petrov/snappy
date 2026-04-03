/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/prefer-tacit */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { ServerAppApi } from "@snappy/server-app";
import type { FastifyRequest } from "fastify";

import {
  type ApiAgentStepBody,
  type ApiAuthBody,
  type ApiForgotPasswordBody,
  type ApiResetPasswordBody,
  type ApiSettingsRelayPatchBody,
  type ApiSubscriptionAutoRenewBody,
  type ApiSubscriptionDeleteBody,
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
    Endpoints.settings.relay,
    withUserId(async (api, userId) => api.userSettings.get(userId)),
    withOkStatus,
    { auth: true },
  ),
  post(
    Endpoints.settings.relay,
    withUserIdAndBody(
      async (api, userId, b) =>
        api.userSettings.patchRelay(userId, {
          communityImageModel: b.communityImageModel ?? ``,
          communityTextModel: b.communityTextModel ?? ``,
          llmProvider: b.llmProvider ?? `community`,
          ollamaRelayKey: b.ollamaRelayKey ?? ``,
        }),
      body<ApiSettingsRelayPatchBody>,
    ),
    ok,
    { auth: true },
  ),
  get(
    Endpoints.settings.communityModels,
    withUserId(async api => api.communityModels.list()),
    withOkStatus,
    { auth: true },
  ),
  get(
    Endpoints.user.remaining,
    withUserId(async (api, userId) => api.agent.remaining(userId)),
    withOkStatus,
    { auth: true },
  ),
  get(
    Endpoints.presets.list,
    async (api, request) => {
      const { locale } = request.query as { locale?: string };

      return api.presets.list(locale ?? `ru`);
    },
    withOkStatus,
  ),
  get(
    `/api/presets/:presetId`,
    async (api, request) => {
      const { presetId } = request.params as { presetId?: string };
      const { locale } = request.query as { locale?: string };

      return api.presets.byId(presetId ?? ``, locale ?? `ru`);
    },
    withOkStatus,
  ),
  post(
    Endpoints.agent.step,
    withUserIdAndBody(async (api, userId, b) => api.agent.step(userId, b), body<ApiAgentStepBody>),
    id,
    { auth: true },
  ),
  get(
    `/api/agent/session/:sessionId`,
    withUserIdRequired(async (api, userId, request) => {
      const { sessionId } = request.params as { sessionId?: string };
      if (sessionId === undefined) {
        return { status: `processingFailed` };
      }

      return api.agent.getSession(userId, sessionId);
    }),
    id,
    { auth: true },
  ),
  post(
    Endpoints.premium.paymentUrl,
    withUserId(async (api, userId) => api.subscription.paymentUrl(userId)),
    (r: { url: string }) => ({ ...ok(), url: r.url }),
    { auth: true },
  ),
  get(
    Endpoints.subscription.get,
    withUserId(async (api, userId) => api.subscription.get(userId)),
    withOkStatus,
    { auth: true },
  ),
  post(
    Endpoints.subscription.autoRenew,
    withUserIdAndBody(
      async (api, userId, b) => api.subscription.setAutoRenew(userId, b.enabled),
      body<ApiSubscriptionAutoRenewBody>,
    ),
    ok,
    { auth: true },
  ),
  post(
    Endpoints.subscription.delete,
    withUserIdAndBody(
      async (api, userId, b) => api.subscription.delete(userId, b.confirmLoseTime === true),
      body<ApiSubscriptionDeleteBody>,
    ),
    ok,
    { auth: true },
  ),
  post(
    Endpoints.subscription.renew,
    withUserId(async (api, userId) => api.subscription.renew(userId)),
    ok,
    { auth: true },
  ),
  post(
    Endpoints.webhooks.yookassa,
    withBody(async (api, b) => api.subscription.webhook(b), body),
    ok,
  ),
] as Route[];
