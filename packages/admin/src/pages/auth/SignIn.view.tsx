import { Alert, Button, Card, Input, Page, PageNarrow, PasswordInput, Title } from "@snappy/ui";

import type { useSignInState } from "./SignIn.state";

import { t } from "../../core";
import styles from "./SignIn.module.scss";

export type SignInViewProps = ReturnType<typeof useSignInState>;

export const SignInView = ({
  error,
  loading,
  password,
  setPassword,
  setUsername,
  signIn,
  username,
}: SignInViewProps) => (
  <Page>
    <PageNarrow>
      <Card cn={styles.card}>
        <Title as="h1" level={2} title={t(`auth.signIn.title`)} />
        <form className={styles.form} onSubmit={signIn}>
          <Input
            autoComplete="username"
            label={t(`auth.signIn.username`)}
            onChange={setUsername}
            value={username}
          />
          <PasswordInput
            autoComplete="current-password"
            disabled={loading}
            label={t(`auth.signIn.password`)}
            onChange={setPassword}
            value={password}
          />
          {error === undefined ? undefined : <Alert text={t(`auth.signIn.errors.${error}`)} type="error" />}
          <div className={styles.actions}>
            <Button
              disabled={loading}
              submit
              text={loading ? t(`auth.signIn.submitting`) : t(`auth.signIn.submit`)}
              type="primary"
            />
          </div>
        </form>
      </Card>
    </PageNarrow>
  </Page>
);
