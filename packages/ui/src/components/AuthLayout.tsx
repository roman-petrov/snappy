import type { ReadonlyStore } from "@snappy/core";
import type { ReactNode } from "react";

import { useAuthLayoutState } from "./AuthLayout.state";
import { AuthLayoutView } from "./AuthLayout.view";

export type AuthLayoutProps = {
  children?: ReactNode;
  publicPaths: readonly string[];
  signedIn: ReadonlyStore<boolean>;
  signInPath: string;
};

export const AuthLayout = (props: AuthLayoutProps) => <AuthLayoutView {...useAuthLayoutState(props)} />;
