import { useResetPasswordState } from "./ResetPassword.state";
import { ResetPasswordView } from "./ResetPassword.view";

export const ResetPassword = () => <ResetPasswordView {...useResetPasswordState()} />;
