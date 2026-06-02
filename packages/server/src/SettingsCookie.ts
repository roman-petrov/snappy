/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Cookie } from "@snappy/core";
import { Language, Theme } from "@snappy/ui-core";

export const SettingsCookie = (value?: string, acceptLanguage?: string) => {
  const locale = Language.resolve(
    (Cookie.value(value, Language.key) ?? (acceptLanguage?.toLowerCase().startsWith(`ru`) === true ? `ru` : `en`)) as
      | Language
      | undefined,
  );

  const theme = Theme.resolve(Cookie.value(value, Theme.key) as Theme | undefined);

  return { locale, theme };
};

export type SettingsCookie = ReturnType<typeof SettingsCookie>;
