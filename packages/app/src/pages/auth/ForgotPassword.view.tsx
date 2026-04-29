import { Button, Input } from "@snappy/ui";

import type { useForgotPasswordState } from "./ForgotPassword.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, FormErrorAndActions, MessageWithLink } from "./components";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordState>;

export const ForgotPasswordView = ({ email, error, loading, screen, setEmail, submit }: ForgotPasswordViewProps) => (
  <AuthForm lead={t(`auth.forgotPassword.lead`)} submit={submit} title={t(`auth.forgotPassword.title`)}>
    {screen === `sent` ? (
      <MessageWithLink
        lead={t(`auth.forgotPassword.checkEmailLead`)}
        linkText={t(`auth.forgotPassword.backToLogin`)}
        linkTo={Routes.login}
        title={t(`auth.forgotPassword.checkEmail`)}
      />
    ) : (
      <>
        <Input
          autoComplete="email"
          label={t(`auth.forgotPassword.email`)}
          onChange={setEmail}
          required
          type="email"
          value={email}
        />
        <FormErrorAndActions error={error === undefined ? `` : t(error.key, error.params)}>
          <Button
            disabled={loading}
            submit
            text={loading ? t(`auth.forgotPassword.submitting`) : t(`auth.forgotPassword.submit`)}
            type="primary"
          />
          <Button link={Routes.login} text={t(`auth.login.title`)} />
        </FormErrorAndActions>
      </>
    )}
  </AuthForm>
);
