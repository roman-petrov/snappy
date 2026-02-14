/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { I18n } from "@snappy/core";

const makeT = <T extends string>(
  localeData: Record<T, unknown>,
  getLocale: () => T,
): ((key: string, parameters?: Record<string, number | string>) => string) => {
  const locale = (key: T) => localeData[key];

  return (key: string, parameters?: Record<string, number | string>) => {
    const localeKey = getLocale();
    const messages = locale(localeKey);
    const value = I18n.resolveByPath(messages, key.split(`.`));
    if (value === I18n.notFoundSymbol) {
      return key;
    }
    const template = String(value);

    return parameters === undefined ? template : I18n.interpolate(template, Object.entries(parameters));
  };
};

export const Translate = { makeT };
