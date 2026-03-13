import type { ReactNode } from "react";

import { useFormErrorAndActionsState } from "./FormErrorAndActions.state";
import { FormErrorAndActionsView } from "./FormErrorAndActions.view";

export type FormErrorAndActionsProps = { children: ReactNode; error: string };

export const FormErrorAndActions = (props: FormErrorAndActionsProps) => (
  <FormErrorAndActionsView {...useFormErrorAndActionsState(props)} />
);
