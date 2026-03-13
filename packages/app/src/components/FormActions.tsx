import type { ReactNode } from "react";

import styles from "./FormErrorAndActions.module.scss";

export type FormActionsProps = { children: ReactNode };

export const FormActions = ({ children }: FormActionsProps) => <div className={styles.actions}>{children}</div>;
