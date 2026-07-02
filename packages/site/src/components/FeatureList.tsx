import { type Color, type Icon, Text } from "@snappy/ui";

import styles from "./FeatureList.module.scss";
import { IconBadge } from "./IconBadge";

export type Feature = { color: Color; description: string; icon: Icon; title: string };

export type FeatureListProps = { items: Feature[] };

export const FeatureList = ({ items }: FeatureListProps) => (
  <ul className={styles.list}>
    {items.map(({ color, description, icon, title }) => (
      <li className={styles.item} key={title}>
        <IconBadge color={color} icon={icon} />
        <div className={styles.body}>
          <Text as="h3" text={title} typography="h3" />
          <Text cn={styles.desc} text={description} typography="body" />
        </div>
      </li>
    ))}
  </ul>
);
