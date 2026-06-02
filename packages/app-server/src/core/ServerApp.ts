import type { Db } from "@snappy/db";

import type { Balance } from "./Balance";
import type { BalancePayment } from "./BalancePayment";
import type { BetterAuth } from "./BetterAuth";
import type { UserSettings } from "./UserSettings";

export type ServerApp = {
  balance: Balance;
  balancePayment: BalancePayment;
  betterAuth: BetterAuth;
  db: ReturnType<typeof Db>;
  userSettings: UserSettings;
};
