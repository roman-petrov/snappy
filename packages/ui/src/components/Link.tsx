import styles from "./Link.module.scss";
import { Tap, type TapProps } from "./Tap";
import { Text } from "./Text";

export type LinkProps = Omit<TapProps, `children` | `cn`> & { muted?: boolean; text: string };

export const Link = ({ muted = false, text, ...tapProps }: LinkProps) => (
  <Tap {...tapProps} cn={muted ? styles.muted : styles.accent}>
    <Text color={muted ? `muted` : `accent`} text={text} typography="caption" />
  </Tap>
);
