/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/prefer-tacit */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { ServerAppApi } from "@snappy/server-app";
import type { Request } from "express";

import {
  type ApiAuthBody,
  type ApiForgotPasswordBody,
  type ApiProcessBody,
  type ApiResetPasswordBody,
  Endpoints,
} from "@snappy/server-api";

import type { Route } from "./Router";

type RequestWithUserId = Request & { userId?: number };

const getUserId = (request: Request): number | undefined => (request as RequestWithUserId).userId;

const withBody =
  <TBody, TSuccess>(
    run: (api: ServerAppApi, body: TBody) => Promise<TSuccess | { status: string }>,
    bodyFromRequest: (request: Request) => TBody,
  ) =>
  async (api: ServerAppApi, request: Request) =>
    run(api, bodyFromRequest(request));

const withUserIdRequired =
  <TSuccess>(
    runWithId: (
      api: ServerAppApi,
      userId: number,
      request: Request,
    ) => Promise<TSuccess | { status: string }>,
  ) =>
  async (api: ServerAppApi, request: Request): Promise<TSuccess | { status: string }> =>
    runWithId(api, getUserId(request) ?? 0, request);

const withUserId = <TSuccess>(
  run: (api: ServerAppApi, userId: number) => Promise<TSuccess | { status: string }>,
) => withUserIdRequired(run);

const withUserIdAndBody = <TBody, TSuccess>(
  run: (api: ServerAppApi, userId: number, body: TBody) => Promise<TSuccess | { status: string }>,
  bodyFromRequest: (request: Request) => TBody,
) => withUserIdRequired(async (api, id, request) => run(api, id, bodyFromRequest(request)));

const body = <T>(request: Request): T => (request.body ?? {}) as T;

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

export const Routes = [
  post(
    Endpoints.auth.register,
    withBody(async (api, b) => api.auth.register(b), body<ApiAuthBody>),
    () => ({ status: `ok` as const }),
    { setAuthCookie: true },
  ),
  post(
    Endpoints.auth.login,
    withBody(async (api, b) => api.auth.login(b), body<ApiAuthBody>),
    () => ({ status: `ok` as const }),
    { setAuthCookie: true },
  ),
  post(
    Endpoints.auth.logout,
    async () => ({ status: `ok` as const }),
    (r: { status: `ok` }) => r,
    { clearAuthCookie: true },
  ),
  get(
    Endpoints.auth.me,
    async () => ({ status: `ok` as const }),
    (r: { status: `ok` }) => r,
    { auth: true },
  ),
  post(
    Endpoints.auth.forgotPassword,
    withBody(async (api, b) => api.auth.forgotPassword(b), body<ApiForgotPasswordBody>),
    (r: { resetToken?: string; status: `ok`; }) => r,
  ),
  post(
    Endpoints.auth.resetPassword,
    withBody(async (api, b) => api.auth.resetPassword(b), body<ApiResetPasswordBody>),
    () => ({ status: `ok` as const }),
  ),
  get(
    Endpoints.user.remaining,
    withUserId(async (api, id) => api.user.remaining(id)),
    (remaining: number) => ({ remaining, status: `ok` as const }),
    { auth: true },
  ),
  post(
    Endpoints.process,
    withUserIdAndBody(async (api, id, b) => api.process(id, b), body<ApiProcessBody>),
    (r: { text: string }) => ({ status: `ok` as const, text: r.text }),
    { auth: true },
  ),
  post(
    Endpoints.premium.paymentUrl,
    withUserId(async (api, id) => api.premium.paymentUrl(id)),
    (r: { url: string }) => ({ status: `ok` as const, url: r.url }),
    { auth: true },
  ),
] as Route[];
