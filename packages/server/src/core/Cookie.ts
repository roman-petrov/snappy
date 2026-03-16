/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Locale, Theme } from "@snappy/ui";

export const Cookie = (value?: string, acceptLanguage?: string) => {
  const parse = (key: string) =>
    value === undefined
      ? undefined
      : value
          .split(`;`)
          .map(s => s.trim())
          .find(s => s.startsWith(`${key}=`))
          ?.split(`=`)[1];

  const locale = Locale.resolve(
    (parse(Locale.key) ?? (acceptLanguage?.toLowerCase().startsWith(`ru`) === true ? `ru` : `en`)) as
      | Locale
      | undefined,
  );

  const theme = Theme.resolve(parse(Theme.key) as Theme | undefined);

  return { locale, theme };
};
