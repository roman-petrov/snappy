export const Endpoints = {
  balance: { paymentUrl: `/api/balance/payment-url` },
  user: { balance: `/api/user/balance`, settings: `/api/user/settings` },
  webhooks: { yookassa: `/api/webhooks/yookassa` },
} as const;
