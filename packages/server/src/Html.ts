import type { Locale } from "@snappy/intl";
import type { InjectTheme } from "@snappy/server-module";
import type { Theme } from "@snappy/ui-core";

const dataThemePlaceholder = /data-theme="[^"]*"/u;
const htmlLangPlaceholder = /lang="[^"]*"/u;
const systemThemeScript = `<script>document.documentElement.dataset.theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'</script>`;

const injectTheme: InjectTheme = (html, theme) => {
  const resolved = theme === `dark` || theme === `light` ? theme : `light`;
  const withTheme = html.replace(dataThemePlaceholder, `data-theme="${resolved}"`);

  return theme === `system` || theme === undefined
    ? withTheme.replace(`<head>`, `<head>${systemThemeScript}`)
    : withTheme;
};

const prepareIndex = (html: string, locale: Locale, theme: Theme | undefined) =>
  injectTheme(html.replace(htmlLangPlaceholder, `lang="${locale}"`), theme);

export const Html = { injectTheme, prepareIndex };
