// cspell:word colonless
import { describe, expect, it } from "vitest";

import { AssetLinks } from "./AssetLinks";

const { body } = AssetLinks;

describe(`body`, () => {
  it(`formats a colonless SHA-256 fingerprint for Digital Asset Links`, () => {
    expect(JSON.parse(body(`ac39b412a5b266c1d6a3d3f551e971ecbc9642afc902b3ac8a4102fdc2355ee1`))).toStrictEqual([
      {
        relation: [`delegate_permission/common.handle_all_urls`],
        target: {
          namespace: `android_app`,
          package_name: `com.snappy.app`,
          sha256_cert_fingerprints: [
            `AC:39:B4:12:A5:B2:66:C1:D6:A3:D3:F5:51:E9:71:EC:BC:96:42:AF:C9:02:B3:AC:8A:41:02:FD:C2:35:5E:E1`,
          ],
        },
      },
    ]);
  });

  it(`keeps an already formatted fingerprint`, () => {
    const formatted = `AC:39:B4:12:A5:B2:66:C1:D6:A3:D3:F5:51:E9:71:EC:BC:96:42:AF:C9:02:B3:AC:8A:41:02:FD:C2:35:5E:E1`;

    expect(JSON.parse(body(formatted))).toStrictEqual([
      {
        relation: [`delegate_permission/common.handle_all_urls`],
        target: { namespace: `android_app`, package_name: `com.snappy.app`, sha256_cert_fingerprints: [formatted] },
      },
    ]);
  });
});
