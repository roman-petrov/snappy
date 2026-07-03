import type { Locale } from "@snappy/intl";

import type { LegalRoute, LegalVariant } from "../Legal";

import { useLegalArticleState } from "./LegalArticle.state";
import { LegalArticleView } from "./LegalArticle.view";

export type LegalArticleProps = {
  cn?: string;
  locale: Locale;
  onNavigate?: (path: LegalRoute) => Promise<void> | void;
  pathPrefix?: string;
  variant: LegalVariant;
};

export const LegalArticle = (props: LegalArticleProps) => <LegalArticleView {...useLegalArticleState(props)} />;
