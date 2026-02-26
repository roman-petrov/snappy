import { Text } from "@snappy/ui";

import styles from "./Pill.module.css";

export type PillProps = { hint: string; name: string };

export const Pill = ({ hint, name }: PillProps) => (
  <div className={styles.pill}>
    <Text as="span" cn={styles.pillLeft} color="heading" variant="captionBold">
      {name}
    </Text>
    <Text as="span" cn={styles.pillRight} color="muted" variant="largeBody">
      {hint}
    </Text>
  </div>
);
