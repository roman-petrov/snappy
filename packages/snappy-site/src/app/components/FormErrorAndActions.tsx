import type { ReactNode } from "react";

import { css } from "../../../styled-system/css";
import { stack } from "../../../styled-system/patterns";

export type FormErrorAndActionsProps = { children: ReactNode; error: string };

const actions = stack({ gap: "0.75rem", marginTop: "1.5rem" });

export const FormErrorAndActions = ({ children, error: errorMessage }: FormErrorAndActionsProps) => (
  <>
    {errorMessage !== "" && (
      <p
        className={css({
          bg: "rgb(var(--rgb-accent-red) / 10%)",
          borderRadius: "sm",
          color: "accentRed",
          fontSize: "sm",
          marginTop: "0.5rem",
          padding: "0.75rem",
        })}
      >
        {errorMessage}
      </p>
    )}
    <div className={actions}>{children}</div>
  </>
);

export type FormActionsProps = { children: ReactNode };

export const FormActions = ({ children }: FormActionsProps) => <div className={actions}>{children}</div>;
