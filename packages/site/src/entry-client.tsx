/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { startSite } from "@snappy/ui";

import { SiteHeader, SiteShell } from "./components";
import { Pages } from "./Pages";
import "./scss/scroll.scss";

const { pathname } = window.location;
const path = Pages.paths.find(p => p === pathname) ?? `/`;
const View = Pages.at(path);

startSite({ children: <SiteShell view={View} />, header: <SiteHeader />, path });
