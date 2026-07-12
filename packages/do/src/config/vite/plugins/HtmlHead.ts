/* eslint-disable functional/no-expression-statements */
// cspell:word wght
import type { Plugin } from "vite";

import { _ } from "@snappy/core";
import { File } from "@snappy/node";
import { join } from "node:path";

// ? See https://fontsource.org/docs/getting-started/preload
export const pluginHtmlHead = (): Plugin => ({
  apply: `build`,
  name: `html-head`,
  writeBundle({ dir }, outputBundle) {
    if (dir === undefined || dir === ``) {
      return;
    }

    const optimizeStylesheet = (source: string) => {
      const stylesheet = /<link rel="stylesheet"[^>]*>/u.exec(source)?.[0];
      if (stylesheet === undefined) {
        return source;
      }

      const script = /<script type="module"[^>]*><\/script>/u.exec(source)?.[0];
      if (script === undefined) {
        return source;
      }

      const href = /href="(?<href>[^"]+)"/u.exec(stylesheet)?.groups?.[`href`];
      if (href === undefined) {
        return source;
      }

      const block = [`<link rel="preload" as="style" href="${href}" crossorigin />`, stylesheet, script].join(`\n    `);

      return source
        .replace(/<link rel="preload" as="style"[^>]*>\s*/u, ``)
        .replace(`\n    ${script}\n    ${stylesheet}`, `\n    ${block}`);
    };

    const chunks = Object.values(outputBundle);
    const placeholder = `<!-- HTML-HEAD-PLACEHOLDER -->`;
    const preloadSubsets = [`inter-cyrillic-wght-normal`, `inter-latin-wght-normal`] as const;

    const isWoff2Asset = (chunk: { fileName?: string; type: string }, subset: string) =>
      chunk.type === `asset` &&
      _.isString(chunk.fileName) &&
      chunk.fileName.includes(subset) &&
      chunk.fileName.endsWith(`.woff2`);

    const baseFromHtml = (html: string): string => {
      const match = /<base\s+href=["'](?<baseHref>[^"']*)["']/iu.exec(html);
      const href = match?.groups?.[`baseHref`];

      return href === undefined || [`/`, ``].includes(href) ? `` : href.replace(/\/$/u, ``);
    };

    const fileNames = preloadSubsets
      .map(subset => {
        const entry = chunks.find(chunk => isWoff2Asset(chunk as { fileName?: string; type: string }, subset));

        return entry !== undefined && _.isString((entry as { fileName: string }).fileName)
          ? (entry as { fileName: string }).fileName
          : undefined;
      })
      .filter((name): name is string => name !== undefined);

    const htmlPath = join(dir, `index.html`);
    if (!File.exists(htmlPath)) {
      return;
    }
    const html = File.read(htmlPath);
    const base = baseFromHtml(html);

    const fontLinks = fileNames
      .map(
        name =>
          `<link rel="preload" as="font" type="font/woff2" href="${base === `` ? `/${name}` : `${base}/${name}`}" crossorigin="anonymous" />`,
      )
      .join(`\n    `);

    File.write(htmlPath, optimizeStylesheet(html.replace(placeholder, fontLinks)));
  },
});
