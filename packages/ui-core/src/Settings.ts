/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _, Cookie } from "@snappy/core";

import { Language, type Language as LanguageValue } from "./Language";
import { Theme, type Theme as ThemeValue } from "./Theme";

export const Settings = (request?: {
  headers: Record<string, string | string[] | undefined> | { get: (name: string) => null | string | undefined };
}) => {
  type RequestHeaders = NonNullable<typeof request>[`headers`];

  const header = (headers: RequestHeaders | undefined, name: string) => {
    if (headers === undefined) {
      return undefined;
    }
    if (`get` in headers && _.isFunction(headers.get)) {
      return headers.get(name) ?? undefined;
    }
    const value = (headers as Record<string, string | string[] | undefined>)[name];

    return _.isString(value) ? value : value?.[0];
  };

  const headers = request?.headers;
  const cookie = header(headers, `cookie`);
  const acceptLanguage = header(headers, `accept-language`);
  const stored = Cookie.value(cookie, Language.key) as LanguageValue | undefined;
  const fallback = acceptLanguage?.toLowerCase().startsWith(`ru`) === true ? `ru` : `en`;
  const locale = Language.resolve(stored ?? fallback);
  const theme = Theme.resolve(Cookie.value(cookie, Theme.key) as ThemeValue | undefined);

  return { locale, theme };
};

export type Settings = ReturnType<typeof Settings>;
