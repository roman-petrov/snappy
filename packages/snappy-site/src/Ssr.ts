/**
 * Shared SSR logic for site: locale, meta injection, HTML formatting.
 * Used by dev server (server.ts) and prod handler (@snappy/server Ssr.ts).
 */
import beautify from "js-beautify";

import { LocaleCookie, type SiteLocaleKey } from "./site/core/LocaleCookie";

const rootPlaceholder = /<div id="root">\s*<\/div>/u;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

type SsrEntry = { getMeta?: (locale: SiteLocaleKey) => SiteMeta; render: (locale: SiteLocaleKey) => string };

const escapeAttribute = (s: string): string =>
  s.replaceAll(`&`, `&amp;`).replaceAll(`"`, `&quot;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const localeFromCookie = (cookieHeader: string | undefined): SiteLocaleKey =>
  LocaleCookie.parseLocaleFromCookie(cookieHeader);

const injectMeta = (template: string, meta: SiteMeta): string =>
  template
    .replaceAll(`{{title}}`, escapeAttribute(meta.title))
    .replaceAll(`{{description}}`, escapeAttribute(meta.description))
    .replaceAll(`{{keywords}}`, escapeAttribute(meta.keywords))
    .replaceAll(`{{htmlLang}}`, meta.htmlLang);

const formatHtml = (html: string): string => beautify.html(html, { end_with_newline: true, indent_size: 2 });

const buildHtml = (locale: SiteLocaleKey, template: string, entry: SsrEntry): string => {
  const t = entry.getMeta === undefined ? template : injectMeta(template, entry.getMeta(locale));

  return formatHtml(t.replace(rootPlaceholder, `<div id="root">${entry.render(locale)}</div>`));
};

export const Ssr = {
  buildHtml,
  cookieName: LocaleCookie.cookieName,
  formatHtml,
  injectMeta,
  localeFromCookie,
  rootPlaceholder,
};
