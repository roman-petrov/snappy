/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import type { AppContext } from "../Types";

const premiumTitle = `Snappy Bot - Premium подписка (30 дней)`;

const paymentUrl = (context: AppContext) => async (request: Request, response: Response) => {
  const { userId } = request as Request & { userId?: number };

  if (userId === undefined) {
    response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

    return;
  }

  try {
    const url = await context.yooKassa.paymentUrl(userId, context.premiumPrice, premiumTitle);

    response.json({ url });
  } catch {
    response.status(HttpStatus.internalServerError).json({ error: `Payment error` });
  }
};

export const Premium = { paymentUrl };
