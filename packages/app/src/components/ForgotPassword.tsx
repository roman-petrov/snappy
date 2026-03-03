import { useForgotPasswordState } from "./ForgotPassword.state";
import { ForgotPasswordView } from "./ForgotPassword.view";

export const ForgotPassword = () => <ForgotPasswordView {...useForgotPasswordState()} />;
