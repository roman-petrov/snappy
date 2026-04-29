import { useEffect, useState } from "react";

import type { StatusTextProps } from "./StatusText";

export type StatusTextState = { status: `done` | `error` | `running`; text: string };

export const useStatusTextState = ({ finished, text, ...textProps }: StatusTextProps) => {
  const [state, setState] = useState<StatusTextState>({ status: `running`, text });

  useEffect(() => {
    let mounted = true;
    void finished
      .then(({ label }) => {
        if (!mounted) {
          return;
        }
        setState({ status: `done`, text: label });

        return label;
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

  return {
    icon: state.status === `running` ? undefined : state.status === `error` ? `❌` : `✅`,
    isRunning: state.status === `running`,
    message: state.text,
    textProps,
  };
};
