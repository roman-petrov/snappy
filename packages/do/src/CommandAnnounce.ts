import { Terminal } from "@snappy/node";

import { devAppUrl } from "./DevHttps";

/** After `dev` succeeds: one line with the HTTPS dev URL (relay key is printed by the client process). */
export const devSiteRunningFooter = (): string =>
  `\n🌐 ${Terminal.yellow(`Site running at`)} ${Terminal.blue(String(devAppUrl))}\n`;

/** Printed when the prod server process is spawned (foreground). */
export const prodSpawnNotice = (): string =>
  `\n🌐 ${Terminal.yellow(`Site running at`)} ${Terminal.blue(`https://localhost`)}\n`;
