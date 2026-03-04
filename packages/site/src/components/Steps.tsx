import { Text } from "@snappy/ui";

import styles from "./Steps.module.scss";

export type StepsProps = { items: string[] };

export const Steps = ({ items }: StepsProps) => (
  <ol className={styles.steps}>
    {items.map((item, i) => (
      <li key={item}>
        <span className={styles.marker}>
          <Text as="span" color="onAccent" text={String(i + 1)} typography="captionBold" />
        </span>
        <Text as="span" text={item} typography="large" />
      </li>
    ))}
  </ol>
);
