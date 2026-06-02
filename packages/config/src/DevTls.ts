import { homedir } from "node:os";
import { join } from "node:path";

const dir = join(homedir(), `.snappy`, `cert`);
const certPath = join(dir, `cert.pem`);
const keyPath = join(dir, `key.pem`);

export const DevTls = { certPath, dir, keyPath };
