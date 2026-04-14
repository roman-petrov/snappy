export const Endpoints = {
  balance: { paymentUrl: `/api/balance/payment-url` },
  user: { balance: `/api/user/balance`, llmSettings: `/api/user/llm-settings` },
  webhooks: { yookassa: `/api/webhooks/yookassa` },
} as const;
