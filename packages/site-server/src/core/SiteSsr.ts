import type { Locale } from "@snappy/intl";
import type { InjectTheme } from "@snappy/server-module";
import type { ResolvedTheme } from "@snappy/ui-core";

const rootPlaceholder = /<div id="root">\s*<\/div>/u;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

export type SsrEntry = {
  getMeta: (locale: Locale) => SiteMeta;
  render: (locale: Locale, theme: ResolvedTheme | undefined) => string;
};

const escapeAttribute = (s: string) =>
  s.replaceAll(`&`, `&amp;`).replaceAll(`"`, `&quot;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const injectMeta = (template: string, meta: SiteMeta) =>
  template
    .replaceAll(`{{title}}`, escapeAttribute(meta.title))
    .replaceAll(`{{description}}`, escapeAttribute(meta.description))
    .replaceAll(`{{keywords}}`, escapeAttribute(meta.keywords))
    .replaceAll(`{{htmlLang}}`, meta.htmlLang);

const build = (
  locale: Locale,
  theme: ResolvedTheme | undefined,
  template: string,
  entry: SsrEntry,
  injectTheme: InjectTheme,
) => {
  const withMeta = injectMeta(template, entry.getMeta(locale));
  const withRoot = withMeta.replace(rootPlaceholder, `<div id="root">${entry.render(locale, theme)}</div>`);

  return injectTheme(withRoot, theme);
};

export const SiteSsr = { build };
