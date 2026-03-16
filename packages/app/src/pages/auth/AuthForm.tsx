import type { ReactNode } from "react";

import { useAuthFormState } from "./AuthForm.state";
import { AuthFormView } from "./AuthForm.view";

export type AuthFormProps = { children: ReactNode; lead?: string; submit: () => void; title: string };

export const AuthForm = (props: AuthFormProps) => <AuthFormView {...useAuthFormState(props)} />;
