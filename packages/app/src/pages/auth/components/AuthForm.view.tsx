import { Card, type CardProps, Page, PageNarrow, Title } from "@snappy/ui";

import type { useAuthFormState } from "./AuthForm.state";

import { HeaderContent } from "../../../components";
import styles from "./AuthForm.module.scss";

export type AuthFormViewProps = ReturnType<typeof useAuthFormState> & { card?: Omit<CardProps, `children` | `cn`> };

export const AuthFormView = ({ card, children, lead, submit, title }: AuthFormViewProps) => (
  <Page trailing={<HeaderContent />}>
    <PageNarrow>
      <Card {...card} cn={styles.panelCard}>
        <Title as="h1" lead={lead} level={2} title={title} />
        <form className={styles.panelForm} onSubmit={submit}>
          {children}
        </form>
      </Card>
    </PageNarrow>
  </Page>
);
