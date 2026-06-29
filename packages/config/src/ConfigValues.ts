/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
import { _ } from "@snappy/core";

import type { SecretKey, SecretValues } from "./SecretKeys";
import type { Environment } from "./Types";

import { Secrets, type SecretsResult } from "./Secrets";

const root = process.cwd();
const devHost = `home.local`;
const prodHost = `snappy-ai.ru`;
const production = () => process.env.NODE_ENV === `production`;
const env = (): Environment => (production() ? `prod` : `dev`);

const required = (source: SecretValues, name: SecretKey) => {
  const value = source[name];
  if (value === undefined || value === ``) {
    throw new Error(`${name} must be set`);
  }

  return value;
};

const secretsFor = (mode: Environment): SecretsResult<SecretValues> => {
  if (mode === `dev`) {
    return Secrets.dev(root);
  }

  const secretsKey = process.env[`SECRETS_KEY`];

  return secretsKey === undefined || secretsKey === ``
    ? { error: `SECRETS_KEY must be set`, ok: false }
    : Secrets.prod(root, secretsKey);
};

const load = () => {
  const result = secretsFor(env());

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.value;
};

const values = (() => {
  let cached: SecretValues | undefined;

  return () => {
    cached ??= load();

    return cached;
  };
})();

const origin = (mode: Environment) => _.https(mode === `dev` ? devHost : prodHost);

export const ConfigValues = { devHost, env, origin, prodHost, production, required, root, secretsFor, values };

export type ConfigValues = typeof ConfigValues;
