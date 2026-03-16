import type { ReactNode } from "react";

import { Alert } from "@snappy/ui";

import { FormActions } from "./FormActions";

export type FormErrorAndActionsProps = { children: ReactNode; error: string };

export const FormErrorAndActions = ({ children, error }: FormErrorAndActionsProps) => (
  <>
    {error === `` ? undefined : <Alert text={error} variant="error" />}
    <FormActions>{children}</FormActions>
  </>
);
