/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
import { Json } from "@snappy/core";

import type {
  ApiBalancePaymentUrlBody,
  ApiBalancePaymentUrlErrorCode,
  ApiBalanceResult,
  ApiUserSettingsBody,
  ApiUserSettingsResult,
} from "./Types";

import { Endpoints } from "./Endpoints";

type Config = { baseUrl: string };

export const ServerApi = (client: Config) => {
  const { baseUrl } = client;
  const base = baseUrl.replace(/\/$/u, ``);
  const jsonHeaders = { "Content-Type": `application/json` };

  const bodyData = async (response: Response) => {
    const text = await response.text();

    return text === `` ? ({} as Record<string, unknown>) : Json.parse<Record<string, unknown>>(text);
  };

  const handleResponse = async <T, E extends string>(
    response: Response,
  ): Promise<[E] extends [never] ? T : T | { status: E }> => {
    if (!response.ok) {
      throw new Error(String(response.status));
    }

    return (await bodyData(response)) as [E] extends [never] ? T : T | { status: E };
  };

  const request = async <T, E extends string>(
    url: string,
    init: RequestInit,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    handleResponse<T, E>(await fetch(url, { ...init, credentials: `include` }));

  const postJson = async <T, E extends string>(
    url: string,
    body: Record<string, unknown>,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    request<T, E>(url, { body: Json.stringify(body), headers: jsonHeaders, method: `POST` });

  const balanceGet = async (): Promise<ApiBalanceResult> =>
    request<ApiBalanceResult, never>(`${base}${Endpoints.user.balance}`, { method: `GET` });

  const balancePaymentUrl = async (body: ApiBalancePaymentUrlBody) =>
    postJson<{ status: `ok`; url: string }, ApiBalancePaymentUrlErrorCode>(`${base}${Endpoints.balance.paymentUrl}`, {
      amount: body.amount,
    });

  const userSettingsGet = async () =>
    request<ApiUserSettingsResult, never>(`${base}${Endpoints.user.settings}`, { method: `GET` });

  const userSettingsSet = async (body: ApiUserSettingsBody) =>
    postJson<ApiUserSettingsResult, never>(`${base}${Endpoints.user.settings}`, body);

  return { balanceGet, balancePaymentUrl, userSettingsGet, userSettingsSet };
};

export type ServerApi = ReturnType<typeof ServerApi>;
