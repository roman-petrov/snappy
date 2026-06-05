import { useStoreValue } from "@snappy/store";
import { $locale, type Language } from "@snappy/ui";

export const useSettingsLanguageState = () => {
  const locale = useStoreValue($locale);
  const select = (value: Language) => $locale.set(value);

  return { select, value: locale };
};
