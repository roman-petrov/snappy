import { Button, Input } from "@snappy/ui";

import type { useForgotPasswordState } from "./ForgotPassword.state";

import { t } from "../../core";
import { AuthForm } from "./AuthForm";
import { FormErrorAndActions, MessageWithLink } from "./components";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordState>;

export const ForgotPasswordView = ({ email, error, loading, screen, setEmail, submit }: ForgotPasswordViewProps) => (
  <AuthForm lead={t(`forgotPage.lead`)} submit={submit} title={t(`forgotPage.title`)}>
    {screen === `sent` ? (
      <MessageWithLink
        lead={t(`forgotPage.checkEmailLead`)}
        linkText={t(`forgotPage.backToLogin`)}
        linkTo="/login"
        title={t(`forgotPage.checkEmail`)}
      />
    ) : (
      <>
        <Input
          autoComplete="email"
          label={t(`forgotPage.email`)}
          onChange={setEmail}
          required
          type="email"
          value={email}
        />
        <FormErrorAndActions error={error}>
          <Button
            disabled={loading}
            submit
            text={loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`)}
            type="primary"
          />
          <Button link="/login" text={t(`loginPage.login`)} />
        </FormErrorAndActions>
      </>
    )}
  </AuthForm>
);
