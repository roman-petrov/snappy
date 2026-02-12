import { useRegisterState } from "./Register.state";
import { RegisterView } from "./Register.view";

export const Register = () => <RegisterView {...useRegisterState()} />;
