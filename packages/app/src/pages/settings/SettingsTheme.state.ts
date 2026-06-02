import { useStoreValue } from "@snappy/store";
import { $theme, Theme } from "@snappy/ui";

export const useSettingsThemeState = () => {
  const theme = useStoreValue($theme);
  const onSelect = (value: Theme) => Theme.set(value);

  return { onSelect, value: theme };
};
