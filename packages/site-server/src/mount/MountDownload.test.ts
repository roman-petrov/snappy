import { MimeType } from "@snappy/core";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { MountDownload } from "./MountDownload";

describe(`MountDownload`, () => {
  it(`describes the apk download route`, () => {
    const distDir = `/var/dist`;

    expect(MountDownload(distDir)).toStrictEqual({
      disposition: `attachment; filename="snappy.apk"`,
      file: join(distDir, `snappy.apk`),
      path: `/download/snappy.apk`,
      type: MimeType.apk,
    });
  });
});
