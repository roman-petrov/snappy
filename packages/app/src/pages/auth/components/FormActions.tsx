import type { ReactNode } from "react";

import styles from "./FormActions.module.scss";

export type FormActionsProps = { children: ReactNode };

export const FormActions = ({ children }: FormActionsProps) => <div className={styles.actions}>{children}</div>;
