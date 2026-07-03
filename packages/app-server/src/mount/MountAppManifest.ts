import type { Locale } from "@snappy/intl";
import type { LocaleTextRoute } from "@snappy/server-module";

import { MimeType } from "@snappy/core";
import { Theme } from "@snappy/ui-core";

export const MountAppManifest = (): LocaleTextRoute => ({
  path: `/app/manifest.webmanifest`,
  text: locale => {
    const labels: Record<Locale, { description: string; name: string }> = {
      en: { description: `Create and polish content with AI`, name: `Snappy PWA` },
      ru: { description: `Создавайте и улучшайте контент с ИИ`, name: `Snappy PWA` },
    };

    const { description, name } = labels[locale];

    return JSON.stringify({
      background_color: Theme.chrome.light,
      categories: [`productivity`],
      description,
      display: `fullscreen`,
      display_override: [`fullscreen`, `standalone`],
      icons: [{ purpose: `any`, sizes: `any`, src: `favicon.svg`, type: MimeType.imageSvg }],
      lang: locale,
      name,
      orientation: `portrait-primary`,
      scope: `.`,
      short_name: name,
      start_url: `.`,
      theme_color: Theme.chrome.light,
    });
  },
  type: MimeType.manifest,
});
