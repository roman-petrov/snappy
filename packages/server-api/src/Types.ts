export type ApiAuthBody = { email?: string; password?: string };

export type ApiAuthMeErrorCode = `unauthorized`;

export type ApiAuthMeResult = ApiOkResult | { status: ApiAuthMeErrorCode };

export type ApiAuthSuccessInternal = { token: string };

export type ApiBotBody = { telegramId?: number };

export type ApiForgotPasswordBody = { email?: string };

export type ApiForgotPasswordErrorCode = `emailRequired`;

export type ApiForgotPasswordResult =
  | { resetToken?: string; status: ApiStatusOk }
  | { status: ApiForgotPasswordErrorCode };

export type ApiLoginClientErrorCode = Exclude<ApiLoginErrorCode, `jwtUnavailable`>;

export type ApiLoginClientResult = ApiOkResult | { status: ApiLoginClientErrorCode };

export type ApiLoginErrorCode = `emailInvalidOrMissing` | `invalidCredentials` | `jwtUnavailable`;

export type ApiLoginResult = ApiAuthSuccessInternal | { status: ApiLoginErrorCode };

export type ApiOkResult = { status: ApiStatusOk };

export type ApiPaymentUrlErrorCode = `paymentError`;

export type ApiPaymentUrlResult = { status: ApiStatusOk; url: string };

import type { SnappyOptions } from "@snappy/domain";

export type ApiPaymentUrlResultUnion = ApiPaymentUrlResult | { status: ApiPaymentUrlErrorCode };

export type ApiProcessBody = { options: SnappyOptions; text: string };

export type ApiProcessErrorCode = `processingFailed` | `requestLimitReached`;

export type ApiProcessResult = { status: ApiStatusOk; text: string };

export type ApiProcessResultUnion = ApiProcessResult | { status: ApiProcessErrorCode };

export type ApiRegisterClientErrorCode = Exclude<ApiRegisterErrorCode, `jwtUnavailable`>;

export type ApiRegisterClientResult = ApiOkResult | { status: ApiRegisterClientErrorCode };

export type ApiRegisterErrorCode =
  | `emailAlreadyRegistered`
  | `emailInvalidOrMissing`
  | `jwtUnavailable`
  | `passwordInvalid`;

export type ApiRegisterResult = ApiAuthSuccessInternal | { status: ApiRegisterErrorCode };

export type ApiRemainingResult = {
  autoRenew?: boolean;
  freeRequestLimit: number;
  isPremium?: boolean;
  nextBillingAt?: number;
  nextResetAt?: number;
  options: SnappyOptions;
  premiumPeriodDays: number;
  premiumPrice: number;
  premiumUntil?: number;
  remaining: number;
  status: ApiStatusOk;
};

export type ApiResetPasswordBody = { newPassword?: string; token?: string };

export type ApiResetPasswordErrorCode = `invalidOrExpiredToken` | `tokenAndPasswordRequired`;

export type ApiResetPasswordResult = ApiOkResult | { status: ApiResetPasswordErrorCode };

export type ApiStatusOk = `ok`;

export type ApiSubscriptionAutoRenewBody = { enabled: boolean };

export type ApiSubscriptionAutoRenewErrorCode = `subscriptionNotFound`;

export type ApiSubscriptionAutoRenewResult = ApiOkResult | { status: ApiSubscriptionAutoRenewErrorCode };

export type ApiSubscriptionDeleteBody = { confirmLoseTime?: boolean };

export type ApiSubscriptionDeleteErrorCode = `confirmRequired` | `subscriptionNotFound`;

export type ApiSubscriptionDeleteResult = ApiOkResult | { status: ApiSubscriptionDeleteErrorCode };

export type ApiSubscriptionRenewErrorCode = `subscriptionNotFound`;

export type ApiSubscriptionRenewResult = ApiOkResult | { status: ApiSubscriptionRenewErrorCode };

export type ApiSubscriptionResult = {
  autoRenew?: boolean;
  freeRequestLimit: number;
  nextBillingAt?: number;
  premiumPeriodDays: number;
  premiumPrice: number;
  premiumUntil?: number;
  status: ApiStatusOk;
};
