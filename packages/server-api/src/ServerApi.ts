/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
import { _, Json } from "@snappy/core";

import type {
  ApiAgentStepBody,
  ApiAgentStepResultUnion,
  ApiCommunityModelsResult,
  ApiForgotPasswordErrorCode,
  ApiForgotPasswordResult,
  ApiLoginClientErrorCode,
  ApiLoginClientResult,
  ApiOkResult,
  ApiPaymentUrlErrorCode,
  ApiPaymentUrlResult,
  ApiPaymentUrlResultUnion,
  ApiPresetByIdResult,
  ApiPresetsResult,
  ApiRegisterClientErrorCode,
  ApiRegisterClientResult,
  ApiRemainingResult,
  ApiResetPasswordErrorCode,
  ApiResetPasswordResult,
  ApiSettingsRelayPatchBody,
  ApiSettingsRelayResult,
  ApiSubscriptionAutoRenewErrorCode,
  ApiSubscriptionAutoRenewResult,
  ApiSubscriptionDeleteErrorCode,
  ApiSubscriptionDeleteResult,
  ApiSubscriptionRenewErrorCode,
  ApiSubscriptionRenewResult,
  ApiSubscriptionResult,
} from "./Types";

import { Endpoints } from "./Endpoints";

type Config = { baseUrl: string };

const hasErrorStatus = (data: Record<string, unknown>): data is { status: string } =>
  `status` in data && _.isString((data as { status: unknown }).status) && (data as { status: string }).status !== `ok`;

export const ServerApi = (client: Config) => {
  const { baseUrl } = client;
  const base = baseUrl.replace(/\/$/u, ``);
  const jsonHeaders = { "Content-Type": `application/json` };

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
    handleResponse<T, E>(await fetch(url, { ...init, credentials: `include` }));

  const postJson = async <T, E extends string>(
    url: string,
    body: Record<string, unknown>,
  ): Promise<[E] extends [never] ? T : T | { status: E }> =>
    request<T, E>(url, { body: Json.stringify(body), headers: jsonHeaders, method: `POST` });

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
    request<ApiOkResult, never>(`${base}${Endpoints.auth.me}`, { method: `GET` });

  const remaining = async (): Promise<ApiRemainingResult> =>
    request<ApiRemainingResult, never>(`${base}${Endpoints.user.remaining}`, { method: `GET` });

  const presetById = async (id: string, locale: `en` | `ru`): Promise<ApiPresetByIdResult> =>
    request<ApiPresetByIdResult, never>(`${base}${Endpoints.presets.one(id)}?locale=${locale}`, { method: `GET` });

  const presetsList = async (locale: `en` | `ru`): Promise<ApiPresetsResult> =>
    request<ApiPresetsResult, never>(`${base}${Endpoints.presets.list}?locale=${locale}`, { method: `GET` });

  const agentStep = async (body: ApiAgentStepBody): Promise<ApiAgentStepResultUnion> =>
    postJson<
      Exclude<ApiAgentStepResultUnion, { status: string }>,
      `modelsUnavailable` | `processingFailed` | `relayKeyMissing` | `relayOffline` | `requestLimitReached`
    >(`${base}${Endpoints.agent.step}`, body as Record<string, unknown>);

  const agentSession = async (sessionId: string) =>
    request<{ messages: unknown[]; sessionId: string; status: `ok` }, never>(
      `${base}${Endpoints.agent.session(sessionId)}`,
      { method: `GET` },
    );

  const premiumUrl = async (): Promise<ApiPaymentUrlResultUnion> =>
    postJson<ApiPaymentUrlResult, ApiPaymentUrlErrorCode>(`${base}${Endpoints.premium.paymentUrl}`, {});

  const subscriptionSetAutoRenew = async (enabled: boolean): Promise<ApiSubscriptionAutoRenewResult> =>
    postJson<ApiOkResult, ApiSubscriptionAutoRenewErrorCode>(`${base}${Endpoints.subscription.autoRenew}`, { enabled });

  const subscriptionRenew = async (): Promise<ApiSubscriptionRenewResult> =>
    postJson<ApiOkResult, ApiSubscriptionRenewErrorCode>(`${base}${Endpoints.subscription.renew}`, {});

  const subscriptionDelete = async (confirmLoseTime = false): Promise<ApiSubscriptionDeleteResult> =>
    postJson<ApiOkResult, ApiSubscriptionDeleteErrorCode>(`${base}${Endpoints.subscription.delete}`, {
      confirmLoseTime,
    });

  const subscriptionGet = async (): Promise<ApiSubscriptionResult> =>
    request<ApiSubscriptionResult, never>(`${base}${Endpoints.subscription.get}`, { method: `GET` });

  const settingsRelayGet = async (): Promise<ApiSettingsRelayResult> =>
    request<ApiSettingsRelayResult, never>(`${base}${Endpoints.settings.relay}`, { method: `GET` });

  const settingsRelayPatch = async (body: ApiSettingsRelayPatchBody): Promise<ApiOkResult> =>
    postJson<ApiOkResult, never>(`${base}${Endpoints.settings.relay}`, body as Record<string, unknown>);

  const communityModelsGet = async (): Promise<ApiCommunityModelsResult> =>
    request<ApiCommunityModelsResult, never>(`${base}${Endpoints.settings.communityModels}`, { method: `GET` });

  return {
    agentSession,
    agentStep,
    checkAuth,
    communityModelsGet,
    forgotPassword,
    login,
    logout,
    premiumUrl,
    presetById,
    presetsList,
    register,
    remaining,
    resetPassword,
    settingsRelayGet,
    settingsRelayPatch,
    subscriptionDelete,
    subscriptionGet,
    subscriptionRenew,
    subscriptionSetAutoRenew,
  };
};

export type ServerApi = ReturnType<typeof ServerApi>;
