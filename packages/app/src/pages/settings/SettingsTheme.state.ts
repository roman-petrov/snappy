import { useStoreValue } from "@snappy/store";
import { $theme, type Theme } from "@snappy/ui";

export const useSettingsThemeState = () => {
  const theme = useStoreValue($theme);
  const onSelect = (value: Theme) => $theme.set(value);

  return { onSelect, value: theme };
};
