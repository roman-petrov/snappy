import { HeaderButtonGroup } from "./HeaderButtonGroup";
import { IconButtonLocale } from "./IconButtonLocale";
import { IconButtonTheme } from "./IconButtonTheme";

export const SystemButtons = () => (
  <HeaderButtonGroup>
    <IconButtonTheme />
    <IconButtonLocale />
  </HeaderButtonGroup>
);
