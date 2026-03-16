/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
import type { SnappyOptions } from "@snappy/domain";

import { _, HttpStatus, Json } from "@snappy/core";

import type {
  ApiForgotPasswordErrorCode,
  ApiForgotPasswordResult,
  ApiLoginClientErrorCode,
  ApiLoginClientResult,
  ApiOkResult,
  ApiPaymentUrlErrorCode,
  ApiPaymentUrlResult,
  ApiPaymentUrlResultUnion,
  ApiProcessErrorCode,
  ApiProcessResult,
  ApiProcessResultUnion,
  ApiRegisterClientErrorCode,
  ApiRegisterClientResult,
  ApiRemainingResult,
  ApiResetPasswordErrorCode,
  ApiResetPasswordResult,
  ApiSubscriptionAutoRenewErrorCode,
  ApiSubscriptionAutoRenewResult,
  ApiSubscriptionDeleteErrorCode,
  ApiSubscriptionDeleteResult,
  ApiSubscriptionRenewErrorCode,
  ApiSubscriptionRenewResult,
  ApiSubscriptionResult,
} from "./Types";

import { Endpoints } from "./Endpoints";

type Auth = BotAuth | JwtAuth;

type BotAuth = { apiKey: string; type: `bot` };

type Config = { auth: Auth; baseUrl: string };

type JwtAuth = { type: `jwt` };

const hasErrorStatus = (data: Record<string, unknown>): data is { status: string } =>
  `status` in data && _.isString((data as { status: unknown }).status) && (data as { status: string }).status !== `ok`;

export const ServerApi = (client: Config) => {
  const { auth, baseUrl } = client;
  const base = baseUrl.replace(/\/$/u, ``);
  const jsonHeaders = { "Content-Type": `application/json` };
  const botHeader = (apiKey: string) => ({ "Content-Type": `application/json`, "X-Bot-Api-Key": apiKey });
  const credentials: RequestCredentials = auth.type === `jwt` ? `include` : `same-origin`;

  const handleResponse = async <T, E extends string>(
    response: Response,
  ): Promise<[E] extends [never] ? T : T | { status: E }> => {
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const text = await response.text();
    const data = text === `` ? ({} as Record<string, unknown>) : Json.parse<Record<string, unknown>>(text);

    if (hasErrorStatus(data)) {
      return { status: data.status } as [E] extends [never] ? T : T | { status: E };
    }

    return data as [E] extends [never] ? T : T | { status: E };
  };

  const request = async <T, E extends string>(
    url: string,
    init: RequestInit,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    handleResponse<T, E>(await fetch(url, { ...init, credentials }));

  const postJson = async <T, E extends string>(
    url: string,
    body: Record<string, unknown>,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    request<T, E>(url, { body: Json.stringify(body), headers: jsonHeaders, method: `POST` });

  const postAuthJson = async <T, E extends string>(
    url: string,
    authParameter: number | string,
    jwtBody: Record<string, unknown> = {},
    botBody: Record<string, unknown> = {},
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    auth.type === `jwt`
      ? postJson<T, E>(url, jwtBody)
      : request<T, E>(url, {
          body: Json.stringify({ ...botBody, telegramId: authParameter }),
          headers: botHeader(auth.apiKey),
          method: `POST`,
        });

  const requestAuthGet = async <T, E extends string>(
    jwtUrl: string,
    botUrl: string,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    auth.type === `jwt`
      ? request<T, E>(jwtUrl, { method: `GET` })
      : request<T, E>(botUrl, { headers: botHeader(auth.apiKey), method: `GET` });

  const forgotPassword = async (email: string): Promise<ApiForgotPasswordResult> =>
    postJson<ApiOkResult, ApiForgotPasswordErrorCode>(`${base}${Endpoints.auth.forgotPassword}`, { email });

  const logout = async () => postJson<ApiOkResult, never>(`${base}${Endpoints.auth.logout}`, {});

  const login = async (email: string, password: string): Promise<ApiLoginClientResult> =>
    postJson<ApiOkResult, ApiLoginClientErrorCode>(`${base}${Endpoints.auth.login}`, { email, password });

  const register = async (email: string, password: string): Promise<ApiRegisterClientResult> =>
    postJson<ApiOkResult, ApiRegisterClientErrorCode>(`${base}${Endpoints.auth.register}`, { email, password });

  const resetPassword = async (token: string, newPassword: string): Promise<ApiResetPasswordResult> =>
    postJson<ApiOkResult, ApiResetPasswordErrorCode>(`${base}${Endpoints.auth.resetPassword}`, { newPassword, token });

  const checkAuth = async (): Promise<ApiOkResult> =>
    auth.type === `jwt`
      ? request<ApiOkResult, never>(`${base}${Endpoints.auth.me}`, { method: `GET` })
      : Promise.reject(new Error(String(HttpStatus.unauthorized)));

  const remaining = async (authParameter: number | string): Promise<ApiRemainingResult> =>
    requestAuthGet<ApiRemainingResult, never>(
      `${base}${Endpoints.user.remaining}`,
      `${base}${Endpoints.user.remaining}?telegramId=${authParameter}`,
    );

  const process = async (
    authParameter: number | string,
    text: string,
    options: SnappyOptions,
  ): Promise<ApiProcessResultUnion> =>
    postAuthJson<ApiProcessResult, ApiProcessErrorCode>(
      `${base}${Endpoints.process}`,
      authParameter,
      { options, text },
      { options, text },
    );

  const premiumUrl = async (authParameter: number | string): Promise<ApiPaymentUrlResultUnion> =>
    postAuthJson<ApiPaymentUrlResult, ApiPaymentUrlErrorCode>(`${base}${Endpoints.premium.paymentUrl}`, authParameter);

  const subscriptionSetAutoRenew = async (
    authParameter: number | string,
    enabled: boolean,
  ): Promise<ApiSubscriptionAutoRenewResult> =>
    postAuthJson<ApiOkResult, ApiSubscriptionAutoRenewErrorCode>(
      `${base}${Endpoints.subscription.autoRenew}`,
      authParameter,
      { enabled },
      { enabled },
    );

  const subscriptionRenew = async (authParameter: number | string): Promise<ApiSubscriptionRenewResult> =>
    postAuthJson<ApiOkResult, ApiSubscriptionRenewErrorCode>(`${base}${Endpoints.subscription.renew}`, authParameter);

  const subscriptionDelete = async (
    authParameter: number | string,
    confirmLoseTime = false,
  ): Promise<ApiSubscriptionDeleteResult> =>
    postAuthJson<ApiOkResult, ApiSubscriptionDeleteErrorCode>(
      `${base}${Endpoints.subscription.delete}`,
      authParameter,
      { confirmLoseTime },
      { confirmLoseTime },
    );

  const subscriptionGet = async (authParameter: number | string): Promise<ApiSubscriptionResult> =>
    requestAuthGet<ApiSubscriptionResult, never>(
      `${base}${Endpoints.subscription.get}`,
      `${base}${Endpoints.subscription.get}?telegramId=${authParameter}`,
    );

  return {
    checkAuth,
    forgotPassword,
    login,
    logout,
    premiumUrl,
    process,
    register,
    remaining,
    resetPassword,
    subscriptionDelete,
    subscriptionGet,
    subscriptionRenew,
    subscriptionSetAutoRenew,
  };
};

export type ServerApi = ReturnType<typeof ServerApi>;
