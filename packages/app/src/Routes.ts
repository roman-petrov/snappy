import { Router } from "@snappy/router";

import { KnownUser } from "./core";
import { AuthRoutes, FeedRoutes, SettingsRoutes, Snappy, SnappyRoutes } from "./modules";

export const Routes = Router({
  routes: { auth: AuthRoutes, feed: FeedRoutes, settings: SettingsRoutes, snappy: SnappyRoutes },
  start: {
    index: Snappy,
    public: r => [r.auth.emailVerified, r.auth.forgotPassword, r.auth.resetPassword, r.auth.signIn, r.auth.signUp],
    signIn: r => (KnownUser.marked() ? r.auth.signIn : r.auth.signUp),
  },
});
