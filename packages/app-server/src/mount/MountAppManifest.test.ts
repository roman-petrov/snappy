import { MimeType } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { MountAppManifest } from "./MountAppManifest";

describe(`MountAppManifest`, () => {
  it(`serves manifest.webmanifest`, () => {
    const route = MountAppManifest();

    expect(route.path).toBe(`/app/manifest.webmanifest`);
    expect(route.type).toBe(MimeType.manifest);
    expect(JSON.parse(route.text(`en`))).toMatchObject({ lang: `en`, name: `Snappy PWA` });
    expect(JSON.parse(route.text(`ru`))).toMatchObject({ lang: `ru`, name: `Snappy PWA` });
  });
});
