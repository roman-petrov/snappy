import { AppRoutes } from "@snappy/ui";

import { SignIn, UserEdit, UserList } from "./pages";

export const Routes = AppRoutes(
  {
    auth: { signIn: { page: SignIn, path: `login` } },
    user: { edit: { page: UserEdit, path: `user/:userId` }, list: { page: UserList, path: `users` } },
  },
  { index: { redirect: r => r.user.list }, public: r => [r.auth.signIn], signIn: r => r.auth.signIn },
);
