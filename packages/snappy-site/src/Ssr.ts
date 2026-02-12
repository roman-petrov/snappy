/**
 * Shared SSR logic for site: locale, meta injection, HTML formatting.
 * Used by dev server (server.ts) and prod handler (@snappy/server Ssr.ts).
 */
import beautify from "js-beautify";

const COOKIE_NAME = `snappy-locale`;
const ROOT_PLACEHOLDER = /<div id="root">\s*<\/div>/u;

export type SiteLocaleKey = `en` | `ru`;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

type SsrEntry = { getMeta?: (locale: SiteLocaleKey) => SiteMeta; render: (locale: SiteLocaleKey) => string };

const escapeAttribute = (s: string): string =>
  s.replaceAll(`&`, `&amp;`).replaceAll(`"`, `&quot;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const localeFromCookie = (cookieHeader: string | undefined): SiteLocaleKey => {
  if (cookieHeader === undefined) {return `ru`;}
  const match = cookieHeader
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${COOKIE_NAME}=`));

  const value = match?.split(`=`)[1];

  return value === `en` || value === `ru` ? value : `ru`;
};

const injectMeta = (template: string, meta: SiteMeta): string =>
  template
    .replaceAll(`{{title}}`, escapeAttribute(meta.title))
    .replaceAll(`{{description}}`, escapeAttribute(meta.description))
    .replaceAll(`{{keywords}}`, escapeAttribute(meta.keywords))
    .replaceAll(`{{htmlLang}}`, meta.htmlLang);

const formatHtml = (html: string): string => beautify.html(html, { end_with_newline: true, indent_size: 2 });

const buildHtml = (locale: SiteLocaleKey, template: string, entry: SsrEntry): string => {
  const t = entry.getMeta === undefined ? template : injectMeta(template, entry.getMeta(locale));

  return formatHtml(t.replace(ROOT_PLACEHOLDER, `<div id="root">${entry.render(locale)}</div>`));
};

export const Ssr = { buildHtml, COOKIE_NAME, formatHtml, injectMeta, localeFromCookie, ROOT_PLACEHOLDER };
