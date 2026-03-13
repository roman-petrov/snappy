export const HttpStatus = { ok: 200, serviceUnavailable: 503, unauthorized: 401 } as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
