import { useStoreValue } from "@snappy/store";

import { $locale, Language, t } from "..";
import { IconButton } from "./IconButton";

export const IconButtonLocale = () => (
  <IconButton
    icon={{ emoji: useStoreValue($locale) === `ru` ? `🇷🇺` : `🇺🇸` }}
    onClick={Language.toggle}
    tip={t(`localeSwitcher`)}
  />
);
