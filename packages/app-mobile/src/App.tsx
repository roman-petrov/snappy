import { Route } from "wouter";

import { Layout } from "./Layout";

/* jscpd:ignore-start */
export const App = () => (
  <Route nest path="/">
    <Layout />
  </Route>
);
/* jscpd:ignore-end */
