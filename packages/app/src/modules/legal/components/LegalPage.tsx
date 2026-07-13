import { LegalArticle, type LegalArticleProps, LegalTitle, Page } from "@snappy/ui";

export type LegalPageProps = Pick<LegalArticleProps, `variant`>;

export const LegalPage = ({ variant }: LegalPageProps) => (
  <Page back title={<LegalTitle as="span" typography="h3" variant={variant} />}>
    <LegalArticle variant={variant} />
  </Page>
);
