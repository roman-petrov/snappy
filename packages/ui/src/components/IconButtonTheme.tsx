import { useStoreValue } from "@snappy/store";

import { $theme, t, Theme } from "..";
import { IconButton } from "./IconButton";

export const IconButtonTheme = () => (
  <IconButton icon={useStoreValue($theme) === `dark` ? `🌙` : `☀️`} onClick={Theme.toggle} tip={t(`themeToggle`)} />
);
