/* eslint-disable functional/no-expression-statements */
import { _, Cookie } from "@snappy/core";

const key = `cookie-consent` as const;
const path = `/` as const;
const value = `1` as const;
const read = () => Cookie.value(_.ssr ? undefined : document.cookie, key);
const given = () => read() === value;
const missing = () => read() === undefined;
const expiresMs = _.day * _.daysInYear;

const accept = () => {
  void cookieStore.set({ expires: _.now() + expiresMs, name: key, path, value });
};

export const CookieConsent = { accept, given, missing };
