import { Card, type CardProps, Title } from "@snappy/ui";

import type { useAuthFormState } from "./AuthForm.state";

import styles from "./AuthForm.module.scss";

export type AuthFormViewProps = ReturnType<typeof useAuthFormState> & { card?: Omit<CardProps, `children` | `cn`> };

export const AuthFormView = ({ card, children, lead, mobile, submit, title }: AuthFormViewProps) =>
  mobile ? (
    <div className={styles.wrap}>
      <Title cn={styles.title} level={1} title={title} />
      <form className={styles.mobileForm} onSubmit={submit}>
        {children}
      </form>
    </div>
  ) : (
    <div className={styles.panelPage}>
      <Card {...card} cn={styles.panelCard}>
        <Title as="h1" lead={lead} level={2} title={title} />
        <form className={styles.panelForm} onSubmit={submit}>
          {children}
        </form>
      </Card>
    </div>
  );
