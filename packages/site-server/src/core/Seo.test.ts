import { ConfigValues } from "@snappy/config";
import { describe, expect, it } from "vitest";

import { Seo } from "./Seo";

const { robots, sitemap } = Seo;
const root = `${ConfigValues.origin(ConfigValues.env())}/`;

describe(`robots`, () => {
  it(`allows all crawlers and points to the sitemap`, () => {
    expect(robots()).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${root}sitemap.xml\n`);
  });
});

describe(`sitemap`, () => {
  it(`lists the root url as a valid urlset`, () => {
    const xml = sitemap();

    expect(xml).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(xml).toContain(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
    expect(xml).toContain(`<loc>${root}</loc>`);
  });
});
