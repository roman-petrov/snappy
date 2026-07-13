import { LegalArticle, type LegalArticleProps, LegalTitle } from "@snappy/ui";

import styles from "./LegalPage.module.scss";

export type LegalPageProps = Pick<LegalArticleProps, `variant`>;

export const LegalPage = ({ variant }: LegalPageProps) => (
  <>
    <LegalTitle cn={styles.title} variant={variant} />
    <LegalArticle cn={styles.content} variant={variant} />
  </>
);
