// cspell:word assetlinks colonless
import type { TextRoute } from "@snappy/server-module";

import { Config } from "@snappy/config";
import { MimeType } from "@snappy/core";

export const MountAssetLinks = (fingerprint = Config.androidCertSha256()): TextRoute => {
  const hex = fingerprint.replaceAll(`:`, ``).toUpperCase();
  const pairs = hex.match(/.{2}/gu);
  const formatted = pairs === null ? fingerprint : pairs.join(`:`);

  return {
    path: `/.well-known/assetlinks.json`,
    text: JSON.stringify([
      {
        relation: [`delegate_permission/common.handle_all_urls`],
        target: { namespace: `android_app`, package_name: `com.snappy.app`, sha256_cert_fingerprints: [formatted] },
      },
    ]),
    type: MimeType.json,
  };
};
