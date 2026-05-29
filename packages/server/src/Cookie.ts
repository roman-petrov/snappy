/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Language, Theme } from "@snappy/ui-core";

export const Cookie = (value?: string, acceptLanguage?: string) => {
  const parse = (key: string) =>
    value === undefined
      ? undefined
      : value
          .split(`;`)
          .map(s => s.trim())
          .find(s => s.startsWith(`${key}=`))
          ?.split(`=`)[1];

  const locale = Language.resolve(
    (parse(Language.key) ?? (acceptLanguage?.toLowerCase().startsWith(`ru`) === true ? `ru` : `en`)) as
      | Language
      | undefined,
  );

  const theme = Theme.resolve(parse(Theme.key) as Theme | undefined);

  return { locale, theme };
};

export type Cookie = ReturnType<typeof Cookie>;
