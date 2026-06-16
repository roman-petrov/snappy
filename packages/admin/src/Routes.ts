import { Router } from "@snappy/router";

import { SignIn, UserEdit, UserList } from "./pages";

export const Routes = Router({
  routes: {
    auth: { signIn: { page: SignIn, path: `login` } },
    user: { edit: { page: UserEdit, path: `user/:userId` }, list: { page: UserList, path: `users` } },
  },
  start: { index: { redirect: r => r.user.list }, public: r => [r.auth.signIn], signIn: r => r.auth.signIn },
});
