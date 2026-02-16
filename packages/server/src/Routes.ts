/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { ServerAppApi } from "@snappy/server-app";
import type { Request } from "express";

import { HttpStatus } from "@snappy/core";
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
    run: (api: ServerAppApi, body: TBody) => Promise<TSuccess | { error: string; status: number }>,
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
    ) => Promise<TSuccess | { error: string; status: number }>,
  ) =>
  async (api: ServerAppApi, request: Request): Promise<TSuccess | { error: string; status: number }> =>
    runWithId(api, getUserId(request) ?? 0, request);

const withUserId = <TSuccess>(
  run: (api: ServerAppApi, userId: number) => Promise<TSuccess | { error: string; status: number }>,
) => withUserIdRequired(run);

const withUserIdAndBody = <TBody, TSuccess>(
  run: (api: ServerAppApi, userId: number, body: TBody) => Promise<TSuccess | { error: string; status: number }>,
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

const post = <T = unknown>(
  path: string,
  run: Route<T>[`run`],
  successBody: Route<T>[`successBody`],
  extra?: Partial<Route<T>>,
): Route<T> => route(`post`, path, run, successBody, extra);

const get = <T = unknown>(
  path: string,
  run: Route<T>[`run`],
  successBody: Route<T>[`successBody`],
  extra?: Partial<Route<T>>,
): Route<T> => route(`get`, path, run, successBody, extra);

export const Routes = [
  post(
    Endpoints.auth.register,
    withBody(async (api, b) => api.auth.register(b), body<ApiAuthBody>),
    (r: { token: string }) => ({ token: r.token }),
    { successStatus: HttpStatus.created },
  ),
  post(
    Endpoints.auth.login,
    withBody(async (api, b) => api.auth.login(b), body<ApiAuthBody>),
    (r: { token: string }) => ({ token: r.token }),
  ),
  post(
    Endpoints.auth.forgotPassword,
    withBody(async (api, b) => api.auth.forgotPassword(b), body<ApiForgotPasswordBody>),
    (r: { ok: true; resetToken?: string }) => r,
  ),
  post(
    Endpoints.auth.resetPassword,
    withBody(async (api, b) => api.auth.resetPassword(b), body<ApiResetPasswordBody>),
    (r: { ok: true }) => r,
  ),
  get(
    Endpoints.user.remaining,
    withUserId(async (api, id) => api.user.remaining(id)),
    (remaining: number) => ({ remaining }),
    { auth: true },
  ),
  post(
    Endpoints.process,
    withUserIdAndBody(async (api, id, b) => api.process(id, b), body<ApiProcessBody>),
    (r: { text: string }) => ({ text: r.text }),
    { auth: true },
  ),
  post(
    Endpoints.premium.paymentUrl,
    withUserId(async (api, id) => api.premium.paymentUrl(id)),
    (r: { url: string }) => ({ url: r.url }),
    { auth: true },
  ),
] as Route[];
