export type ApiAuthBody = { email?: string; password?: string };

export type ApiAuthResult = { token: string };

export type ApiBotBody = { telegramId?: number };

export type ApiForgotPasswordBody = { email?: string };

export type ApiOkResult = { ok: true };

export type ApiPaymentUrlResult = { url: string };

export type ApiProcessBody = { feature?: string; text?: string };

export type ApiProcessResult = { text: string };

export type ApiRemainingResult = { remaining: number };

export type ApiResetPasswordBody = { newPassword?: string; token?: string };
