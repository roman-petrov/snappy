/* eslint-disable functional/no-expression-statements */
import { Config, DevTls } from "@snappy/config";
import { Cert } from "@snappy/node";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const setup = async () => {
  const { ca, cert, key } = await Cert.generate(Config.host);
  mkdirSync(DevTls.dir, { recursive: true });
  writeFileSync(join(DevTls.dir, `ca.pem`), ca.cert);
  writeFileSync(join(DevTls.dir, `ca-key.pem`), ca.key);
  writeFileSync(DevTls.certPath, cert);
  writeFileSync(DevTls.keyPath, key);

  return 0;
};

export const DevCert = { setup };
