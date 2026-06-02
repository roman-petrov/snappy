/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { HeaderContent } from "./components";
import { SignIn, Users } from "./pages";
import { Routes } from "./Routes";
import { $signedIn } from "./Store";

startApp({
  base: `/admin`,
  header: <HeaderContent />,
  index: <Users />,
  path: Routes.home,
  publicPaths: [Routes.signIn],
  routes: { [Routes.$.signIn]: <SignIn /> },
  signedIn: $signedIn,
  signInPath: Routes.signIn,
});
