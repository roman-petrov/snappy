/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { Request, Response } from "express";

import { RequireUserId } from "./RequireUserId";

const remaining = (api: ServerAppApi) => async (request: Request, response: Response) => {
  await RequireUserId.withUserId(request, response, async userId => {
    const count = await api.user.remaining(userId);

    response.json({ remaining: count });
  });
};

export const User = { remaining };
