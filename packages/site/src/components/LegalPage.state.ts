import { Legal } from "@snappy/legal";
import { Language } from "@snappy/ui";

import type { LegalPageProps } from "./LegalPage";

export const useLegalPageState = ({ variant }: LegalPageProps) => {
  const locale = Language.locale();
  const { title } = Legal.page(variant, locale);

  return { locale, title, variant };
};
