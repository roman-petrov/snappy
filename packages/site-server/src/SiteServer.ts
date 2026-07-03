/* eslint-disable functional/immutable-data */
// cspell:word assetlinks
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { ServerModule, SiteHandlers } from "@snappy/server-module";

import { ConfigValues } from "@snappy/config";
import { Directory } from "@snappy/node";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import type { SsrEntry } from "./core/SiteSsr";

import { Ssr } from "./core";
import { MountAssetLinks, MountDownload, MountSeo, MountStatic } from "./mount";

export const SiteServer: ServerModule = distDir => {
  const distName = `site`;
  const siteRoot = join(distDir, distName);
  const entryHref = pathToFileURL(join(siteRoot, `server`, `entry-server.js`)).href;
  const loaded: { paths?: Promise<readonly string[]> } = {};

  const paths = async (site: SiteHandlers | undefined) => {
    if (site !== undefined) {
      return site.pages.paths;
    }
    loaded.paths ??= (async () => ((await import(entryHref)) as SsrEntry).pages.paths)();

    return loaded.paths;
  };

  return {
    mount: { prefix: `/assets/`, root: join(siteRoot, `assets`) },
    routes: async ({ distDir: root, site }) => {
      const list = await paths(site);

      return {
        files: site === undefined ? MountStatic(await Directory.async.entries(siteRoot), siteRoot) : [],
        streams: [MountDownload(root)],
        texts: [...MountSeo(list), ...(ConfigValues.production() ? [MountAssetLinks()] : [])],
      };
    },
    run: async ({ app, htmlCache, injectTheme, site }) => {
      const list = await paths(site);

      if (site === undefined) {
        const ssr = Ssr({ injectTheme });

        for (const path of list) {
          app.get(path, ssr.createCachedSsrHandler(siteRoot, htmlCache, path));
        }
      } else if (site.route !== undefined) {
        for (const path of list) {
          app.get(path, site.route(path));
        }
      }
    },
  };
};
