import { useSignInState } from "./SignIn.state";
import { SignInView } from "./SignIn.view";

export const SignIn = () => <SignInView {...useSignInState()} />;
