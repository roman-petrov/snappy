import { RobokassaReturn } from "./pages";

export const BillingRoutes = {
  robokassa: {
    fail: { page: RobokassaReturn, path: `billing/robokassa/fail` },
    success: { page: RobokassaReturn, path: `billing/robokassa/success` },
  },
} as const;
