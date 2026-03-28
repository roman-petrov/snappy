import { useStoreValue } from "@snappy/store";

import { $locale, Locale, t } from "..";
import { IconButton } from "./IconButton";

export const IconButtonLocale = () => (
  <IconButton
    icon={{ emoji: useStoreValue($locale) === `ru` ? `🇷🇺` : `🇺🇸` }}
    onClick={Locale.toggle}
    tip={t(`localeSwitcher`)}
  />
);
