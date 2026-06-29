// cspell: word keytool storetype genkeypair keyalg keysize storepass keypass

import { Secrets, type SecretsResult } from "@snappy/config";
import { _, Password } from "@snappy/core";
import { Console, Directory, File, Process, Terminal } from "@snappy/node";
import { join } from "node:path";

import { AndroidSigning } from "./AndroidSigning";
import { Run } from "./Run";

const file = (name: string) => Terminal.cyan(name);
const command = (name: string) => Terminal.yellow(`bun do ${name}`);

const modes = {
  dev: {
    dname: `CN=Snappy Dev`,
    done: undefined,
    missing: `Missing ${file(`secrets.dev.yaml`)}. Copy ${file(`secrets.dev.example.yaml`)} to get started.`,
    path: (root: string) => join(root, `secrets.dev.yaml`),
  },
  prod: {
    dname: `CN=Snappy`,
    done: `🔒 Run ${command(`encrypt`)} when done.`,
    missing: `Missing ${file(`secrets.prod.yaml`)}. Run ${command(`decrypt`)} → ${command(`android-keys-prod`)} → ${command(`encrypt`)}`,
    path: (root: string) => join(root, `secrets.prod.yaml`),
  },
} as const;

type Mode = keyof typeof modes;

const keytoolPath = () => {
  const home = process.env[`JAVA_HOME`];

  return home === undefined || home === ``
    ? undefined
    : join(home, `bin`, process.platform === `win32` ? `keytool.exe` : `keytool`);
};

const keytoolError = (result: number | { exitCode: number; stderr: string }) => {
  const detail = _.isObject(result) && result.stderr.trim() !== `` ? result.stderr.trim() : undefined;

  return detail === undefined ? `keytool failed.` : `keytool failed: ${detail}`;
};

const keystoreBase64 = async (dname: string, password: string): Promise<SecretsResult<string>> => {
  const tool = keytoolPath();

  return tool === undefined
    ? { error: `JAVA_HOME must be set`, ok: false }
    : Directory.withTemp(async dir => {
        const keystore = join(dir, `keystore.p12`);

        const result = await Process.spawn(
          dir,
          [
            tool,
            `-genkeypair`,
            `-storetype`,
            `PKCS12`,
            `-keystore`,
            keystore,
            `-alias`,
            AndroidSigning.alias,
            `-keyalg`,
            `RSA`,
            `-keysize`,
            `2048`,
            `-validity`,
            `10000`,
            `-storepass`,
            password,
            `-keypass`,
            password,
            `-dname`,
            dname,
          ],
          { capture: true },
        );

        return Process.exitCode(result) === 0
          ? { ok: true, value: File.bytes(keystore).toString(`base64`) }
          : { error: keytoolError(result), ok: false };
      }, `snappy-keys-`);
};

const update = async (root: string, mode: Mode) => {
  const config = modes[mode];
  const path = config.path(root);
  if (!File.exists(path)) {
    return Run.fail(config.missing, { red: false });
  }

  const password = Password.generate();
  const generated = await keystoreBase64(config.dname, password);
  if (!generated.ok) {
    return Run.fail(generated.error);
  }

  const merged = Secrets.mergeYaml(path, {
    [AndroidSigning.keystoreBase64]: generated.value,
    [AndroidSigning.keystorePassword]: password,
  });

  return merged.ok
    ? (config.done !== undefined && (Console.logLine(``), Console.logLine(config.done)), 0)
    : Run.fail(merged.error);
};

export const AndroidKeys = { update };
