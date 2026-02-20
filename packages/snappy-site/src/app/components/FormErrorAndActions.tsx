import type { ReactNode } from "react";

import { Error } from "@snappy/ui";

import styles from "./FormErrorAndActions.module.css";

export type FormErrorAndActionsProps = { children: ReactNode; error: string };

export const FormErrorAndActions = ({ children, error }: FormErrorAndActionsProps) => (
  <>
    {error !== `` && <Error>{error}</Error>}
    <div className={styles.actions}>{children}</div>
  </>
);

export type FormActionsProps = { children: ReactNode };

export const FormActions = ({ children }: FormActionsProps) => <div className={styles.actions}>{children}</div>;
