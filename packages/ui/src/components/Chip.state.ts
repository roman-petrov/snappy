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
  tip,
  ...textProps
}: ChipProps) => {
  const interactive = onClick !== undefined || link !== undefined;

  const colorCn = interactive
    ? $.tap(color === `soft` || color === `accent` || color === `menu` || color === `icon` ? color : `soft`)
    : $.surface(
        color === `primary` ||
          color === `error` ||
          color === `info` ||
          color === `success` ||
          color === `warning` ||
          color === `surface`
          ? color
          : `surface`,
      );

  const rootCn = _.cn(styles.root, colorCn, $.elevation(`e2`), cn);

  const tapProps = interactive
    ? { disabled, keepFocus, link, onClick, submit, tip, vibrate: `segmentTick` as const }
    : undefined;

  return { interactive, left, rootCn, tapProps, text, textProps };
};
