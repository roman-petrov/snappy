import { Table as UiTable } from "@snappy/ui";

import type { TableViewProps } from "../../../core/Types";

import { Block } from "./Block";
import styles from "./Table.module.scss";

export const Table = ({ rows }: TableViewProps) => (
  <Block cn={styles.card} radius="xs">
    <UiTable slots={rows} />
  </Block>
);
