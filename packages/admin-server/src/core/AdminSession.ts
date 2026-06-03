/* eslint-disable functional/no-try-statements */
import type { FastifyReply } from "fastify";

import { Config } from "@snappy/config";
import { _, Cookie } from "@snappy/core";
import { createHmac, timingSafeEqual } from "node:crypto";

export type AdminSessionPayload = { exp: number };

const cookieName = `snappy-admin`;
const cookiePath = `/api/admin`;
const ttlMs = _.day * _.daysInWeek;

const cookieOptions = {
  httpOnly: true,
  maxAge: ttlMs / _.second,
  path: cookiePath,
  sameSite: `lax` as const,
  secure: true,
};

const isPayload = (value: unknown): value is AdminSessionPayload =>
  value !== null && _.isObject(value) && `exp` in value && _.isNumber(value.exp);

const signPayload = (payload: AdminSessionPayload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString(`base64url`);
  const signature = createHmac(`sha256`, Config.adminSessionSecret).update(body).digest(`base64url`);

  return `${body}.${signature}`;
};

const parseToken = (token: string): AdminSessionPayload | undefined => {
  const [body, signature] = token.split(`.`);
  if (body === undefined || signature === undefined || body === `` || signature === ``) {
    return undefined;
  }
  const expected = createHmac(`sha256`, Config.adminSessionSecret).update(body).digest(`base64url`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return undefined;
  }
  try {
    const payload: unknown = JSON.parse(Buffer.from(body, `base64url`).toString(`utf8`));

    return isPayload(payload) ? payload : undefined;
  } catch {
    return undefined;
  }
};

const credentialsMatch = (username: string, password: string) => {
  const usernameOk =
    username.length === Config.adminUsername.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(Config.adminUsername));

  const passwordOk =
    password.length === Config.adminPassword.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(Config.adminPassword));

  return usernameOk && passwordOk;
};

const token = (cookie?: string) => Cookie.decoded(cookie, cookieName);

const verify = (cookie?: string) => {
  const value = token(cookie);
  if (value === undefined) {
    return false;
  }
  const payload = parseToken(value);
  if (payload === undefined) {
    return false;
  }

  return payload.exp > _.now();
};

const issue = () => signPayload({ exp: _.now() + ttlMs });
const apply = (reply: FastifyReply, value: string) => reply.setCookie(cookieName, value, cookieOptions);
const clear = (reply: FastifyReply) => reply.clearCookie(cookieName, { path: cookiePath });

export const AdminSession = { apply, clear, credentialsMatch, issue, verify };
