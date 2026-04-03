export type PaymentCreateRedirectPaymentInput = {
  amount: number;
  currency: string;
  description: string;
  metadataKind: PaymentMetadataKind;
  options?: { returnUrl?: string; savePaymentMethod?: boolean };
  userId: number;
};

export type PaymentCreateRedirectPaymentResult = PaymentResult<PaymentCreateRedirectPaymentSuccess>;

export type PaymentCreateRedirectPaymentSuccess = { providerPaymentId: string; redirectUrl: string };

export type PaymentCreateRedirectPaymentSuccessResult = PaymentSuccess<PaymentCreateRedirectPaymentSuccess>;

export type PaymentErrorCode =
  | `http-error`
  | `invalid-response`
  | `invalid-webhook-payload`
  | `network`
  | `provider-error`;

export type PaymentFailure = { code: PaymentErrorCode; externalMessage?: string; httpStatus?: number; ok: false };

export type PaymentMetadataKind = `topup`;

export type PaymentMoney = { currency: string; value: string };

export type PaymentPaidResult = PaymentResult<PaymentPaidSuccess>;

export type PaymentPaidSuccess = { paid: boolean };

export type PaymentProvider = {
  createRedirectPayment: (
    input: PaymentCreateRedirectPaymentInput,
  ) => Promise<PaymentResult<PaymentCreateRedirectPaymentSuccess>>;
  paid: (providerPaymentId: string) => Promise<PaymentResult<PaymentPaidSuccess>>;
  parseWebhook: (body: unknown) => PaymentResult<PaymentWebhookEvent>;
  payment: (providerPaymentId: string) => Promise<PaymentResult<PaymentSnapshot>>;
};

export type PaymentQueryResult = PaymentResult<PaymentSnapshot>;

export type PaymentResult<T> = PaymentFailure | PaymentSuccess<T>;

export type PaymentSnapshot = {
  metadataKind?: PaymentMetadataKind;
  money?: PaymentMoney;
  providerCancellationCode?: string;
  providerPaid?: boolean;
  providerPaymentId: string;
  savedMethodId?: string;
  status: PaymentStatus;
  userId?: number;
};

export type PaymentSnapshotSuccess = PaymentSuccess<PaymentSnapshot>;

export type PaymentStatus =
  | `canceled`
  | `failed`
  | `pending`
  | `processing`
  | `requires-action`
  | `succeeded`
  | `unknown`
  | `waiting-capture`;

export type PaymentSuccess<T> = T & { ok: true };

export type PaymentWebhookEvent = { kind: `payment-canceled` | `payment-succeeded`; providerPaymentId: string };

export type PaymentWebhookParseResult = PaymentResult<PaymentWebhookEvent>;
