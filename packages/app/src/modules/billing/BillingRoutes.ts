import { BillingFail, BillingSuccess, BillingTopUp } from "./pages";

export const BillingRoutes = {
  robokassa: {
    fail: { page: BillingFail, path: `billing/robokassa/fail` },
    success: { page: BillingSuccess, path: `billing/robokassa/success` },
  },
  topUp: { page: BillingTopUp, path: `billing/top-up` },
} as const;
