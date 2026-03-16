/* eslint-disable functional/no-expression-statements */
import type { CronJob } from "@snappy/node";

import type { Subscription } from "../Subscription";

export const SubscriptionRenewalCronJob = (subscription: Subscription): CronJob => ({
  run: async lastRunTime => {
    const now = new Date();
    /** 12:00 Moscow = 09:00 UTC */
    const noonUtcHour = 9;
    const noon = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), noonUtcHour, 0, 0, 0);
    const alreadyRanAfterNoon = lastRunTime !== undefined && lastRunTime >= noon;
    if (now.getTime() < noon || alreadyRanAfterNoon) {
      return;
    }

    await subscription.renewAll();
  },
});
