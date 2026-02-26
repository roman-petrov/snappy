import { Text } from "@snappy/ui";

import styles from "./Steps.module.css";

export type StepsProps = { items: string[] };

export const Steps = ({ items }: StepsProps) => (
  <div className={styles.timeline}>
    <ol className={styles.steps}>
      {items.map(text => (
        <li>
          <Text as="span" color="body" variant="largeBody">
            {text}
          </Text>
        </li>
      ))}
    </ol>
  </div>
);
