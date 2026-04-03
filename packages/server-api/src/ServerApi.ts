/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
import { _, Json } from "@snappy/core";

import type {
  ApiBalancePaymentUrlBody,
  ApiBalancePaymentUrlErrorCode,
  ApiBalancePaymentUrlResult,
  ApiBalanceResult,
  ApiForgotPasswordErrorCode,
  ApiForgotPasswordResult,
  ApiLlmChatBody,
  ApiLlmChatResult,
  ApiLlmImageBody,
  ApiLlmImageResult,
  ApiLlmModelsResult,
  ApiLlmSpeechRecognitionParameters,
  ApiLlmSpeechRecognitionResult,
  ApiLoginClientErrorCode,
  ApiLoginClientResult,
  ApiOkResult,
  ApiRegisterClientErrorCode,
  ApiRegisterClientResult,
  ApiResetPasswordErrorCode,
  ApiResetPasswordResult,
  ApiUserLlmSettingsBody,
  ApiUserLlmSettingsResult,
} from "./Types";

import { Endpoints } from "./Endpoints";

type Config = { baseUrl: string };

const hasErrorStatus = (data: Record<string, unknown>): data is { status: string } =>
  `status` in data && _.isString((data as { status: unknown }).status) && (data as { status: string }).status !== `ok`;

export const ServerApi = (client: Config) => {
  const { baseUrl } = client;
  const base = baseUrl.replace(/\/$/u, ``);
  const jsonHeaders = { "Content-Type": `application/json` };

  const bodyData = async (response: Response) => {
    const text = await response.text();

    return text === `` ? ({} as Record<string, unknown>) : Json.parse<Record<string, unknown>>(text);
  };

  const httpError = (response: Response, data: Record<string, unknown>) => {
    if (hasErrorStatus(data)) {
      return new Error(data.status);
    }

    return new Error(String(response.status));
  };

  const llmData = async (response: Response) => {
    const data = await bodyData(response);

    if (!response.ok) {
      throw httpError(response, data);
    }

    return data;
  };

  const llmResult = async <T>(response: Response): Promise<T> => {
    const data = await llmData(response);

    if (hasErrorStatus(data)) {
      return data as T;
    }

    return data as T;
  };

  const handleResponse = async <T, E extends string>(
    response: Response,
  ): Promise<[E] extends [never] ? T : T | { status: E }> => {
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const data = await bodyData(response);

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

  const postResponse = async (url: string, body: Record<string, unknown>) =>
    fetch(url, { body: Json.stringify(body), credentials: `include`, headers: jsonHeaders, method: `POST` });

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

  const balanceGet = async (): Promise<ApiBalanceResult> =>
    request<ApiBalanceResult, never>(`${base}${Endpoints.user.balance}`, { method: `GET` });

  const balancePaymentUrl = async (body: ApiBalancePaymentUrlBody): Promise<ApiBalancePaymentUrlResult> =>
    postJson<{ status: `ok`; url: string }, ApiBalancePaymentUrlErrorCode>(`${base}${Endpoints.balance.paymentUrl}`, {
      amount: body.amount,
    });

  const llmChat = async (body: ApiLlmChatBody): Promise<ApiLlmChatResult> =>
    llmResult<ApiLlmChatResult>(await postResponse(`${base}${Endpoints.llm.chat}`, body));

  const llmSpeechRecognition = async (
    parameters: ApiLlmSpeechRecognitionParameters,
  ): Promise<ApiLlmSpeechRecognitionResult> =>
    llmResult<ApiLlmSpeechRecognitionResult>(
      await postResponse(`${base}${Endpoints.llm.speechRecognition}`, {
        fileName: parameters.fileName,
        mimeType: parameters.type.trim() === `` ? `application/octet-stream` : parameters.type.trim(),
        model: parameters.model,
      }),
    );

  const llmImage = async (body: ApiLlmImageBody): Promise<ApiLlmImageResult> => {
    const response = await postResponse(`${base}${Endpoints.llm.image}`, body);
    const contentType = response.headers.get(`content-type`) ?? ``;
    if (response.ok && contentType.includes(`image/png`)) {
      return { bytes: new Uint8Array(await response.arrayBuffer()), status: `ok` };
    }

    const data = await llmData(response);

    if (hasErrorStatus(data)) {
      return data as ApiLlmImageResult;
    }

    throw new Error(`image_http_error`);
  };

  const llmModels = async (): Promise<ApiLlmModelsResult> =>
    request<ApiLlmModelsResult, never>(`${base}${Endpoints.llm.models}`, { method: `GET` });

  const userLlmSettingsGet = async (): Promise<ApiUserLlmSettingsResult> =>
    request<ApiUserLlmSettingsResult, never>(`${base}${Endpoints.user.llmSettings}`, { method: `GET` });

  const userLlmSettingsSet = async (body: ApiUserLlmSettingsBody): Promise<ApiUserLlmSettingsResult> => {
    const response = await postResponse(`${base}${Endpoints.user.llmSettings}`, body);
    const data = await bodyData(response);

    if (hasErrorStatus(data)) {
      return { status: data.status } as ApiUserLlmSettingsResult;
    }

    return data as ApiUserLlmSettingsResult;
  };

  return {
    balanceGet,
    balancePaymentUrl,
    checkAuth,
    forgotPassword,
    llmChat,
    llmImage,
    llmModels,
    llmSpeechRecognition,
    login,
    logout,
    register,
    resetPassword,
    userLlmSettingsGet,
    userLlmSettingsSet,
  };
};

export type ServerApi = ReturnType<typeof ServerApi>;
