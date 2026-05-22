import type { TableViewProps } from "../../../core/Types";

import { Block } from "./Block";
import styles from "./Table.module.scss";

export const Table = ({ rows }: TableViewProps) => (
  <Block>
    <div className={styles.pad}>
      <table>
        <tbody children={rows} />
      </table>
    </div>
  </Block>
);
