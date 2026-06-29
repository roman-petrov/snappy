import { useEmailVerifiedState } from "./EmailVerified.state";
import { EmailVerifiedView } from "./EmailVerified.view";

export const EmailVerified = () => <EmailVerifiedView {...useEmailVerifiedState()} />;
