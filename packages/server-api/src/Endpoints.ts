export const Endpoints = {
  auth: {
    forgotPassword: `/api/auth/forgot-password`,
    login: `/api/auth/login`,
    logout: `/api/auth/logout`,
    me: `/api/auth/me`,
    register: `/api/auth/register`,
    resetPassword: `/api/auth/reset-password`,
  },
  premium: { paymentUrl: `/api/premium/payment-url` },
  process: `/api/process`,
  subscription: {
    autoRenew: `/api/subscription/auto-renew`,
    delete: `/api/subscription/delete`,
    get: `/api/subscription`,
    renew: `/api/subscription/renew`,
  },
  user: { remaining: `/api/user/remaining` },
  webhooks: { yookassa: `/api/webhooks/yookassa` },
} as const;
