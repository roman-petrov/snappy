/* eslint-disable functional/no-expression-statements */
import type { ServerApp } from "@snappy/server-app";
import type { Request, Response } from "express";

import { hasError } from "../ApiResult";
import { RequireUserId } from "./RequireUserId";

const paymentUrl = (api: ServerApp[`api`]) => async (request: Request, response: Response) => {
  await RequireUserId.withUserId(request, response, async userId => {
    const result = await api.premium.paymentUrl(userId);

    if (hasError(result)) {
      response.status(result.status).json({ error: result.error });

      return;
    }

    response.json({ url: result.url });
  });
};

export const Premium = { paymentUrl };
