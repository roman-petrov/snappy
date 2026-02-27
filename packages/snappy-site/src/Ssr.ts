/* eslint-disable unicorn/prefer-export-from */
import { LocaleCookie, type SiteLocaleKey } from "./site/core";

export type { SiteLocaleKey };

const rootPlaceholder = /<div id="root">\s*<\/div>/u;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

type SsrEntry = { getMeta?: (locale: SiteLocaleKey) => SiteMeta; render: (locale: SiteLocaleKey) => string };

const escapeAttribute = (s: string) =>
  s.replaceAll(`&`, `&amp;`).replaceAll(`"`, `&quot;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const localeFromCookie = (cookieHeader: string | undefined) => LocaleCookie.parseLocaleFromCookie(cookieHeader);

const injectMeta = (template: string, meta: SiteMeta) =>
  template
    .replaceAll(`{{title}}`, escapeAttribute(meta.title))
    .replaceAll(`{{description}}`, escapeAttribute(meta.description))
    .replaceAll(`{{keywords}}`, escapeAttribute(meta.keywords))
    .replaceAll(`{{htmlLang}}`, meta.htmlLang);

const buildHtml = (locale: SiteLocaleKey, template: string, entry: SsrEntry) => {
  const t = entry.getMeta === undefined ? template : injectMeta(template, entry.getMeta(locale));

  return t.replace(rootPlaceholder, `<div id="root">${entry.render(locale)}</div>`);
};

export const Ssr = { buildHtml, cookieName: LocaleCookie.cookieName, injectMeta, localeFromCookie, rootPlaceholder };
