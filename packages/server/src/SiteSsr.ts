import type { ResolvedLocale, Theme } from "@snappy/ui";

const rootPlaceholder = /<div id="root">\s*<\/div>/u;
const dataThemePlaceholder = /data-theme="[^"]*"/u;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

export type SsrEntry = {
  getMeta: (locale: ResolvedLocale) => SiteMeta;
  render: (locale: ResolvedLocale, theme: Theme | undefined) => string;
};

const escapeAttribute = (s: string) =>
  s.replaceAll(`&`, `&amp;`).replaceAll(`"`, `&quot;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const injectMeta = (template: string, meta: SiteMeta) =>
  template
    .replaceAll(`{{title}}`, escapeAttribute(meta.title))
    .replaceAll(`{{description}}`, escapeAttribute(meta.description))
    .replaceAll(`{{keywords}}`, escapeAttribute(meta.keywords))
    .replaceAll(`{{htmlLang}}`, meta.htmlLang);

const systemThemeScript = `<script>document.documentElement.dataset.theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'</script>`;

const injectTheme = (html: string, theme: Theme | undefined): string => {
  const resolved = theme === `dark` || theme === `light` ? theme : `light`;
  const withTheme = html.replace(dataThemePlaceholder, `data-theme="${resolved}"`);

  return theme === `system` || theme === undefined
    ? withTheme.replace(`<head>`, `<head>${systemThemeScript}`)
    : withTheme;
};

const build = (locale: ResolvedLocale, theme: Theme | undefined, template: string, entry: SsrEntry) => {
  const withMeta = injectMeta(template, entry.getMeta(locale));
  const withRoot = withMeta.replace(rootPlaceholder, `<div id="root">${entry.render(locale, theme)}</div>`);

  return injectTheme(withRoot, theme);
};

const htmlLangPlaceholder = /lang="[^"]*"/u;

const prepareAppIndex = (html: string, locale: ResolvedLocale, theme: Theme | undefined) =>
  injectTheme(html.replace(htmlLangPlaceholder, `lang="${locale}"`), theme);

export const SiteSsr = { build, prepareAppIndex };
