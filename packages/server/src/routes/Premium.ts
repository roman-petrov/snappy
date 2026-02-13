/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import type { AppContext } from "../Types";

const premiumTitle = `Snappy Bot - Premium подписка (30 дней)`;

const paymentUrl = (context: AppContext) => async (request: Request, res: Response) => {
  const { userId } = request as Request & { userId?: number };

  if (userId === undefined) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  try {
    const url = await context.yooKassa.paymentUrl(userId, context.premiumPrice, premiumTitle);

    res.json({ url });
  } catch {
    res.status(500).json({ error: `Payment error` });
  }
};

export const Premium = { paymentUrl };
