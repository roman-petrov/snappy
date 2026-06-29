// cspell: word keytool storetype genkeypair keyalg keysize storepass keypass
/* eslint-disable functional/no-expression-statements */
import { SecretKeys, Secrets, type SecretsResult } from "@snappy/config";
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

const withKeystore = async <T>(
  prefix: string,
  fn: (dir: string, keystore: string, tool: string) => Promise<SecretsResult<T>>,
): Promise<SecretsResult<T>> => {
  const tool = keytoolPath();

  return tool === undefined
    ? { error: `JAVA_HOME must be set`, ok: false }
    : Directory.withTemp(async dir => fn(dir, join(dir, `keystore.p12`), tool), prefix);
};

const certSha256FromKeystore = async (base64: string, password: string): Promise<SecretsResult<string>> =>
  withKeystore(`snappy-fp-`, async (dir, keystore, tool) => {
    File.write(keystore, Buffer.from(base64, `base64`));

    const result = await Process.spawn(
      dir,
      [tool, `-list`, `-v`, `-keystore`, keystore, `-storepass`, password, `-alias`, AndroidSigning.alias],
      { capture: true },
    );

    if (Process.exitCode(result) !== 0) {
      return { error: keytoolError(result), ok: false };
    }

    const stdout = _.isObject(result) ? result.stdout : ``;
    const sha256 = /SHA256:\s*(?<sha256>[0-9:A-Fa-f]+)/u.exec(stdout)?.groups?.[`sha256`];

    return sha256 === undefined
      ? { error: `SHA256 fingerprint not found in keytool output.`, ok: false }
      : { ok: true, value: sha256.replaceAll(`:`, ``).toUpperCase() };
  });

const keystoreBase64 = async (dname: string, password: string): Promise<SecretsResult<string>> =>
  withKeystore(`snappy-keys-`, async (dir, keystore, tool) => {
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
  });

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

  const fingerprint = await certSha256FromKeystore(generated.value, password);
  if (!fingerprint.ok) {
    return Run.fail(fingerprint.error);
  }

  const merged = Secrets.mergeYaml(path, {
    [SecretKeys.androidCertSha256]: fingerprint.value,
    [SecretKeys.androidKeystoreBase64]: generated.value,
    [SecretKeys.androidKeystorePassword]: password,
  });

  return merged.ok
    ? (config.done !== undefined && (Console.logLine(``), Console.logLine(config.done)), 0)
    : Run.fail(merged.error);
};

export const AndroidKeys = { update };
