import { LegalArticle } from "@snappy/legal";
import { Text } from "@snappy/ui";

import type { useLegalPageState } from "./LegalPage.state";

import styles from "./LegalPage.module.scss";
import { SitePage } from "./SitePage";

export type LegalPageViewProps = ReturnType<typeof useLegalPageState>;

export const LegalPageView = ({ locale, title, variant }: LegalPageViewProps) => (
  <SitePage>
    <Text as="h1" cn={styles.title} text={title} typography="h1" />
    <LegalArticle locale={locale} variant={variant} />
  </SitePage>
);
