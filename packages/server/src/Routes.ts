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

const withUserId =
  <TSuccess>(run: (api: ServerAppApi, userId: number) => Promise<TSuccess | { error: string; status: number }>) =>
  async (api: ServerAppApi, request: Request): Promise<TSuccess | { error: string; status: number }> => {
    const id = getUserId(request);

    return id === undefined ? { error: `Unauthorized`, status: HttpStatus.unauthorized } : run(api, id);
  };

const withUserIdAndBody =
  <TBody, TSuccess>(
    run: (api: ServerAppApi, userId: number, body: TBody) => Promise<TSuccess | { error: string; status: number }>,
    bodyFromRequest: (request: Request) => TBody,
  ) =>
  async (api: ServerAppApi, request: Request): Promise<TSuccess | { error: string; status: number }> => {
    const id = getUserId(request);

    return id === undefined
      ? { error: `Unauthorized`, status: HttpStatus.unauthorized }
      : run(api, id, bodyFromRequest(request));
  };

const body = <T>(request: Request): T => (request.body ?? {}) as T;

export const Routes = [
  {
    method: `post`,
    path: Endpoints.auth.register,
    run: withBody(async (api, b) => api.auth.register(b), body<ApiAuthBody>),
    successBody: (r: { token: string }) => ({ token: r.token }),
    successStatus: HttpStatus.created,
  },
  {
    method: `post`,
    path: Endpoints.auth.login,
    run: withBody(async (api, b) => api.auth.login(b), body<ApiAuthBody>),
    successBody: (r: { token: string }) => ({ token: r.token }),
  },
  {
    method: `post`,
    path: Endpoints.auth.forgotPassword,
    run: withBody(async (api, b) => api.auth.forgotPassword(b), body<ApiForgotPasswordBody>),
    successBody: (r: { ok: true; resetToken?: string }) => r,
  },
  {
    method: `post`,
    path: Endpoints.auth.resetPassword,
    run: withBody(async (api, b) => api.auth.resetPassword(b), body<ApiResetPasswordBody>),
    successBody: (r: { ok: true }) => r,
  },
  {
    auth: true,
    method: `get`,
    path: Endpoints.user.remaining,
    run: withUserId(async (api, id) => api.user.remaining(id)),
    successBody: (remaining: number) => ({ remaining }),
  },
  {
    auth: true,
    method: `post`,
    path: Endpoints.process,
    run: withUserIdAndBody(async (api, id, b) => api.process(id, b), body<ApiProcessBody>),
    successBody: (r: { text: string }) => ({ text: r.text }),
  },
  {
    auth: true,
    method: `post`,
    path: Endpoints.premium.paymentUrl,
    run: withUserId(async (api, id) => api.premium.paymentUrl(id)),
    successBody: (r: { url: string }) => ({ url: r.url }),
  },
] as Route[];
