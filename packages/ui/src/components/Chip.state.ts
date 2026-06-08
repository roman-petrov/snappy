import { _ } from "@snappy/core";

import type { ChipProps } from "./Chip";

import { $ } from "../$";
import styles from "./Chip.module.scss";

export const useChipState = ({
  cn = ``,
  color,
  disabled,
  keepFocus,
  left,
  link,
  onClick,
  submit,
  text,
  tile = false,
  tip,
  ...textProps
}: ChipProps) => {
  const interactive = onClick !== undefined || link !== undefined;

  const resolvedColor = interactive
    ? color === `accent`
      ? `accent`
      : `soft`
    : [`error`, `primary`, `success`].includes(color)
      ? color
      : `soft`;

  const rootCn = _.cn(
    styles.root,
    interactive
      ? resolvedColor === `accent`
        ? _.cn(styles.accent, styles.interactive)
        : $.tap(`soft`)
      : resolvedColor === `soft`
        ? $.surface(`surface`)
        : styles[resolvedColor],
    tile && styles.tile,
    cn,
  );

  const tapProps = interactive
    ? { disabled, keepFocus, link, onClick, submit, tip, vibrate: `segmentTick` as const }
    : undefined;

  return { interactive, left, rootCn, tapProps, text, textProps };
};
