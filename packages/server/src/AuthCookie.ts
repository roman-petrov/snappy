import { Time } from "@snappy/core";

const name = `token`;
const maxAgeDays = 7;
const maxAgeMs = maxAgeDays * Time.dayInMs;

const token = (header: string) => {
  const prefix = `${name}=`;

  const part = header
    .split(`;`)
    .map(segment => segment.trimStart())
    .find(segment => segment.startsWith(prefix));

  return part === undefined ? undefined : part.slice(prefix.length).trim();
};

export const AuthCookie = { maxAgeMs, name, token };
