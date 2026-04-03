export type ApiAuthBody = { email?: string; password?: string };

export type ApiAuthMeErrorCode = `unauthorized`;

export type ApiAuthMeResult = ApiOkResult | { status: ApiAuthMeErrorCode };

export type ApiAuthSuccessInternal = { token: string };

export type ApiBalancePaymentUrlBody = { amount?: number };

export type ApiBalancePaymentUrlErrorCode = `invalidAmount` | `paymentError`;

export type ApiBalancePaymentUrlResult =
  | { status: ApiBalancePaymentUrlErrorCode }
  | { status: ApiStatusOk; url: string };

export type ApiBalanceResult = { balance: number; status: ApiStatusOk };

export type ApiForgotPasswordBody = { email?: string };

export type ApiForgotPasswordErrorCode = `emailRequired`;

export type ApiForgotPasswordResult =
  | { resetToken?: string; status: ApiStatusOk }
  | { status: ApiForgotPasswordErrorCode };

export type ApiLlmChatBody = { model: string; prompt: string };

export type ApiLlmChatErrorCode = Exclude<ApiLlmChatResult, ApiLlmChatOk>[`status`];

export type ApiLlmChatOk = Extract<ApiLlmChatResult, { status: `ok` }>;

export type ApiLlmChatResult = { status: `badRequest` } | { status: `balanceBlocked` } | { status: `ok`; text: string };

export type ApiLlmImageBody = {
  model: string;
  prompt: string;
  size: `256x256` | `512x512` | `1024x1024` | `1024x1792` | `1792x1024`;
};

export type ApiLlmImageOk = Extract<ApiLlmImageResult, { status: `ok` }>;

export type ApiLlmImageResult =
  | { bytes: Uint8Array; status: `ok` }
  | { status: `badRequest` }
  | { status: `balanceBlocked` };

export type ApiLlmModelDescriptor = { name: string; source: string; type: `chat` | `image` | `speech-recognition` };

export type ApiLlmModelsResult = {
  settings: { maxPromptImageLength: number; maxSpeechFileMegaBytes: number; models: ApiLlmModelDescriptor[] };
  status: `ok`;
};

export type ApiLlmSpeechRecognitionBody = { fileBase64: string; fileName: string; mimeType: string; model: string };

export type ApiLlmSpeechRecognitionParameters = { data: ArrayBuffer; fileName: string; model: string; type: string };

export type ApiLlmSpeechRecognitionResult =
  | { status: `badRequest` }
  | { status: `balanceBlocked` }
  | { status: `ok`; text: string };

export type ApiLoginClientErrorCode = Exclude<ApiLoginErrorCode, `jwtUnavailable`>;

export type ApiLoginClientResult = ApiOkResult | { status: ApiLoginClientErrorCode };

export type ApiLoginErrorCode = `emailInvalidOrMissing` | `invalidCredentials` | `jwtUnavailable`;

export type ApiLoginResult = ApiAuthSuccessInternal | { status: ApiLoginErrorCode };

export type ApiOkResult = { status: ApiStatusOk };

export type ApiRegisterClientErrorCode = Exclude<ApiRegisterErrorCode, `jwtUnavailable`>;

export type ApiRegisterClientResult = ApiOkResult | { status: ApiRegisterClientErrorCode };

export type ApiRegisterErrorCode =
  | `emailAlreadyRegistered`
  | `emailInvalidOrMissing`
  | `jwtUnavailable`
  | `passwordInvalid`;

export type ApiRegisterResult = ApiAuthSuccessInternal | { status: ApiRegisterErrorCode };

export type ApiResetPasswordBody = { newPassword?: string; token?: string };

export type ApiResetPasswordErrorCode = `invalidOrExpiredToken` | `tokenAndPasswordRequired`;

export type ApiResetPasswordResult = ApiOkResult | { status: ApiResetPasswordErrorCode };

export type ApiStatusOk = `ok`;

export type ApiUserLlmSettingsBody = {
  llmChatModel?: string;
  llmImageModel?: string;
  llmSpeechRecognitionModel?: string;
};

export type ApiUserLlmSettingsResult =
  | {
      llmChatModel: string;
      llmImageModel: string;
      llmSpeechRecognitionModel: string;
      maxPromptImageLength: number;
      maxSpeechFileMegaBytes: number;
      status: `ok`;
    }
  | { status: `badRequest` };
