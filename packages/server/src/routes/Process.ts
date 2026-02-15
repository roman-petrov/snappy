/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
import type { ApiProcessBody } from "@snappy/server-api";
import type { ServerAppApi } from "@snappy/server-app";
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import { hasError } from "../ApiResult";

export const Process = {
  process: (api: ServerAppApi) => async (request: Request, response: Response) => {
    const { userId } = request as Request & { userId?: number };

    if (userId === undefined) {
      response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

      return;
    }

    const body = (request.body ?? {}) as ApiProcessBody;
    const result = await api.process(userId, body);

    if (hasError(result)) {
      response.status(result.status).json({ error: result.error });

      return;
    }

    response.json({ text: result.text });
  },
};
