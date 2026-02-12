/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import { Storage } from "../Storage";
import type { AppContext } from "../Types";

const remaining = (ctx: AppContext) => async (req: Request, res: Response) => {
  const userId = (req as Request & { userId?: number }).userId;

  if (userId === undefined) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  const count = await Storage.remainingByUserId(ctx.db, userId, ctx.freeRequestLimit);

  res.json({ remaining: count });
};

export const User = { remaining };
