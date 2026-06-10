/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
import { _ } from "@snappy/core";

import type { Environment } from "./Types";

import { Secrets, type SecretsResult } from "./Secrets";

const root = process.cwd();
const devHost = `home.local`;
const prodHost = `snappy-ai.ru`;
const production = () => process.env.NODE_ENV === `production`;

const required = (source: Record<string, string>, name: string) => {
  const value = source[name];
  if (value === undefined || value === ``) {
    throw new Error(`${name} must be set`);
  }

  return value;
};

const load = () => {
  const prodSecrets = () => {
    const secretsKey = process.env[`SECRETS_KEY`];

    return secretsKey !== undefined && secretsKey !== ``
      ? Secrets.prod(root, secretsKey)
      : { error: `SECRETS_KEY must be set`, ok: false as const };
  };

  const result = production() ? prodSecrets() : Secrets.dev(root);

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.value;
};

const values = (() => {
  let cached: Record<string, string> | undefined;

  return () => {
    cached ??= load();

    return cached;
  };
})();

const origin = (mode: Environment) => _.https(mode === `dev` ? devHost : prodHost);

const secretsFor = (mode: Environment, secretsKey?: string): SecretsResult<Record<string, string>> =>
  mode === `dev`
    ? Secrets.dev(root)
    : secretsKey === undefined || secretsKey === ``
      ? { error: `Secrets key is required.`, ok: false }
      : Secrets.prod(root, secretsKey);

export const ConfigValues = { devHost, origin, prodHost, production, required, root, secretsFor, values };

export type ConfigValues = typeof ConfigValues;
