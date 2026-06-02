/* eslint-disable functional/no-expression-statements */
import { DevTls } from "@snappy/config";
import { Cert } from "@snappy/node";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const write = async (host: string) => {
  const { ca, cert, key } = await Cert.generate(host);
  mkdirSync(DevTls.dir, { recursive: true });
  writeFileSync(join(DevTls.dir, `ca.pem`), ca.cert);
  writeFileSync(join(DevTls.dir, `ca-key.pem`), ca.key);
  writeFileSync(DevTls.certPath, cert);
  writeFileSync(DevTls.keyPath, key);
};

export const DevCert = { write };
