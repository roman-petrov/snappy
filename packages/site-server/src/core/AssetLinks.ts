const packageName = `com.snappy.app`;

const format = (value: string) => {
  const hex = value.replaceAll(`:`, ``).toUpperCase();
  const pairs = hex.match(/.{2}/gu);

  return pairs === null ? value : pairs.join(`:`);
};

const body = (fingerprint: string) =>
  JSON.stringify([
    {
      relation: [`delegate_permission/common.handle_all_urls`],
      target: { namespace: `android_app`, package_name: packageName, sha256_cert_fingerprints: [format(fingerprint)] },
    },
  ]);

export const AssetLinks = { body };
