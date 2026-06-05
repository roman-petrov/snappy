import { Button, NewPasswordInput, PasswordInput } from "@snappy/ui";

import type { useResetPasswordState } from "./ResetPassword.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, FormErrorAndActions, MessageWithLink } from "./components";

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
          required
          value={password}
        />
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          label={t(`auth.resetPassword.confirmPasswordLabel`)}
          onChange={setConfirmPassword}
          required
          value={confirmPassword}
        />
        <FormErrorAndActions error={error === undefined ? `` : t(`auth.resetPassword.errors.${error}`)}>
          <Button
            disabled={submitDisabled}
            submit
            text={loading ? t(`auth.resetPassword.submitting`) : t(`auth.resetPassword.submit`)}
            type="primary"
          />
        </FormErrorAndActions>
      </>
    ) : (
      <MessageWithLink
        lead={screen === `invalid` ? t(`auth.resetPassword.invalidLinkLead`) : t(`auth.resetPassword.doneLead`)}
        linkText={screen === `invalid` ? t(`auth.resetPassword.requestAgain`) : t(`auth.signIn.title`)}
        linkTo={screen === `invalid` ? Routes.forgotPassword : Routes.signIn}
        title={screen === `invalid` ? t(`auth.resetPassword.invalidLink`) : t(`auth.resetPassword.done`)}
      />
    )}
  </AuthForm>
);
