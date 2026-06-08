import { Table as UiTable } from "@snappy/ui";

import type { TableViewProps } from "../../../core/Types";

import { Block } from "./Block";

export const Table = ({ rows }: TableViewProps) => (
  <Block>
    <UiTable slots={rows} />
  </Block>
);
