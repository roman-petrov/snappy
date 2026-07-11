// cspell:words urlset changefreq sitemaps
import type { TextRoute } from "@snappy/server-module";

import { ConfigValues } from "@snappy/config";
import { MimeType } from "@snappy/core";

export const MountSeo = (paths: readonly string[]): TextRoute[] => {
  const loc = (path: string) => `${ConfigValues.origin(ConfigValues.env())}${path}`;

  return [
    {
      path: `/robots.txt`,
      text: `User-agent: *\nDisallow: /app\nDisallow: /admin\n\nSitemap: ${loc(`/`)}sitemap.xml\n`,
      type: MimeType.textPlain,
    },
    {
      path: `/sitemap.xml`,
      text: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    path => `  <url>
    <loc>${loc(path)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === `/` ? `1.0` : `0.5`}</priority>
  </url>`,
  )
  .join(`\n`)}
</urlset>
`,
      type: MimeType.xml,
    },
  ];
};
