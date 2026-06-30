import { NewPasswordInput, PasswordInput } from "@snappy/ui";

import type { useResetPasswordState } from "./ResetPassword.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, AuthSubmitActions, MessageWithLink } from "./components";

export type ResetPasswordViewProps = ReturnType<typeof useResetPasswordState>;

export const ResetPasswordView = ({
  confirmPassword,
  error,
  loading,
  password,
  screen,
  setConfirmPassword,
  setPassword,
  submit,
  submitDisabled,
}: ResetPasswordViewProps) => (
  <AuthForm submit={submit} title={t(`auth.resetPassword.title`)}>
    {screen === `form` ? (
      <>
        <NewPasswordInput
          disabled={loading}
          label={t(`auth.resetPassword.passwordLabel`)}
          onChange={setPassword}
          value={password}
        />
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          label={t(`auth.resetPassword.confirmPasswordLabel`)}
          onChange={setConfirmPassword}
          value={confirmPassword}
        />
        <AuthSubmitActions
          disabled={submitDisabled}
          error={error === undefined ? `` : t(`auth.resetPassword.errors.${error}`)}
          loading={loading}
          submit={t(`auth.resetPassword.submit`)}
          submitting={t(`auth.resetPassword.submitting`)}
        />
      </>
    ) : (
      <MessageWithLink
        lead={screen === `invalid` ? t(`auth.resetPassword.invalidLinkLead`) : t(`auth.resetPassword.doneLead`)}
        linkText={screen === `invalid` ? t(`auth.resetPassword.requestAgain`) : t(`auth.signIn.title`)}
        linkTo={screen === `invalid` ? Routes.auth.forgotPassword : Routes.auth.signIn}
        title={screen === `invalid` ? t(`auth.resetPassword.invalidLink`) : t(`auth.resetPassword.done`)}
      />
    )}
  </AuthForm>
);
