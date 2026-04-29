import { useStoreValue } from "@snappy/store";
import { $locale, type Language } from "@snappy/ui";

export const useSettingsLanguageState = () => {
  const locale = useStoreValue($locale);
  const onSelect = (value: Language) => $locale.set(value);

  return { onSelect, value: locale };
};
