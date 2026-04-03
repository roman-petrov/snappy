export const HttpStatus = {
  badGateway: 502,
  badRequest: 400,
  internalServerError: 500,
  notFound: 404,
  ok: 200,
  paymentRequired: 402,
  serviceUnavailable: 503,
  unauthorized: 401,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
