/* eslint-disable functional/no-expression-statements */
// cspell:word wght
import type { Plugin } from "vite";

import fs from "node:fs";
import { join } from "node:path";

// ? See https://fontsource.org/docs/getting-started/preload
export const pluginFontPreload = (): Plugin => ({
  apply: `build`,
  name: `font-preload`,
  writeBundle({ dir }, outputBundle) {
    if (dir === undefined || dir === ``) {
      return;
    }
    const chunks = Object.values(outputBundle);
    const placeholder = `<!-- FONT-PRELOAD-PLACEHOLDER -->`;
    const preloadSubsets = [`inter-latin-wght-normal`, `inter-cyrillic-wght-normal`] as const;

    const isWoff2Asset = (chunk: { fileName?: string; type: string }, subset: string) =>
      chunk.type === `asset` &&
      typeof chunk.fileName === `string` &&
      chunk.fileName.includes(subset) &&
      chunk.fileName.endsWith(`.woff2`);

    const baseFromHtml = (html: string): string => {
      const match = /<base\s+href=["'](?<baseHref>[^"']*)["']/iu.exec(html);
      const href = match?.groups?.[`baseHref`];

      return href === undefined || href === `` || href === `/` ? `` : href.replace(/\/$/u, ``);
    };

    const fileNames = preloadSubsets
      .map(subset => {
        const entry = chunks.find(chunk => isWoff2Asset(chunk as { fileName?: string; type: string }, subset));

        return entry !== undefined && typeof (entry as { fileName: string }).fileName === `string`
          ? (entry as { fileName: string }).fileName
          : undefined;
      })
      .filter((name): name is string => name !== undefined);

    const htmlPath = join(dir, `index.html`);
    if (!fs.existsSync(htmlPath)) {
      return;
    }
    const html = fs.readFileSync(htmlPath, `utf8`);
    const base = baseFromHtml(html);

    const links = fileNames
      .map(
        name =>
          `<link rel="preload" as="font" type="font/woff2" href="${base === `` ? `/${name}` : `${base}/${name}`}" crossorigin="anonymous" />`,
      )
      .join(`\n    `);

    fs.writeFileSync(htmlPath, html.replace(placeholder, links));
  },
});
