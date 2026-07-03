import { ConfigValues } from "@snappy/config";
import { MimeType } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { MountSeo } from "./MountSeo";

const paths = [`/`, `/privacy`, `/terms`] as const;
const root = `${ConfigValues.origin(ConfigValues.env())}/`;

describe(`MountSeo`, () => {
  it(`returns robots.txt and sitemap.xml routes`, () => {
    expect(MountSeo(paths).map(({ path }) => path)).toStrictEqual([`/robots.txt`, `/sitemap.xml`]);
  });

  it(`serves robots.txt`, () => {
    expect(MountSeo(paths).filter(({ path }) => path === `/robots.txt`)).toStrictEqual([
      {
        path: `/robots.txt`,
        text: `User-agent: *\nAllow: /\n\nSitemap: ${root}sitemap.xml\n`,
        type: MimeType.textPlain,
      },
    ]);
  });

  it(`serves sitemap.xml with page urls and priorities`, () => {
    const sitemaps = MountSeo(paths).filter(({ path }) => path === `/sitemap.xml`);

    expect(sitemaps).toHaveLength(1);
    expect(sitemaps[0]?.type).toBe(MimeType.xml);

    const text = sitemaps[0]?.text ?? ``;

    expect(text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(text).toContain(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
    expect(text).toContain(`<loc>${root}</loc>`);
    expect(text).toContain(`<loc>${root.slice(0, -1)}/privacy</loc>`);
    expect(text).toContain(`<loc>${root.slice(0, -1)}/terms</loc>`);
    expect(text).toContain(`<priority>1.0</priority>`);
    expect(text.match(/<priority>0\.5<\/priority>/gu)?.length).toBe(2);
    expect(text.match(/<changefreq>weekly<\/changefreq>/gu)?.length).toBe(3);
  });

  it(`renders an empty urlset when there are no paths`, () => {
    const sitemap = MountSeo([]).find(({ path }) => path === `/sitemap.xml`);

    expect(sitemap?.text).toBe(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

</urlset>
`);
  });
});
