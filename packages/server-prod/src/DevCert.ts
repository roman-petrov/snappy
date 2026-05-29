/* eslint-disable functional/no-expression-statements */
import { Cert } from "@snappy/node";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const certsDir = join(homedir(), `.snappy`, `cert`);
const certPath = join(certsDir, `cert.pem`);
const keyPath = join(certsDir, `key.pem`);

const read = () => {
  if (!existsSync(certPath) || !existsSync(keyPath)) {
    throw new Error(`Dev TLS cert missing. Run: bun do cert`);
  }

  return { cert: readFileSync(certPath, `utf8`), key: readFileSync(keyPath, `utf8`) };
};

const write = async (host: string) => {
  const { ca, cert, key } = await Cert.generate(host);
  mkdirSync(certsDir, { recursive: true });
  writeFileSync(join(certsDir, `ca.pem`), ca.cert);
  writeFileSync(join(certsDir, `ca-key.pem`), ca.key);
  writeFileSync(certPath, cert);
  writeFileSync(keyPath, key);
};

export const DevCert = { read, write };
