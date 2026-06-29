/* cspell:word vectordrawable gradlew */
/* eslint-disable functional/no-expression-statements */
import { Secrets, type SecretsResult } from "@snappy/config";
import { Directory, File, Process } from "@snappy/node";
import { join } from "node:path";
import svg2vectordrawable from "svg2vectordrawable";

import { AndroidSigning } from "./AndroidSigning";
import { Run } from "./Run";

const androidDir = (root: string) => join(root, `packages`, `app-android`, `android`);
const gradlew = (root: string) => join(androidDir(root), process.platform === `win32` ? `gradlew.bat` : `gradlew`);

const drawable = async (root: string) => {
  const svg = join(root, `packages`, `ui`, `src`, `assets`, `favicon.svg`);
  if (!File.exists(svg)) {
    return;
  }
  const dir = join(androidDir(root), `app`, `src`, `main`, `res`, `drawable`);
  const svgCode = File.read(svg);
  const xmlCode = await svg2vectordrawable(svgCode, { floatPrecision: 2 });
  Directory.ensure(dir);
  File.write(join(dir, `ic_launcher.xml`), xmlCode);
};

const apkOutPath = (root: string, variant: `debug` | `release`) =>
  join(
    androidDir(root),
    `app`,
    `build`,
    `outputs`,
    `apk`,
    variant,
    variant === `release` ? `app-release.apk` : `app-debug.apk`,
  );

const requiredKey = (source: Record<string, string>, name: string): SecretsResult<string> => {
  const value = source[name];

  return value === undefined || value === `` ? { error: `${name} must be set`, ok: false } : { ok: true, value };
};

const values = (root: string, variant: `debug` | `release`) => {
  if (variant === `debug`) {
    return Secrets.dev(root);
  }

  const secretsKey = process.env[`SECRETS_KEY`];

  return secretsKey === undefined || secretsKey === `` ? Secrets.dev(root) : Secrets.prod(root, secretsKey);
};

const gradleSigningEnv = (keystore: string, password: string) => ({
  SNAPPY_KEY_ALIAS: AndroidSigning.alias,
  SNAPPY_KEYSTORE: keystore,
  SNAPPY_KEYSTORE_PASSWORD: password,
});

const keys = (root: string, variant: `debug` | `release`): SecretsResult<{ base64: string; password: string }> => {
  const loaded = values(root, variant);
  const base64 = loaded.ok ? requiredKey(loaded.value, AndroidSigning.keystoreBase64) : loaded;
  const password = base64.ok && loaded.ok ? requiredKey(loaded.value, AndroidSigning.keystorePassword) : base64;

  return loaded.ok
    ? base64.ok
      ? password.ok
        ? { ok: true, value: { base64: base64.value, password: password.value } }
        : password
      : base64
    : loaded;
};

const spawnGradle = async (
  root: string,
  task: string,
  capture: boolean,
  { env }: { env?: Record<string, string> } = {},
) => Process.spawn(androidDir(root), [gradlew(root), task], { ...(capture ? { capture: true } : {}), env });

const gradle = async (root: string, task: string, capture: boolean, prefix: string) =>
  Directory.withTemp(async dir => {
    const keystore = join(dir, `keystore.p12`);
    File.write(keystore, ``);

    return spawnGradle(root, task, capture, { env: gradleSigningEnv(keystore, `unused`) });
  }, prefix);

const spotless = async (root: string, task: `spotlessApply` | `spotlessCheck`, capture: boolean) =>
  gradle(root, task, capture, `snappy-spotless-`);

const clean = async (root: string, capture: boolean) => gradle(root, `clean`, capture, `snappy-clean-`);

const build = async (root: string, variant: `debug` | `release`, capture: boolean) => {
  const task = variant === `debug` ? `assembleDebug` : `assembleRelease`;
  const dist = variant === `debug` ? `snappy-debug.apk` : `snappy.apk`;
  await drawable(root);
  const loaded = keys(root, variant);

  return loaded.ok
    ? Directory.withTemp(async dir => {
        const keystore = join(dir, `keystore.p12`);
        File.write(keystore, Buffer.from(loaded.value.base64, `base64`));
        const result = await spawnGradle(root, task, capture, {
          env: gradleSigningEnv(keystore, loaded.value.password),
        });

        return Process.exitCode(result) === 0
          ? File.exists(apkOutPath(root, variant))
            ? (Directory.ensure(join(root, `dist`)), File.copy(apkOutPath(root, variant), join(root, `dist`, dist)), 0)
            : Run.fail(`APK not found after assemble.`)
          : result;
      }, `snappy-${variant}-`)
    : Run.fail(loaded.error);
};

export const Android = { build, clean, spotless };
