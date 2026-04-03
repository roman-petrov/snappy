import type { Balance } from "./Balance";

export const BalanceInfo = ({ balance }: { balance: Balance }) => ({
  balance: async (userId: number) => ({ balance: await balance.read(userId), status: `ok` as const }),
});

export type BalanceInfo = ReturnType<typeof BalanceInfo>;
