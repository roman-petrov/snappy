export const Endpoints = {
  auth: {
    forgotPassword: `/api/auth/forgot-password`,
    login: `/api/auth/login`,
    register: `/api/auth/register`,
    resetPassword: `/api/auth/reset-password`,
  },
  premium: {
    paymentUrl: `/api/premium/payment-url`,
  },
  process: `/api/process`,
  user: {
    remaining: `/api/user/remaining`,
  },
} as const;
