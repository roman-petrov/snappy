import { t } from "../core";
import { useForgotPasswordFormState } from "./ForgotPasswordForm.state";
import { ForgotPasswordFormView } from "./ForgotPasswordForm.view";
import { MessageWithLink } from "./MessageWithLink";

export const ForgotPasswordForm = () => {
  const state = useForgotPasswordFormState();

  if (state.sent) {
    return (
      <MessageWithLink
        lead={t(`forgotPage.checkEmailLead`)}
        linkText={t(`forgotPage.backToLogin`)}
        linkTo="/login"
        title={t(`forgotPage.checkEmail`)}
      />
    );
  }

  return <ForgotPasswordFormView {...state} />;
};
