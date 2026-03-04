import { t } from "../core";
import { MessageWithLink } from "./MessageWithLink";
import { useResetPasswordFormState } from "./ResetPasswordForm.state";
import { ResetPasswordFormView } from "./ResetPasswordForm.view";

export const ResetPasswordForm = () => {
  const state = useResetPasswordFormState();

  const result =
    state.token === ``
      ? {
          lead: t(`resetPage.invalidLinkLead`),
          linkText: t(`resetPage.requestAgain`),
          linkTo: `/forgot-password` as const,
          title: t(`resetPage.invalidLink`),
        }
      : state.done
        ? {
            lead: t(`resetPage.doneLead`),
            linkText: t(`resetPage.loginLink`),
            linkTo: `/login` as const,
            title: t(`resetPage.done`),
          }
        : undefined;

  if (result !== undefined) {
    return <MessageWithLink {...result} />;
  }

  return <ResetPasswordFormView {...state} />;
};
