import { ServerApi } from "@snappy/server-api";

const env = import.meta.env as Record<string, unknown>;

const apiBase =
  (env[`VITE_API_URL`] as string | undefined) ?? ((env[`DEV`] as boolean) ? `http://localhost:3000` : ``);

export const api = ServerApi({ auth: { type: `jwt` }, baseUrl: apiBase });
