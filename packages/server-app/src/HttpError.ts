import { HttpStatus } from "@snappy/core";

const withStatusCode = (message: string, statusCode: number) => Object.assign(new Error(message), { statusCode });

const badRequest = (description = `badRequest`): never => {
  throw withStatusCode(description, HttpStatus.badRequest);
};

const unauthorized = (description = `unauthorized`): never => {
  throw withStatusCode(description, HttpStatus.unauthorized);
};

export const HttpError = { badRequest, unauthorized };
