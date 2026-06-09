const url = (path: string) => `/app${path}`;

export const AppBase = { resetPasswordUrl: url(`/reset-password`), url, verifyCallbackUrl: url(`/`) };
