/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { Landing } from "./components";
import { Locale } from "./core";

startApp(`#root`, <Landing />, { locale: Locale.get(), onLocaleChange: Locale.set, server: true });
