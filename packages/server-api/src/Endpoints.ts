export const Endpoints = {
  auth: {
    forgotPassword: `/api/auth/forgot-password`,
    login: `/api/auth/login`,
    logout: `/api/auth/logout`,
    me: `/api/auth/me`,
    register: `/api/auth/register`,
    resetPassword: `/api/auth/reset-password`,
  },
  balance: { paymentUrl: `/api/balance/payment-url` },
  llm: {
    chat: `/api/llm/chat`,
    image: `/api/llm/image`,
    models: `/api/llm/models`,
    speechRecognition: `/api/llm/speech-recognition`,
  },
  user: { balance: `/api/user/balance`, llmSettings: `/api/user/llm-settings` },
  webhooks: { yookassa: `/api/webhooks/yookassa` },
} as const;
