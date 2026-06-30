import { Router } from "@snappy/router";

import { AuthRoutes } from "./pages/auth";
import { FeedRoutes } from "./pages/feed";
import { SettingsRoutes } from "./pages/settings";
import { Snappy, SnappyRoutes } from "./pages/snappy";

export const Routes = Router({
  routes: { auth: AuthRoutes, feed: FeedRoutes, settings: SettingsRoutes, snappy: SnappyRoutes },
  start: {
    index: Snappy,
    public: r => [r.auth.emailVerified, r.auth.forgotPassword, r.auth.resetPassword, r.auth.signIn, r.auth.signUp],
    signIn: r => r.auth.signUp,
  },
});
