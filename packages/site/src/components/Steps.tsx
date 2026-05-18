import { _ } from "@snappy/core";
import { $, Text } from "@snappy/ui";

import styles from "./Steps.module.scss";

export type StepsProps = { items: string[] };

export const Steps = ({ items }: StepsProps) => (
  <ol className={styles.steps}>
    {items.map((item, index) => (
      <li key={item}>
        <span className={_.cn(styles.marker, $.surface(`primary`))}>
          <Text as="span" text={String(index + 1)} typography="captionBold" />
        </span>
        <Text as="span" text={item} typography="large" />
      </li>
    ))}
  </ol>
);
