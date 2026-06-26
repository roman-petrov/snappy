import { Card, Text } from "@snappy/ui";

import styles from "./Pill.module.scss";

export type PillProps = { hint: string; name: string };

export const Pill = ({ hint, name }: PillProps) => (
  <Card cn={styles.pill} elevation="e1">
    <Text color="primary" text={name} typography="captionBold" />
    <Text text={hint} typography="large" />
  </Card>
);
