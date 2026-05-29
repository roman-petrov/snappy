import type { Locale } from "@snappy/intl";

import { Theme } from "@snappy/ui-core";

const body = (locale: Locale) => {
  const text: Record<Locale, { description: string; name: string }> = {
    en: { description: `Create and polish content with AI`, name: `Snappy PWA` },
    ru: { description: `Создавайте и улучшайте контент с ИИ`, name: `Snappy PWA` },
  };

  const { description, name } = text[locale];

  return JSON.stringify({
    background_color: Theme.chrome.light,
    categories: [`productivity`],
    description,
    display: `fullscreen`,
    display_override: [`fullscreen`, `standalone`],
    icons: [{ purpose: `any`, sizes: `any`, src: `favicon.svg`, type: `image/svg+xml` }],
    lang: locale,
    name,
    orientation: `portrait-primary`,
    scope: `.`,
    short_name: name,
    start_url: `.`,
    theme_color: Theme.chrome.light,
  });
};

export const AppManifest = { body };
