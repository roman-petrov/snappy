import type { Command } from "../Command";

export const Build: Command = {
  children: [`build:site`, `build:ssr`, `build:app`, `build:admin`, `build:server`, `build:app-android`],
  description: `Build site, SSR, app, admin, API server, and Android app for production.`,
  label: `📦 Build`,
  name: `build`,
};
