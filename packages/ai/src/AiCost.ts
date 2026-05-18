/* eslint-disable @typescript-eslint/naming-convention */
import { _ } from "@snappy/core";

const cost = (usage: unknown) => {
  if (usage === null || !_.isObject(usage)) {
    throw new TypeError(`ai_cost_missing`);
  }
  const rub = (usage as { cost_rub?: unknown }).cost_rub;
  if (!_.isNumber(rub)) {
    throw new TypeError(`ai_cost_missing`);
  }

  return rub;
};

export const AiCost = { cost };
