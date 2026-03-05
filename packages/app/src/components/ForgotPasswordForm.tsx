import { useForgotPasswordFormState } from "./ForgotPasswordForm.state";
import { ForgotPasswordFormView } from "./ForgotPasswordForm.view";

export const ForgotPasswordForm = () => <ForgotPasswordFormView {...useForgotPasswordFormState()} />;
