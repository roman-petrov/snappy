const env = import.meta.env as Record<string, unknown>;

const apiBase = (env[`VITE_API_URL`] as string | undefined) ?? ((env[`DEV`] as boolean) ? `http://localhost:3000` : ``);

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export const api = {
  forgotPassword: async (email: string) =>
    fetch(`${apiBase}/api/auth/forgot-password`, {
      body: JSON.stringify({ email }),
      headers: { "Content-Type": `application/json` },
      method: `POST`,
    }),

  login: async (email: string, password: string) =>
    fetch(`${apiBase}/api/auth/login`, {
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": `application/json` },
      method: `POST`,
    }),

  premiumUrl: async (token: string) =>
    fetch(`${apiBase}/api/premium/payment-url`, {
      body: JSON.stringify({}),
      headers: { "Content-Type": `application/json`, ...authHeader(token) },
      method: `POST`,
    }),

  process: async (token: string, text: string, feature: string) =>
    fetch(`${apiBase}/api/process`, {
      body: JSON.stringify({ feature, text }),
      headers: { "Content-Type": `application/json`, ...authHeader(token) },
      method: `POST`,
    }),

  register: async (email: string, password: string) =>
    fetch(`${apiBase}/api/auth/register`, {
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": `application/json` },
      method: `POST`,
    }),

  remaining: async (token: string) =>
    fetch(`${apiBase}/api/user/remaining`, { headers: authHeader(token), method: `GET` }),

  resetPassword: async (token: string, newPassword: string) =>
    fetch(`${apiBase}/api/auth/reset-password`, {
      body: JSON.stringify({ newPassword, token }),
      headers: { "Content-Type": `application/json` },
      method: `POST`,
    }),
};
