import { Card, type Color, type Icon, Text } from "@snappy/ui";

import { IconBadge } from "./IconBadge";
import styles from "./Tile.module.scss";

export type TileProps = { color: Color; description: string; icon: Icon; title: string };

export const Tile = ({ color, description, icon, title }: TileProps) => (
  <Card cn={styles.tile} elevation="e1" radius="lg">
    <IconBadge color={color} icon={icon} />
    <Text as="h3" text={title} typography="h3" />
    <Text as="p" cn={styles.desc} text={description} typography="body" />
  </Card>
);
