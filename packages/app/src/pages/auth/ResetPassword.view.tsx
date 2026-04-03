import { Button, PasswordInput } from "@snappy/ui";

import type { useResetPasswordState } from "./ResetPassword.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm } from "./AuthForm";
import { FormErrorAndActions, MessageWithLink } from "./components";

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
  <AuthForm submit={submit} title={t(`resetPage.title`)}>
    {screen === `form` ? (
      <>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          label={t(`resetPage.passwordLabel`, { min: minLength })}
          minLength={minLength}
          onChange={setPassword}
          required
          value={password}
        />
        <FormErrorAndActions error={error}>
          <Button
            disabled={loading}
            submit
            text={loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
            type="primary"
          />
        </FormErrorAndActions>
      </>
    ) : (
      <MessageWithLink
        lead={screen === `invalid` ? t(`resetPage.invalidLinkLead`) : t(`resetPage.doneLead`)}
        linkText={screen === `invalid` ? t(`resetPage.requestAgain`) : t(`loginPage.login`)}
        linkTo={screen === `invalid` ? Routes.forgotPassword : Routes.login}
        title={screen === `invalid` ? t(`resetPage.invalidLink`) : t(`resetPage.done`)}
      />
    )}
  </AuthForm>
);
