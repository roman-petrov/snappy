/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { ApiAuthBody, ApiForgotPasswordBody, ApiProcessBody, ApiResetPasswordBody } from "@snappy/server-api";
import type { Request } from "express";

import { HttpStatus } from "@snappy/core";
import { Endpoints } from "@snappy/server-api";

import type { RouteDef } from "./Router";

import { Router } from "./Router";

const statusOk = 200;
const body = <T>(request: Request): T => (request.body ?? {}) as T;

const route = <T>(
  r: Omit<RouteDef<T>, `successStatus`> & { successStatus?: typeof HttpStatus.created | typeof statusOk },
): RouteDef<T> => ({ successStatus: statusOk, ...r });

export const Routes = [
  route<{ token: string }>({
    method: `post`,
    path: Endpoints.auth.register,
    run: Router.withBody(async (api, b) => api.auth.register(b), body<ApiAuthBody>),
    successBody: r => ({ token: r.token }),
    successStatus: HttpStatus.created,
  }),
  route<{ token: string }>({
    method: `post`,
    path: Endpoints.auth.login,
    run: Router.withBody(async (api, b) => api.auth.login(b), body<ApiAuthBody>),
    successBody: r => ({ token: r.token }),
  }),
  route<{ ok: true; resetToken?: string }>({
    method: `post`,
    path: Endpoints.auth.forgotPassword,
    run: Router.withBody(async (api, b) => api.auth.forgotPassword(b), body<ApiForgotPasswordBody>),
    successBody: r => r,
  }),
  route<{ ok: true }>({
    method: `post`,
    path: Endpoints.auth.resetPassword,
    run: Router.withBody(async (api, b) => api.auth.resetPassword(b), body<ApiResetPasswordBody>),
    successBody: r => r,
  }),
  route<number>({
    auth: `requireUser`,
    method: `get`,
    path: Endpoints.user.remaining,
    run: Router.withUserId(async (api, id) => api.user.remaining(id)),
    successBody: remaining => ({ remaining }),
  }),
  route<{ text: string }>({
    auth: `requireUser`,
    method: `post`,
    path: Endpoints.process,
    run: Router.withUserIdAndBody(async (api, id, b) => api.process(id, b), body<ApiProcessBody>),
    successBody: r => ({ text: r.text }),
  }),
  route<{ url: string }>({
    auth: `requireUser`,
    method: `post`,
    path: Endpoints.premium.paymentUrl,
    run: Router.withUserId(async (api, id) => api.premium.paymentUrl(id)),
    successBody: r => ({ url: r.url }),
  }),
] as RouteDef[];
