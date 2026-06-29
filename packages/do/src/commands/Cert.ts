/* eslint-disable functional/no-expression-statements */
import { Config, DevTls } from "@snappy/config";
import { Cert as CertUtility, Directory, File } from "@snappy/node";
import { join } from "node:path";

import type { Command } from "../Command";

export const Cert: Command = {
  description: `Set up HTTPS for local development.`,
  label: `🔐 Dev TLS`,
  mcp: false,
  name: `cert`,
  run: async () => {
    const { ca, cert, key } = await CertUtility.generate(Config.host);
    Directory.ensure(DevTls.dir);
    File.write(join(DevTls.dir, `ca.pem`), ca.cert);
    File.write(join(DevTls.dir, `ca-key.pem`), ca.key);
    File.write(DevTls.certPath, cert);
    File.write(DevTls.keyPath, key);

    return 0;
  },
};
