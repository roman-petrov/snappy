/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { startSite } from "@snappy/ui";

import { SiteHeader } from "./components/SiteHeader";
import { Pages } from "./Pages";
import "./scss/scroll.scss";

const { pathname } = window.location;
const path = Pages.paths.find(p => p === pathname) ?? `/`;

startSite({ children: Pages.view(path), header: <SiteHeader />, path });
