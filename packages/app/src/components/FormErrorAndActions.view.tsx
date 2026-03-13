import { Alert } from "@snappy/ui";

import type { useFormErrorAndActionsState } from "./FormErrorAndActions.state";

import styles from "./FormErrorAndActions.module.scss";

export type FormErrorAndActionsViewProps = ReturnType<typeof useFormErrorAndActionsState>;

export const FormErrorAndActionsView = ({ children, errorText, showError }: FormErrorAndActionsViewProps) => (
  <>
    {showError ? <Alert text={errorText} variant="error" /> : undefined}
    <div className={styles.actions}>{children}</div>
  </>
);
