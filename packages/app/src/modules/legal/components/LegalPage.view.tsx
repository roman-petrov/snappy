import { LegalArticle } from "@snappy/legal";
import { Page, Text } from "@snappy/ui";

import type { useLegalPageState } from "./LegalPage.state";

export type LegalPageViewProps = ReturnType<typeof useLegalPageState>;

export const LegalPageView = ({ locale, onNavigate, pathPrefix, title, variant }: LegalPageViewProps) => (
  <Page back title={<Text as="span" text={title} typography="h3" />}>
    <LegalArticle locale={locale} onNavigate={onNavigate} pathPrefix={pathPrefix} variant={variant} />
  </Page>
);
