/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { ApiProcessBody } from "@snappy/server-api";
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";
import { type FeatureType, Prompts } from "@snappy/snappy";

import type { AppContext } from "../Types";

import { Storage } from "../Storage";

const isFeatureType = (key: string): key is FeatureType => key in Prompts.systemPrompts;

const processHandler = (context: AppContext) => async (request: Request, response: Response) => {
  const { userId } = request as Request & { userId?: number };

  if (userId === undefined) {
    response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

    return;
  }

  const { feature, text } = (request.body as ApiProcessBody) ?? {};

  if (typeof text !== `string` || text.trim() === `` || typeof feature !== `string` || !isFeatureType(feature)) {
    response.status(HttpStatus.badRequest).json({ error: `text and feature required; feature must be valid` });

    return;
  }

  const can = await Storage.canMakeRequestByUserId(context.db, userId, context.freeRequestLimit);

  if (!can) {
    response.status(HttpStatus.tooManyRequests).json({ error: `Request limit reached` });

    return;
  }

  try {
    const result = await context.snappy.processText(text.trim(), feature);

    await Storage.incrementRequestByUserId(context.db, userId);

    response.json({ text: result });
  } catch {
    response.status(HttpStatus.internalServerError).json({ error: `Processing failed` });
  }
};

export const Process = { process: processHandler };
