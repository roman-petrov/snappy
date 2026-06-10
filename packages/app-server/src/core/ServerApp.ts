import type { Balance } from "./Balance";
import type { BalancePayment } from "./BalancePayment";
import type { BetterAuth } from "./BetterAuth";
import type { Feed } from "./Feed";
import type { UserSettings } from "./UserSettings";

export type ServerApp = {
  balance: Balance;
  balancePayment: BalancePayment;
  betterAuth: BetterAuth;
  feed: Feed;
  userSettings: UserSettings;
};
