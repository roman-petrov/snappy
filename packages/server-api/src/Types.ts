export type ApiAuthBody = { email?: string; password?: string };

export type ApiAuthResult = { token: string };

export type ApiBotBody = { telegramId?: number };

export type ApiError = { error: string; status: number };

export type ApiForgotPasswordBody = { email?: string };

export type ApiForgotPasswordResult = ApiError | { ok: true; resetToken?: string };

export type ApiLoginResult = ApiAuthResult | ApiError;

export type ApiOkResult = { ok: true };

export type ApiPaymentUrlResult = { url: string };

export type ApiPaymentUrlResultUnion = ApiError | ApiPaymentUrlResult;

export type ApiProcessBody = { feature?: string; text?: string };

export type ApiProcessResult = { text: string };

export type ApiProcessResultUnion = ApiError | ApiProcessResult;

export type ApiRegisterResult = ApiAuthResult | ApiError;

export type ApiRemainingResult = { remaining: number };

export type ApiResetPasswordBody = { newPassword?: string; token?: string };

export type ApiResetPasswordResult = ApiError | ApiOkResult;
