import type { useLocaleSwitcherState } from "./LocaleSwitcher.state";

import { css } from "../../styled-system/css";

export type LocaleSwitcherViewProps = ReturnType<typeof useLocaleSwitcherState>;

export const LocaleSwitcherView = ({ ariaLabel, label, onClick }: LocaleSwitcherViewProps) => (
  <button
    aria-label={ariaLabel}
    className={css({
      _focusVisible: { outline: "2px solid var(--color-focus-ring)", outlineOffset: "2px" },
      _hover: { bg: "bg.elevated", borderColor: "accent", color: "text.body" },
      bg: "bg.icon",
      border: "1px solid border",
      borderRadius: "sm",
      color: "text.muted",
      cursor: "pointer",
      fontSize: "xs",
      fontWeight: "semibold",
      letterSpacing: "wide",
      padding: "2 3",
      transition: "transition",
    })}
    onClick={onClick}
    title={ariaLabel}
    type="button"
  >
    {label}
  </button>
);
