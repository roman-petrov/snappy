import { type Color, Icon, Text } from "@snappy/ui";

import styles from "./Pills.module.scss";

export type Pill = { color: Color; icon: Icon; label: string };

export type PillsProps = { items: Pill[] };

export const Pills = ({ items }: PillsProps) => (
  <ul className={styles.pills}>
    {items.map(({ color, icon, label }) => (
      <li className={styles.pill} key={label}>
        <Icon color={color} icon={icon} size="sm" />
        <Text text={label} typography="bodyBold" />
      </li>
    ))}
  </ul>
);
