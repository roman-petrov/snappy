/* eslint-disable functional/no-expression-statements */
import type { ApiProcessBody } from "@snappy/server-api";
import type { Request, Response } from "express";

import { type FeatureType, Prompts } from "@snappy/snappy";

import type { AppContext } from "../Types";

import { Storage } from "../Storage";

const isFeatureType = (key: string): key is FeatureType => key in Prompts.systemPrompts;

const processHandler = (context: AppContext) => async (request: Request, res: Response) => {
  const { userId } = request as Request & { userId?: number };

  if (userId === undefined) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  const { feature, text } = (request.body as ApiProcessBody) ?? {};

  if (typeof text !== `string` || text.trim() === `` || typeof feature !== `string` || !isFeatureType(feature)) {
    res.status(400).json({ error: `text and feature required; feature must be valid` });

    return;
  }

  const can = await Storage.canMakeRequestByUserId(context.db, userId, context.freeRequestLimit);

  if (!can) {
    res.status(429).json({ error: `Request limit reached` });

    return;
  }

  try {
    const result = await context.snappy.processText(text.trim(), feature);

    await Storage.incrementRequestByUserId(context.db, userId);

    res.json({ text: result });
  } catch {
    res.status(500).json({ error: `Processing failed` });
  }
};

export const Process = { process: processHandler };
