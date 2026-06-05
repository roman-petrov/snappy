import type { ReactNode } from "react";

import { Alert } from "@snappy/ui";

import { FormActions } from "./FormActions";
import styles from "./FormErrorAndActions.module.scss";

export type FormErrorAndActionsProps = { children: ReactNode; error: string };

export const FormErrorAndActions = ({ children, error }: FormErrorAndActionsProps) => (
  <div className={styles.root}>
    {error === `` ? undefined : <Alert text={error} type="error" />}
    <FormActions>{children}</FormActions>
  </div>
);
