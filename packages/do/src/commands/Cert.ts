/* eslint-disable functional/no-expression-statements */
import { Config, DevTls } from "@snappy/config";
import { Cert as CertUtility } from "@snappy/node";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { Command } from "../Command";

export const Cert: Command = {
  description: `Set up HTTPS for local development.`,
  label: `🔐 Dev TLS`,
  mcp: false,
  name: `cert`,
  run: async () => {
    const { ca, cert, key } = await CertUtility.generate(Config.host);
    mkdirSync(DevTls.dir, { recursive: true });
    writeFileSync(join(DevTls.dir, `ca.pem`), ca.cert);
    writeFileSync(join(DevTls.dir, `ca-key.pem`), ca.key);
    writeFileSync(DevTls.certPath, cert);
    writeFileSync(DevTls.keyPath, key);

    return 0;
  },
};
