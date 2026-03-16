import { useStoreValue } from "@snappy/store";
import { $locale, type Locale } from "@snappy/ui";

export const useSettingsLanguageState = () => {
  const locale = useStoreValue($locale);
  const onSelect = (value: Locale) => $locale.set(value);

  return { onSelect, value: locale };
};
