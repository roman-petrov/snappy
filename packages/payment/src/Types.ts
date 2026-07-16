export type PaymentCreateRedirectPaymentInput = {
  amount: number;
  culture?: `en` | `ru`;
  description: string;
  email?: string;
  metadataKind: PaymentMetadataKind;
  options?: { failUrl?: string; returnUrl?: string };
  userId: string;
};

export type PaymentCreateRedirectPaymentResult = PaymentResult<PaymentCreateRedirectPaymentSuccess>;

export type PaymentCreateRedirectPaymentSuccess = { paymentId: string; redirectUrl: string };

export type PaymentCreateRedirectPaymentSuccessResult = PaymentSuccess<PaymentCreateRedirectPaymentSuccess>;

export type PaymentErrorCode =
  `http-error` | `invalid-response` | `invalid-webhook-payload` | `network` | `provider-error`;

export type PaymentFailure = { code: PaymentErrorCode; externalMessage?: string; httpStatus?: number; ok: false };

export type PaymentMetadataKind = `topup`;

export type PaymentMoney = { currency: string; value: string };

export type PaymentProvider = {
  createRedirectPayment: (
    input: PaymentCreateRedirectPaymentInput,
  ) => Promise<PaymentResult<PaymentCreateRedirectPaymentSuccess>>;
  parseWebhook: (body: unknown) => PaymentResult<PaymentWebhookEvent>;
  payment: (paymentId: string) => Promise<PaymentResult<PaymentSnapshot>>;
};

export type PaymentQueryResult = PaymentResult<PaymentSnapshot>;

export type PaymentResult<T> = PaymentFailure | PaymentSuccess<T>;

export type PaymentSnapshot = {
  metadataKind?: PaymentMetadataKind;
  money?: PaymentMoney;
  paymentId: string;
  status: PaymentStatus;
  userId?: string;
};

export type PaymentSnapshotSuccess = PaymentSuccess<PaymentSnapshot>;

export type PaymentStatus = `canceled` | `pending` | `succeeded` | `unknown`;

export type PaymentSuccess<T> = T & { ok: true };

export type PaymentWebhookEvent = { paymentId: string };

export type PaymentWebhookParseResult = PaymentResult<PaymentWebhookEvent>;
