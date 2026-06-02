import { Store } from "@snappy/core";

import { Auth } from "./core/Auth";

export const $signedIn = Store(await Auth.signedIn());
