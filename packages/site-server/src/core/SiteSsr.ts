/* eslint-disable @typescript-eslint/max-params */
import type { Locale } from "@snappy/intl";
import type { InjectTheme } from "@snappy/server-module";
import type { ResolvedTheme } from "@snappy/ui-core";

import { ConfigValues } from "@snappy/config";

const rootPlaceholder = /<div id="root">\s*<\/div>/u;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

export type SsrEntry = {
  getMeta: (path: string, locale: Locale) => SiteMeta;
  pages: { paths: readonly string[] };
  render: (path: string, locale: Locale, theme: ResolvedTheme | undefined) => string;
};

const escapeAttribute = (s: string) =>
  s.replaceAll(`&`, `&amp;`).replaceAll(`"`, `&quot;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const canonicalUrl = (path: string) => {
  const origin = ConfigValues.origin(ConfigValues.env());

  return path === `/` ? `${origin}/` : `${origin}${path}`;
};

const injectMeta = (template: string, meta: SiteMeta, url: string) =>
  template
    .replaceAll(`{{title}}`, escapeAttribute(meta.title))
    .replaceAll(`{{description}}`, escapeAttribute(meta.description))
    .replaceAll(`{{keywords}}`, escapeAttribute(meta.keywords))
    .replaceAll(`{{htmlLang}}`, meta.htmlLang)
    .replaceAll(`{{canonicalUrl}}`, escapeAttribute(url));

const build = (
  path: string,
  locale: Locale,
  theme: ResolvedTheme | undefined,
  template: string,
  entry: SsrEntry,
  injectTheme: InjectTheme,
) => {
  const url = canonicalUrl(path);
  const withMeta = injectMeta(template, entry.getMeta(path, locale), url);
  const withRoot = withMeta.replace(rootPlaceholder, `<div id="root">${entry.render(path, locale, theme)}</div>`);

  return injectTheme(withRoot, theme);
};

export const SiteSsr = { build };
