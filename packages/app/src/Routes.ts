import { Router } from "@snappy/router";

import { KnownUser } from "./core";
import { AuthRoutes, BillingRoutes, FeedRoutes, LegalRoutes, SettingsRoutes, Snappy, SnappyRoutes } from "./modules";

export const Routes = Router({
  routes: {
    auth: AuthRoutes,
    billing: BillingRoutes,
    feed: FeedRoutes,
    legal: LegalRoutes,
    settings: SettingsRoutes,
    snappy: SnappyRoutes,
  },
  start: {
    index: Snappy,
    public: r => [
      r.auth.emailVerified,
      r.auth.forgotPassword,
      r.auth.resetPassword,
      r.auth.signIn,
      r.auth.signUp,
      r.billing.robokassa.fail,
      r.billing.robokassa.success,
      r.legal.privacy,
      r.legal.terms,
    ],
    signIn: r => (KnownUser.marked() ? r.auth.signIn : r.auth.signUp),
  },
});
