/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import type { AppContext } from "../Types";

import { RequireUserId } from "./RequireUserId";
import { Storage } from "../Storage";

const remaining = (context: AppContext) => async (request: Request, response: Response) => {
  await RequireUserId.withUserId(request, response, async userId => {
    const count = await Storage.remainingByUserId(context.db, userId, context.freeRequestLimit);

    response.json({ remaining: count });
  });
};

export const User = { remaining };
