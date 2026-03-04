import { useLoginFormState } from "./LoginForm.state";
import { LoginFormView } from "./LoginForm.view";

export const LoginForm = () => <LoginFormView {...useLoginFormState()} />;
