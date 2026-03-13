import type { ReactNode } from "react";

import { type FieldControlClasses, useFieldState } from "./Field.state";
import { FieldView } from "./Field.view";

export type { FieldControlClasses } from "./Field.state";

export type FieldProps = (
  | { children: ReactNode; renderControl?: never }
  | { children?: never; renderControl: (classes: FieldControlClasses) => ReactNode }
) & { id: string; label?: string; value?: string };

export const Field = (props: FieldProps) => <FieldView {...useFieldState(props)} />;
