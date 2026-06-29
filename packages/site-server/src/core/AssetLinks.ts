const packageName = `com.snappy.app`;

const body = (fingerprint: string) =>
  JSON.stringify([
    {
      relation: [`delegate_permission/common.handle_all_urls`],
      target: { namespace: `android_app`, package_name: packageName, sha256_cert_fingerprints: [fingerprint] },
    },
  ]);

export const AssetLinks = { body };
