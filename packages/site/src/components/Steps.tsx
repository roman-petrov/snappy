import { Text } from "@snappy/ui";

import styles from "./Steps.module.scss";

export type StepsProps = { items: string[] };

export const Steps = ({ items }: StepsProps) => (
  <div className={styles.timeline}>
    <ol className={styles.steps}>
      {items.map(item => (
        <li key={item}>
          <Text as="span" text={item} typography="largeBody" />
        </li>
      ))}
    </ol>
  </div>
);
