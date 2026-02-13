export const HttpStatus = {
  badRequest: 400,
  conflict: 409,
  created: 201,
  internalServerError: 500,
  noContent: 204,
  serviceUnavailable: 503,
  tooManyRequests: 429,
  unauthorized: 401,
} as const;
