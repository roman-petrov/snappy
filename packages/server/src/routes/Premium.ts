/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import type { AppContext } from "../Types";

const premiumTitle = `Snappy Bot - Premium подписка (30 дней)`;

const paymentUrl = (ctx: AppContext) => async (req: Request, res: Response) => {
  const userId = (req as Request & { userId?: number }).userId;

  if (userId === undefined) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  try {
    const url = await ctx.yooKassa.paymentUrl(userId, ctx.premiumPrice, premiumTitle);

    res.json({ url });
  } catch {
    res.status(500).json({ error: `Payment error` });
  }
};

export const Premium = { paymentUrl };
