import type { Locale } from "@snappy/intl";

import { localeData } from "./locales";

const siteUrl = (origin: string) => `${origin.replace(/\/$/u, ``)}/`;

const jsonLd = (locale: Locale, origin: string) => {
  const { schema } = localeData[locale];
  const url = siteUrl(origin);

  return `<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": `https://schema.org`,
    "@graph": [
      { "@id": `${url}#organization`, "@type": `Organization`, "logo": `${url}favicon.svg`, "name": `Snappy`, url },
      {
        "@id": `${url}#website`,
        "@type": `WebSite`,
        "inLanguage": locale,
        "name": `Snappy`,
        "publisher": { "@id": `${url}#organization` },
        url,
      },
      {
        "@id": `${url}#app`,
        "@type": `SoftwareApplication`,
        "applicationCategory": `MultimediaApplication`,
        "featureList": schema.features,
        "inLanguage": locale,
        "name": `Snappy`,
        "operatingSystem": `Web, Android`,
        "publisher": { "@id": `${url}#organization` },
        url,
      },
      {
        "@id": `${url}#service`,
        "@type": `Service`,
        "areaServed": { "@type": `Country`, "name": schema.areaServed },
        "availableLanguage": locale,
        "description": schema.serviceDescription,
        "name": `Snappy`,
        "provider": { "@id": `${url}#organization` },
        "serviceType": schema.serviceType,
      },
    ],
  },
  undefined,
  2,
)}
    </script>`;
};

export const SiteSchema = { jsonLd };
