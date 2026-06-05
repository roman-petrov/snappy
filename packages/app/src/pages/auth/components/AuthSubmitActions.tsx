import type { ReactNode } from "react";

import { Button } from "@snappy/ui";

import { FormErrorAndActions } from "../../../components";

export type AuthSubmitActionsProps = {
  children?: ReactNode;
  disabled: boolean;
  error: string;
  loading: boolean;
  submit: string;
  submitting: string;
};

export const AuthSubmitActions = ({
  children,
  disabled,
  error,
  loading,
  submit,
  submitting,
}: AuthSubmitActionsProps) => (
  <FormErrorAndActions error={error}>
    <Button disabled={disabled} submit text={loading ? submitting : submit} type="primary" />
    {children}
  </FormErrorAndActions>
);
