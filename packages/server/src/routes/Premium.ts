/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import type { AppContext } from "../Types";

import { RequireUserId } from "./RequireUserId";

const paymentUrl = (context: AppContext) => async (request: Request, response: Response) => {
  await RequireUserId.withUserId(request, response, async userId => {
    try {
      const url = await context.yooKassa.paymentUrl(
        userId,
        context.premiumPrice,
        `Snappy Bot - Premium подписка (30 дней)`,
      );

      response.json({ url });
    } catch {
      response.status(HttpStatus.internalServerError).json({ error: `Payment error` });
    }
  });
};

export const Premium = { paymentUrl };
