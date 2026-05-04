import { useEffect, useState } from "react";

import type { StatusTextProps } from "./StatusText";

export type StatusTextState = { status: `done` | `error` | `running`; text: string };

export const useStatusTextState = ({ finished, text, ...textProps }: StatusTextProps) => {
  const [state, setState] = useState<StatusTextState>({ status: `running`, text });

  useEffect(() => {
    let mounted = true;

    void finished
      .then(() => {
        if (!mounted) {
          return undefined;
        }

        setState({ status: `done`, text: `` });

        return undefined;
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setState(current => ({ ...current, status: `error` }));
      });

    return () => {
      mounted = false;
    };
  }, [finished]);

  return { message: state.text, status: state.status, textProps };
};
