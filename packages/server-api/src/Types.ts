import type { AiImageQuality } from "@snappy/ai";

export type ApiBalancePaymentUrlBody = { amount?: number };

export type ApiBalancePaymentUrlErrorCode = `invalidAmount` | `paymentError`;

export type ApiBalancePaymentUrlResult =
  | { status: ApiBalancePaymentUrlErrorCode }
  | { status: ApiStatusOk; url: string };

export type ApiBalanceResult = { balance: number };

export type ApiOkResult = { status: ApiStatusOk };

export type ApiStatusOk = `ok`;

export type ApiUserLlmSettingsBody = {
  llmChatModel?: string;
  llmImageModel?: string;
  llmImageQuality?: AiImageQuality;
  llmSpeechRecognitionModel?: string;
};

export type ApiUserLlmSettingsResult = {
  llmChatModel: string;
  llmImageModel: string;
  llmImageQuality: AiImageQuality;
  llmSpeechRecognitionModel: string;
  maxImagePromptLength: number;
  maxSpeechFileMegaBytes: number;
};
