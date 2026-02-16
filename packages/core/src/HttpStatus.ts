export const HttpStatus = {
  badRequest: 400,
  conflict: 409,
  created: 201,
  internalServerError: 500,
  noContent: 204,
  ok: 200,
  serviceUnavailable: 503,
  tooManyRequests: 429,
  unauthorized: 401,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
