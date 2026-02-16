/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
import { _, HttpStatus } from "@snappy/core";

import type { FeatureType } from "./Features";
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
} from "./Types";

import { Endpoints } from "./Endpoints";

type Auth = BotAuth | JwtAuth;

type BotAuth = { apiKey: string; type: `bot` };

type Config = { auth: Auth; baseUrl: string };

type JwtAuth = { type: `jwt` };

const hasErrorStatus = (data: Record<string, unknown>): data is { status: string } =>
  `status` in data && _.isString((data as { status: unknown }).status) && (data as { status: string }).status !== `ok`;

export const ServerApi = (config: Config) => {
  const { auth, baseUrl } = config;
  const base = baseUrl.replace(/\/$/u, ``);
  const jsonHeaders = { "Content-Type": `application/json` };
  const botHeader = (apiKey: string) => ({ "Content-Type": `application/json`, "X-Bot-Api-Key": apiKey });
  const credentials: RequestCredentials = auth.type === `jwt` ? `include` : `same-origin`;

  const handleResponse = async <T, E extends string>(
    response: Response,
    parse: (data: Record<string, unknown>) => T,
  ): Promise<[E] extends [never] ? T : T | { status: E }> => {
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    if (hasErrorStatus(data)) {
      return { status: data.status } as [E] extends [never] ? T : T | { status: E };
    }

    return parse(data) as [E] extends [never] ? T : T | { status: E };
  };

  const request = async <T, E extends string>(
    url: string,
    init: RequestInit,
    parse: (data: Record<string, unknown>) => T,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    handleResponse<T, E>(await fetch(url, { ...init, credentials }), parse);

  const postJson = async <T, E extends string>(
    url: string,
    body: Record<string, unknown>,
    parse: (data: Record<string, unknown>) => T,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    request<T, E>(url, { body: JSON.stringify(body), headers: jsonHeaders, method: `POST` }, parse);

  const parseOk = (): ApiOkResult => ({ status: `ok` });

  const parseUrl = (data: Record<string, unknown>): ApiPaymentUrlResult => {
    const url = data[`url`];
    if (!_.isString(url)) {
      throw new TypeError(`Invalid response`);
    }

    return { status: `ok`, url };
  };

  const parseText = (data: Record<string, unknown>): ApiProcessResult => ({
    status: `ok`,
    text: _.isString(data[`text`]) ? data[`text`] : ``,
  });

  const parseRemaining = (data: Record<string, unknown>): ApiRemainingResult => ({
    remaining: _.isNumber(data[`remaining`]) ? data[`remaining`] : 0,
    status: `ok`,
  });

  const forgotPassword = async (email: string): Promise<ApiForgotPasswordResult> =>
    postJson<ApiOkResult, ApiForgotPasswordErrorCode>(`${base}${Endpoints.auth.forgotPassword}`, { email }, parseOk);

  const logout = async () => postJson(`${base}${Endpoints.auth.logout}`, {}, parseOk);

  const login = async (email: string, password: string): Promise<ApiLoginClientResult> =>
    postJson<ApiOkResult, ApiLoginClientErrorCode>(`${base}${Endpoints.auth.login}`, { email, password }, parseOk);

  const register = async (email: string, password: string): Promise<ApiRegisterClientResult> =>
    postJson<ApiOkResult, ApiRegisterClientErrorCode>(
      `${base}${Endpoints.auth.register}`,
      { email, password },
      parseOk,
    );

  const resetPassword = async (token: string, newPassword: string): Promise<ApiResetPasswordResult> =>
    postJson<ApiOkResult, ApiResetPasswordErrorCode>(
      `${base}${Endpoints.auth.resetPassword}`,
      { newPassword, token },
      parseOk,
    );

  const checkAuth = async (): Promise<ApiOkResult> =>
    auth.type === `jwt`
      ? request<ApiOkResult, never>(`${base}${Endpoints.auth.me}`, { method: `GET` }, parseOk)
      : Promise.reject(new Error(String(HttpStatus.unauthorized)));

  const remaining = async (authParameter: number | string): Promise<ApiRemainingResult> =>
    auth.type === `jwt`
      ? request<ApiRemainingResult, never>(`${base}${Endpoints.user.remaining}`, { method: `GET` }, parseRemaining)
      : request<ApiRemainingResult, never>(
          `${base}${Endpoints.user.remaining}?telegramId=${authParameter}`,
          { headers: botHeader(auth.apiKey), method: `GET` },
          parseRemaining,
        );

  const process = async (
    authParameter: number | string,
    text: string,
    feature: FeatureType,
  ): Promise<ApiProcessResultUnion> =>
    auth.type === `jwt`
      ? request<ApiProcessResult, ApiProcessErrorCode>(
          `${base}${Endpoints.process}`,
          { body: JSON.stringify({ feature, text }), headers: jsonHeaders, method: `POST` },
          parseText,
        )
      : request<ApiProcessResult, ApiProcessErrorCode>(
          `${base}${Endpoints.process}`,
          {
            body: JSON.stringify({ feature, telegramId: authParameter, text }),
            headers: botHeader(auth.apiKey),
            method: `POST`,
          },
          parseText,
        );

  const premiumUrl = async (authParameter: number | string): Promise<ApiPaymentUrlResultUnion> =>
    auth.type === `jwt`
      ? request<ApiPaymentUrlResult, ApiPaymentUrlErrorCode>(
          `${base}${Endpoints.premium.paymentUrl}`,
          { body: JSON.stringify({}), headers: jsonHeaders, method: `POST` },
          parseUrl,
        )
      : request<ApiPaymentUrlResult, ApiPaymentUrlErrorCode>(
          `${base}${Endpoints.premium.paymentUrl}`,
          { body: JSON.stringify({ telegramId: authParameter }), headers: botHeader(auth.apiKey), method: `POST` },
          parseUrl,
        );

  return { checkAuth, forgotPassword, login, logout, premiumUrl, process, register, remaining, resetPassword };
};

export type ServerApi = ReturnType<typeof ServerApi>;
