import type { AgentMessage, AgentRunOk as AgentRunOkCore } from "@snappy/agent";
import type { ApiPreset, PresetGroupId, PresetLocale } from "@snappy/presets";

export type ApiAgentMessage = AgentMessage;

export type ApiAgentStepBody = {
  /** UI locale for labeling preset form values in the agent message. */
  answersLocale?: PresetLocale;
  clientToolResults?: { content: string; toolCallId: string }[];
  message?: string;
  /** Drives tool set and system prompt: \`free\` = show_ui allowed; preset id = embedded form + no show_ui. */
  presetId?: string;
  sessionId?: string;
  uiAnswers?: Record<string, unknown>;
  uiToolCallId?: string;
};

export type ApiAgentStepErrorCode =
  | `modelsUnavailable`
  | `processingFailed`
  | `relayKeyMissing`
  | `relayOffline`
  | `requestLimitReached`;

export type ApiAgentStepOk = AgentRunOkCore & { sessionId: string };

export type ApiAgentStepResultUnion =
  | ApiAgentStepOk
  | { status: `modelsUnavailable` }
  | { status: `processingFailed` }
  | { status: `relayKeyMissing` }
  | { status: `relayOffline` }
  | { status: `requestLimitReached` };

export type ApiAuthBody = { email?: string; password?: string };

export type ApiAuthMeErrorCode = `unauthorized`;

export type ApiAuthMeResult = ApiOkResult | { status: ApiAuthMeErrorCode };

export type ApiAuthSuccessInternal = { token: string };

export type ApiCommunityModelsResult = { chat: readonly string[]; image: readonly string[]; status: ApiStatusOk };

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

export type ApiPaymentUrlResultUnion = ApiPaymentUrlResult | { status: ApiPaymentUrlErrorCode };

export type ApiPresetByIdResult = { preset: ApiPreset; status: ApiStatusOk } | { status: `presetNotFound` };

export type ApiPresetsResult = { groupOrder: readonly PresetGroupId[]; presets: ApiPreset[]; status: ApiStatusOk };

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
  premiumPeriodDays: number;
  premiumPrice: number;
  premiumUntil?: number;
  remaining: number;
  status: ApiStatusOk;
};

export type ApiResetPasswordBody = { newPassword?: string; token?: string };

export type ApiResetPasswordErrorCode = `invalidOrExpiredToken` | `tokenAndPasswordRequired`;

export type ApiResetPasswordResult = ApiOkResult | { status: ApiResetPasswordErrorCode };

export type ApiSettingsRelayPatchBody = {
  communityImageModel?: string;
  communityTextModel?: string;
  llmProvider?: string;
  ollamaRelayKey?: string;
};

export type ApiSettingsRelayResult = {
  communityImageModel: string;
  communityTextModel: string;
  llmProvider: `community` | `self`;
  ollamaRelayKey: string;
  status: ApiStatusOk;
};

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

export type RelayModelCapability = `chat` | `image`;

/** Declared by each relay client for Ollama models it exposes. */
export type RelayOfferedModel = { capabilities: readonly RelayModelCapability[]; name: string };
