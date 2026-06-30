import { useSignUpState } from "./SignUp.state";
import { SignUpView } from "./SignUp.view";

export const SignUp = () => <SignUpView {...useSignUpState()} />;
