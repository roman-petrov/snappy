import type { RpcClient } from "@snappy/admin-server-api";

import { _ } from "@snappy/core";

const signIn = async (username: string, password: string) => {
  const response = await fetch(`/api/admin/session`, {
    body: JSON.stringify({ password, username }),
    credentials: `include`,
    headers: { "content-type": `application/json` },
    method: `POST`,
  });

  const value: unknown = await response.json();

  return value !== null &&
    _.isObject(value) &&
    `status` in value &&
    (value.status === `ok` || value.status === `invalidCredentials`)
    ? { status: value.status }
    : { status: `invalidCredentials` };
};

const signOut = async () => fetch(`/api/admin/session`, { credentials: `include`, method: `DELETE` });

const signedIn = async (api: Pick<RpcClient, `auth`>) =>
  api.auth
    .session()
    .then(({ ok }) => ok)
    .catch(() => false);

export const Auth = { signedIn, signIn, signOut };
