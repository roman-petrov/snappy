// cspell:words urlset changefreq sitemaps
import { ConfigValues } from "@snappy/config";

const url = () => `${ConfigValues.origin(ConfigValues.env())}/`;
const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${url()}sitemap.xml\n`;

const sitemap = () =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url()}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

export const Seo = { robots, sitemap };
