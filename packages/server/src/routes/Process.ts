/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import { type FeatureType, Prompts } from "@snappy/snappy";

import { Storage } from "../Storage";
import type { AppContext } from "../Types";

const isFeatureType = (key: string): key is FeatureType => key in Prompts.systemPrompts;

const processHandler = (ctx: AppContext) => async (req: Request, res: Response) => {
  const userId = (req as Request & { userId?: number }).userId;

  if (userId === undefined) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  const { text, feature } = (req.body as { text?: string; feature?: string }) ?? {};

  if (typeof text !== `string` || text.trim() === `` || typeof feature !== `string` || !isFeatureType(feature)) {
    res.status(400).json({ error: `text and feature required; feature must be valid` });

    return;
  }

  const can = await Storage.canMakeRequestByUserId(ctx.db, userId, ctx.freeRequestLimit);

  if (!can) {
    res.status(429).json({ error: `Request limit reached` });

    return;
  }

  try {
    const result = await ctx.snappy.processText(text.trim(), feature);

    await Storage.incrementRequestByUserId(ctx.db, userId);

    res.json({ text: result });
  } catch {
    res.status(500).json({ error: `Processing failed` });
  }
};

export const Process = { process: processHandler };
