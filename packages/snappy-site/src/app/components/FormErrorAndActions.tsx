import type { ReactNode } from "react";

import styles from "./FormErrorAndActions.module.css";

export type FormErrorAndActionsProps = {
  children: ReactNode;
  error: string;
};

export const FormErrorAndActions = ({ children, error }: FormErrorAndActionsProps) => (
  <>
    {error !== `` && <p className={styles.error}>{error}</p>}
    <div className={styles.actions}>{children}</div>
  </>
);

export type FormActionsProps = { children: ReactNode };

export const FormActions = ({ children }: FormActionsProps) => (
  <div className={styles.actions}>{children}</div>
);
