import { _ } from "@snappy/core";

import styles from "./Link.module.scss";
import { Tap, type TapProps } from "./Tap";
import { Text } from "./Text";

export type LinkProps = Omit<TapProps, `children` | `cn`> & { cn?: string; muted?: boolean; text: string };

export const Link = ({ cn = ``, muted = false, text, ...tapProps }: LinkProps) => (
  <Tap {...tapProps} cn={_.cn(muted ? styles.muted : styles.accent, cn)}>
    <Text color={muted ? undefined : `primary`} text={text} typography="caption" />
  </Tap>
);
