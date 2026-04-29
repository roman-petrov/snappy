import { Button, PasswordInput } from "@snappy/ui";

import type { useResetPasswordState } from "./ResetPassword.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, FormErrorAndActions, MessageWithLink } from "./components";

export type ResetPasswordViewProps = ReturnType<typeof useResetPasswordState>;

export const ResetPasswordView = ({
  error,
  loading,
  minLength,
  password,
  screen,
  setPassword,
  submit,
}: ResetPasswordViewProps) => (
  <AuthForm submit={submit} title={t(`auth.resetPassword.title`)}>
    {screen === `form` ? (
      <>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          label={t(`auth.resetPassword.passwordLabel`, { min: minLength })}
          minLength={minLength}
          onChange={setPassword}
          required
          value={password}
        />
        <FormErrorAndActions error={error === undefined ? `` : t(error.key, error.params)}>
          <Button
            disabled={loading}
            submit
            text={loading ? t(`auth.resetPassword.submitting`) : t(`auth.resetPassword.submit`)}
            type="primary"
          />
        </FormErrorAndActions>
      </>
    ) : (
      <MessageWithLink
        lead={screen === `invalid` ? t(`auth.resetPassword.invalidLinkLead`) : t(`auth.resetPassword.doneLead`)}
        linkText={screen === `invalid` ? t(`auth.resetPassword.requestAgain`) : t(`auth.login.title`)}
        linkTo={screen === `invalid` ? Routes.forgotPassword : Routes.login}
        title={screen === `invalid` ? t(`auth.resetPassword.invalidLink`) : t(`auth.resetPassword.done`)}
      />
    )}
  </AuthForm>
);
