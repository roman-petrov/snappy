/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
import { _ } from "@snappy/core";
import type { FeatureType } from "@snappy/snappy";

import { Endpoints } from "./Endpoints";

type Auth = BotAuth | JwtAuth;

type BotAuth = { apiKey: string; type: `bot` };

type Config = { auth: Auth; baseUrl: string };

type JwtAuth = { type: `jwt` };

const jsonHeaders = { "Content-Type": `application/json` };
const bearerHeader = (token: string) => ({ Authorization: `Bearer ${token}` });
const botHeader = (apiKey: string) => ({ "Content-Type": `application/json`, "X-Bot-Api-Key": apiKey });

const handleResponse = async <T>(response: Response, parse: (data: Record<string, unknown>) => T): Promise<T> => {
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown> & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? `Request failed`);
  }

  return parse(data);
};

const request = async <T>(url: string, init: RequestInit, parse: (data: Record<string, unknown>) => T): Promise<T> =>
  handleResponse(await fetch(url, init), parse);

const parseOk = () => ({ ok: true }) as const;

const parseToken = (data: Record<string, unknown>) => {
  const token = data[`token`];
  if (!_.isString(token)) {
    throw new TypeError(`Invalid response`);
  }

  return { token };
};

const parseUrl = (data: Record<string, unknown>) => {
  const url = data[`url`];
  if (!_.isString(url)) {
    throw new TypeError(`Invalid response`);
  }

  return { url };
};

const parseText = (data: Record<string, unknown>) => ({ text: _.isString(data[`text`]) ? data[`text`] : `` });

const parseRemaining = (data: Record<string, unknown>) => ({
  remaining: _.isNumber(data[`remaining`]) ? data[`remaining`] : 0,
});

export const ServerApi = (config: Config) => {
  const { auth, baseUrl } = config;
  const base = baseUrl.replace(/\/$/u, ``);

  const forgotPassword = async (email: string) =>
    request(
      `${base}${Endpoints.auth.forgotPassword}`,
      { body: JSON.stringify({ email }), headers: jsonHeaders, method: `POST` },
      parseOk,
    );

  const login = async (email: string, password: string) =>
    request(
      `${base}${Endpoints.auth.login}`,
      { body: JSON.stringify({ email, password }), headers: jsonHeaders, method: `POST` },
      parseToken,
    );

  const register = async (email: string, password: string) =>
    request(
      `${base}${Endpoints.auth.register}`,
      { body: JSON.stringify({ email, password }), headers: jsonHeaders, method: `POST` },
      parseToken,
    );

  const resetPassword = async (token: string, newPassword: string) =>
    request(
      `${base}${Endpoints.auth.resetPassword}`,
      { body: JSON.stringify({ newPassword, token }), headers: jsonHeaders, method: `POST` },
      parseOk,
    );

  const remaining = async (authParameter: number | string) =>
    auth.type === `jwt`
      ? request(
          `${base}${Endpoints.user.remaining}`,
          { headers: bearerHeader(authParameter as string), method: `GET` },
          parseRemaining,
        )
      : request(
          `${base}${Endpoints.user.remaining}?telegramId=${authParameter}`,
          { headers: botHeader(auth.apiKey), method: `GET` },
          parseRemaining,
        );

  const process = async (authParameter: number | string, text: string, feature: FeatureType) =>
    auth.type === `jwt`
      ? request(
          `${base}${Endpoints.process}`,
          {
            body: JSON.stringify({ feature, text }),
            headers: { ...jsonHeaders, ...bearerHeader(authParameter as string) },
            method: `POST`,
          },
          parseText,
        )
      : request(
          `${base}${Endpoints.process}`,
          {
            body: JSON.stringify({ feature, telegramId: authParameter, text }),
            headers: botHeader(auth.apiKey),
            method: `POST`,
          },
          parseText,
        );

  const premiumUrl = async (authParameter: number | string) =>
    auth.type === `jwt`
      ? request(
          `${base}${Endpoints.premium.paymentUrl}`,
          {
            body: JSON.stringify({}),
            headers: { ...jsonHeaders, ...bearerHeader(authParameter as string) },
            method: `POST`,
          },
          parseUrl,
        )
      : request(
          `${base}${Endpoints.premium.paymentUrl}`,
          { body: JSON.stringify({ telegramId: authParameter }), headers: botHeader(auth.apiKey), method: `POST` },
          parseUrl,
        );

  return { forgotPassword, login, premiumUrl, process, register, remaining, resetPassword };
};

export type ServerApi = ReturnType<typeof ServerApi>;
