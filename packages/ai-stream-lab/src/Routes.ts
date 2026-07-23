import { Router } from "@snappy/router";

import { Lab } from "./Lab";

export const Routes = Router({
  routes: { lab: { page: Lab, path: `lab` } },
  start: { index: Lab, public: r => [r.lab], signIn: r => r.lab },
});
