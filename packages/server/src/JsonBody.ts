/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { FastifyInstance } from "fastify";

import { HttpStatus, Json } from "@snappy/core";

const jsonContentType = `application/json`;

export const registerJsonBodyParser = (app: FastifyInstance): void => {
  app.removeContentTypeParser(jsonContentType);
  app.addContentTypeParser(jsonContentType, { parseAs: `string` }, (_request, body, done) => {
    try {
      const text = body as string;
      const parsed: unknown = text === `` ? {} : JSON.parse(text);

      done(null, Json.normalize(parsed));
    } catch (error: unknown) {
      const parseError = error instanceof Error ? error : new Error(String(error));
      (parseError as { statusCode?: number }).statusCode = HttpStatus.badRequest;
      done(parseError, undefined);
    }
  });
};
