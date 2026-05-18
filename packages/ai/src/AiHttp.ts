/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
export type AiHttpConfig = { apiKey: string; baseUrl: string };

const headers = (apiKey: string, contentType?: string) => ({
  Authorization: `Bearer ${apiKey}`,
  ...(contentType === undefined ? {} : { "Content-Type": contentType }),
});

const postJson = async <T>(config: AiHttpConfig, path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${config.baseUrl}${path}`, {
    body: JSON.stringify(body),
    headers: headers(config.apiKey, `application/json`),
    method: `POST`,
  });
  if (!response.ok) {
    throw new Error(`ai_http_${response.status}`);
  }

  return (await response.json()) as T;
};

const postStream = async (config: AiHttpConfig, path: string, body: unknown) => {
  const response = await fetch(`${config.baseUrl}${path}`, {
    body: JSON.stringify(body),
    headers: headers(config.apiKey, `application/json`),
    method: `POST`,
  });
  if (!response.ok) {
    throw new Error(`ai_http_${response.status}`);
  }
  if (response.body === null) {
    throw new Error(`ai_http_no_body`);
  }

  return response.body;
};

const postForm = async <T>(config: AiHttpConfig, path: string, form: FormData): Promise<T> => {
  const response = await fetch(`${config.baseUrl}${path}`, {
    body: form,
    headers: headers(config.apiKey),
    method: `POST`,
  });
  if (!response.ok) {
    throw new Error(`ai_http_${response.status}`);
  }

  return (await response.json()) as T;
};

export const AiHttp = { postForm, postJson, postStream };
