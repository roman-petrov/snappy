import { Table as UiTable } from "@snappy/ui";

import type { TableViewProps } from "../../../core/Types";

export const Table = ({ rows }: TableViewProps) => <UiTable slots={rows} />;
