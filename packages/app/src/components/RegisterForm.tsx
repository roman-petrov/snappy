import { useRegisterFormState } from "./RegisterForm.state";
import { RegisterFormView } from "./RegisterForm.view";

export const RegisterForm = () => <RegisterFormView {...useRegisterFormState()} />;
