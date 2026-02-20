import { Text } from "@snappy/ui";

import styles from "./Pill.module.css";

export type PillProps = { hint: string; name: string };

export const Pill = ({ hint, name }: PillProps) => (
  <div className={styles.pill}>
    <Text as="span" cn={styles.pillLeft} variant="captionBold">
      {name}
    </Text>
    <Text as="span" cn={styles.pillRight} variant="largeBody">
      {hint}
    </Text>
  </div>
);
