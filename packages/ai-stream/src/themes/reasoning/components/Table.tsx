import type { TableViewProps } from "../../../core/Types";

export const Table = ({ rows }: TableViewProps) => (
  <table>
    <tbody children={rows} />
  </table>
);
