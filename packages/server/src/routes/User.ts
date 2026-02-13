/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import type { AppContext } from "../Types";

import { Storage } from "../Storage";

const remaining = (context: AppContext) => async (request: Request, response: Response) => {
  const { userId } = request as Request & { userId?: number };

  if (userId === undefined) {
    response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

    return;
  }

  const count = await Storage.remainingByUserId(context.db, userId, context.freeRequestLimit);

  response.json({ remaining: count });
};

export const User = { remaining };
