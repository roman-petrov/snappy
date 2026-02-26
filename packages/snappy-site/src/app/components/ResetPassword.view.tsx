import { Button, Panel, PasswordInput } from "@snappy/ui";

import type { useResetPasswordState } from "./ResetPassword.state";

import { Password, t } from "../core";
import { FormErrorAndActions } from "./FormErrorAndActions";
import styles from "./Login.module.css";
import { PanelWithLink } from "./PanelWithLink";

export type ResetPasswordViewProps = ReturnType<typeof useResetPasswordState>;

export const ResetPasswordView = ({
  done,
  error,
  loading,
  onPasswordChange,
  onSubmit,
  password,
  token,
}: ResetPasswordViewProps) => {
  const resultPanel =
    token === ``
      ? {
          lead: t(`resetPage.invalidLinkLead`),
          linkText: t(`resetPage.requestAgain`),
          linkTo: `/forgot-password`,
          title: t(`resetPage.invalidLink`),
        }
      : done
        ? {
            lead: t(`resetPage.doneLead`),
            linkText: t(`resetPage.loginLink`),
            linkTo: `/login`,
            title: t(`resetPage.done`),
          }
        : undefined;
  if (resultPanel !== undefined) {
    return <PanelWithLink {...resultPanel} />;
  }

  return (
    <Panel title={t(`resetPage.title`)}>
      <form className={styles.form} onSubmit={onSubmit}>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          hidePasswordLabel={t(`passwordInput.hidePassword`)}
          id="reset-password"
          label={t(`resetPage.passwordLabel`, { min: Password.minLength })}
          minLength={Password.minLength}
          onChange={onPasswordChange}
          required
          showPasswordLabel={t(`passwordInput.showPassword`)}
          value={password}
        />
        <FormErrorAndActions error={error}>
          <Button disabled={loading} primary type="submit">
            {loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
          </Button>
        </FormErrorAndActions>
      </form>
    </Panel>
  );
};
