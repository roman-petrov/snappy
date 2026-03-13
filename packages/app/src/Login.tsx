import { useLoginState } from "./Login.state";
import { LoginView } from "./Login.view";

export const Login = () => <LoginView {...useLoginState()} />;
