import { _ } from "@snappy/core";

const name = `token`;
const maxAgeMs = _.daysInWeek * _.day;

const token = (header: string) => {
  const prefix = `${name}=`;

  const part = header
    .split(`;`)
    .map(segment => segment.trimStart())
    .find(segment => segment.startsWith(prefix));

  if (part === undefined) {
    return undefined;
  }
  const value = part.slice(prefix.length).trim();

  return value === `` ? undefined : value;
};

export const AuthCookie = { maxAgeMs, name, token };
