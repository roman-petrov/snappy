import { Card, Page, PageNarrow, SystemButtons, Title } from "@snappy/ui";

import type { useAuthFormState } from "./AuthForm.state";

import styles from "./AuthForm.module.scss";

export type AuthFormViewProps = ReturnType<typeof useAuthFormState>;

export const AuthFormView = ({ children, lead, submit, title }: AuthFormViewProps) => (
  <Page trailing={<SystemButtons />}>
    <PageNarrow>
      <Card cn={styles.panelCard}>
        <Title as="h1" lead={lead} level={2} title={title} />
        <form className={styles.panelForm} onSubmit={submit}>
          {children}
        </form>
      </Card>
    </PageNarrow>
  </Page>
);
