import { useResetPasswordFormState } from "./ResetPasswordForm.state";
import { ResetPasswordFormView } from "./ResetPasswordForm.view";

export const ResetPasswordForm = () => <ResetPasswordFormView {...useResetPasswordFormState()} />;
