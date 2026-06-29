/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
import { _ } from "@snappy/core";
import { File } from "@snappy/node";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { join } from "node:path";
import { isMap, parseDocument, parse as yamlParse, stringify as yamlStringify } from "yaml";

export type SecretsResult<T> = { error: string; ok: false } | { ok: true; value: T };

type EncPayload = { cipherText: string; format: 1; nonce: string };

const salt = `snappy-secrets`;
const nonceBytes = 12;
const tagBytes = 16;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && _.isObject(value) && !_.isArray(value);

const encPayload = (value: unknown): EncPayload | undefined =>
  isPlainObject(value) && value[`format`] === 1 && _.isString(value[`nonce`]) && _.isString(value[`cipherText`])
    ? { cipherText: value[`cipherText`], format: 1, nonce: value[`nonce`] }
    : undefined;

const paths = (root: string) => ({
  dev: join(root, `secrets.dev.yaml`),
  prodEnc: join(root, `secrets.prod.enc.yaml`),
  prodPlain: join(root, `secrets.prod.yaml`),
});

const failure = (message: string): SecretsResult<never> => ({ error: message, ok: false });
const success = <T>(value: T): SecretsResult<T> => ({ ok: true, value });
const derived = (secretsKey: string) => scryptSync(secretsKey, salt, 32);
const key = () => randomBytes(32).toString(`base64url`);

const encrypt = (plain: string, secretsKey: string): EncPayload => {
  const nonce = randomBytes(nonceBytes);
  const cipher = createCipheriv(`aes-256-gcm`, derived(secretsKey), nonce);
  const encrypted = Buffer.concat([cipher.update(plain, `utf8`), cipher.final(), cipher.getAuthTag()]);

  return { cipherText: encrypted.toString(`base64`), format: 1, nonce: nonce.toString(`base64`) };
};

const decrypt = (payload: EncPayload, secretsKey: string) => {
  const nonce = Buffer.from(payload.nonce, `base64`);
  const blob = Buffer.from(payload.cipherText, `base64`);
  const tag = blob.subarray(blob.length - tagBytes);
  const data = blob.subarray(0, blob.length - tagBytes);
  const decipher = createDecipheriv(`aes-256-gcm`, derived(secretsKey), nonce).setAuthTag(tag);

  return Buffer.concat([decipher.update(data), decipher.final()]).toString(`utf8`);
};

const plainText = (payload: EncPayload, secretsKey: string): SecretsResult<string> => {
  try {
    return success(decrypt(payload, secretsKey));
  } catch {
    return failure(`Decryption failed.`);
  }
};

const readEnc = (path: string): SecretsResult<EncPayload> => {
  const raw: unknown = yamlParse(File.read(path));
  const parsed = encPayload(raw);

  return parsed === undefined ? failure(`Invalid encrypted secrets format.`) : success(parsed);
};

const writeEnc = (path: string, payload: EncPayload) => File.write(path, `${yamlStringify(payload).trim()}\n`);

const yamlToRecord = (text: string): SecretsResult<Record<string, string>> => {
  const parsed: unknown = yamlParse(text);

  return isPlainObject(parsed)
    ? success(
        _.fromEntries(
          _.entries(parsed)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([name, value]) => [name, String(value)]),
        ),
      )
    : failure(`Invalid secrets YAML.`);
};

const encryptFile = (root: string, secretsKey: string): SecretsResult<undefined> => {
  const { prodEnc, prodPlain } = paths(root);

  return File.exists(prodPlain)
    ? (writeEnc(prodEnc, encrypt(File.read(prodPlain), secretsKey)), success(undefined))
    : failure(`Missing ${prodPlain}`);
};

const decryptFile = (root: string, secretsKey: string): SecretsResult<undefined> => {
  const { prodEnc, prodPlain } = paths(root);
  const enc = readEnc(prodEnc);
  const decrypted = enc.ok ? plainText(enc.value, secretsKey) : enc;

  return File.exists(prodEnc)
    ? enc.ok
      ? decrypted.ok
        ? (File.write(prodPlain, decrypted.value), success(undefined))
        : decrypted
      : enc
    : failure(`Missing ${prodEnc}`);
};

const dev = (root: string): SecretsResult<Record<string, string>> => {
  const { dev: devPath } = paths(root);

  return File.exists(devPath)
    ? yamlToRecord(File.read(devPath))
    : failure(`Missing secrets.dev.yaml. Copy secrets.dev.example.yaml.`);
};

const prod = (root: string, secretsKey: string): SecretsResult<Record<string, string>> => {
  const { prodEnc } = paths(root);
  const enc = readEnc(prodEnc);
  const decrypted = enc.ok ? plainText(enc.value, secretsKey) : enc;

  return File.exists(prodEnc)
    ? enc.ok
      ? decrypted.ok
        ? yamlToRecord(decrypted.value)
        : decrypted
      : enc
    : failure(`Missing ${prodEnc}`);
};

const mergeYaml = (path: string, keys: Record<string, string>): SecretsResult<undefined> => {
  if (!File.exists(path)) {
    return failure(`Missing ${path}.`);
  }

  const yamlDocument = parseDocument(File.read(path));
  if (yamlDocument.errors.length > 0 || !isMap(yamlDocument.contents)) {
    return failure(`Invalid secrets YAML.`);
  }

  for (const [name, value] of _.entries(keys)) {
    yamlDocument.set(name, value);
  }

  File.write(path, yamlDocument.toString());

  return success(undefined);
};

export const Secrets = { decrypt, decryptFile, dev, encrypt, encryptFile, key, mergeYaml, prod };
