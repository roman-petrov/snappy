import { useRouterGo } from "@snappy/app-router";
import { Legal, type LegalVariant } from "@snappy/legal";
import { Language } from "@snappy/ui";

export const useLegalPageState = (variant: LegalVariant) => {
  const locale = Language.locale();
  const { title } = Legal.page(variant, locale);

  return { locale, onNavigate: useRouterGo(), pathPrefix: `/app`, title, variant };
};
