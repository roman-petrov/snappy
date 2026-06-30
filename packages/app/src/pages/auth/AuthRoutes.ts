import { EmailVerified } from "./EmailVerified";
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

export const AuthRoutes = {
  emailVerified: { page: EmailVerified, path: `email-verified` },
  forgotPassword: { page: ForgotPassword, path: `forgot-password` },
  resetPassword: { page: ResetPassword, path: `reset-password` },
  signIn: { page: SignIn, path: `login` },
  signUp: { page: SignUp, path: `register` },
} as const;
