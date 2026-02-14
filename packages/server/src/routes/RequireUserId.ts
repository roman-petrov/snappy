/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

type RequestWithUserId = Request & { userId?: number };

const requireUserId = (request: Request, response: Response): number | undefined => {
  const { userId } = request as RequestWithUserId;

  if (userId === undefined) {
    response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

    return undefined;
  }

  return userId;
};

const withUserId = async (
  request: Request,
  response: Response,
  run: (userId: number) => Promise<void>,
): Promise<void> => {
  const userId = requireUserId(request, response);

  if (userId === undefined) {
    return;
  }

  await run(userId);
};

export const RequireUserId = { requireUserId, withUserId };
