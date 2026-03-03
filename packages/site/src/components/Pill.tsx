import { Text } from "@snappy/ui";

import styles from "./Pill.module.scss";

export type PillProps = { hint: string; name: string };

export const Pill = ({ hint, name }: PillProps) => (
  <div className={styles.pill}>
    <Text as="span" cn={styles.pillLeft} color="heading" text={name} typography="captionBold" />
    <Text as="span" cn={styles.pillRight} color="muted" text={hint} typography="largeBody" />
  </div>
);
