/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import type { AppContext } from "../Types";

import { Storage } from "../Storage";

const remaining = (context: AppContext) => async (request: Request, res: Response) => {
  const { userId } = request as Request & { userId?: number };

  if (userId === undefined) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  const count = await Storage.remainingByUserId(context.db, userId, context.freeRequestLimit);

  res.json({ remaining: count });
};

export const User = { remaining };
