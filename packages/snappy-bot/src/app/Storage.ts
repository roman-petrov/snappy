 
import type { FeatureType } from "@snappy/snappy";

const headers = (apiKey: string) => ({ "Content-Type": `application/json`, "X-Bot-Api-Key": apiKey });

const remainingRequests = async (
  apiBaseUrl: string,
  apiKey: string,
  telegramId: number,
  _freeRequestLimit: number,
  _telegramUsername?: string,
): Promise<number> => {
  const url = `${apiBaseUrl.replace(/\/$/u, ``)}/api/user/remaining?telegramId=${telegramId}`;
  const res = await fetch(url, { headers: headers(apiKey), method: `GET` });

  if (!res.ok) {
    return 0;
  }

  const data = (await res.json()) as { remaining?: number };

  return typeof data.remaining === `number` ? data.remaining : 0;
};

const canMakeRequest = async (
  apiBaseUrl: string,
  apiKey: string,
  telegramId: number,
  freeRequestLimit: number,
  telegramUsername?: string,
): Promise<boolean> => {
  const remaining = await remainingRequests(apiBaseUrl, apiKey, telegramId, freeRequestLimit, telegramUsername);

  return remaining > 0;
};

const process = async (
  apiBaseUrl: string,
  apiKey: string,
  telegramId: number,
  text: string,
  feature: FeatureType,
  _telegramUsername?: string,
): Promise<string> => {
  const url = `${apiBaseUrl.replace(/\/$/u, ``)}/api/process`;

  const res = await fetch(url, {
    body: JSON.stringify({ feature, telegramId, text }),
    headers: headers(apiKey),
    method: `POST`,
  });

  if (!res.ok) {
    const error = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(error.error ?? `Process failed`);
  }

  const data = (await res.json()) as { text?: string };

  return typeof data.text === `string` ? data.text : ``;
};

const fetchPaymentUrl = async (apiBaseUrl: string, apiKey: string, telegramId: number): Promise<string> => {
  const url = `${apiBaseUrl.replace(/\/$/u, ``)}/api/premium/payment-url`;
  const res = await fetch(url, { body: JSON.stringify({ telegramId }), headers: headers(apiKey), method: `POST` });

  if (!res.ok) {
    const error = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(error.error ?? `Payment failed`);
  }

  const data = (await res.json()) as { url?: string };

  if (typeof data.url !== `string`) {
    throw new TypeError(`No payment URL`);
  }

  return data.url;
};

export type StorageConfig = { apiBaseUrl: string; apiKey: string };

export const Storage = (config: StorageConfig) => {
  const { apiBaseUrl, apiKey } = config;

  return {
    canMakeRequest: async (telegramId: number, freeRequestLimit: number, telegramUsername?: string) =>
      canMakeRequest(apiBaseUrl, apiKey, telegramId, freeRequestLimit, telegramUsername),
    paymentUrl: async (telegramId: number) => fetchPaymentUrl(apiBaseUrl, apiKey, telegramId),
    process: async (telegramId: number, text: string, feature: FeatureType, telegramUsername?: string) =>
      process(apiBaseUrl, apiKey, telegramId, text, feature, telegramUsername),
    remainingRequests: async (telegramId: number, freeRequestLimit: number, telegramUsername?: string) =>
      remainingRequests(apiBaseUrl, apiKey, telegramId, freeRequestLimit, telegramUsername),
  };
};

export type Storage = ReturnType<typeof Storage>;
