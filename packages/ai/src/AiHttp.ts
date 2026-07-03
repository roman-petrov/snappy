/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { MimeType } from "@snappy/core";

export type AiHttpConfig = { apiKey: string; baseUrl: string };

const headers = (apiKey: string, contentType?: MimeType) => ({
  Authorization: `Bearer ${apiKey}`,
  ...(contentType === undefined ? {} : { "Content-Type": contentType }),
});

const post = async (config: AiHttpConfig, path: string, body: BodyInit, contentType?: MimeType) => {
  const response = await fetch(`${config.baseUrl}${path}`, {
    body,
    headers: headers(config.apiKey, contentType),
    method: `POST`,
  });
  if (!response.ok) {
    throw new Error(`ai_http_${response.status}`);
  }

  return response;
};

const postJson = async <T>(config: AiHttpConfig, path: string, body: unknown): Promise<T> => {
  const response = await post(config, path, JSON.stringify(body), MimeType.json);

  return (await response.json()) as T;
};

const postStream = async (config: AiHttpConfig, path: string, body: unknown) => {
  const response = await post(config, path, JSON.stringify(body), MimeType.json);
  if (response.body === null) {
    throw new Error(`ai_http_no_body`);
  }

  return response.body;
};

const postForm = async <T>(config: AiHttpConfig, path: string, form: FormData): Promise<T> => {
  const response = await post(config, path, form);

  return (await response.json()) as T;
};

export const AiHttp = { postForm, postJson, postStream };
