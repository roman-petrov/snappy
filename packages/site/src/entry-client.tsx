/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { Landing } from "./components";

startApp(`#root`, <Landing />, { server: true });
