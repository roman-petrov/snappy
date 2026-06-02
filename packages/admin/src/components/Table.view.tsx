import { _ } from "@snappy/core";
import { Text } from "@snappy/ui";

import type { useTableState } from "./Table.state";

import styles from "./Table.module.scss";

export type TableViewProps = ReturnType<typeof useTableState>;

export const TableView = ({ headers, rows }: TableViewProps) => (
  <div className={styles.scroll}>
    <div className={styles.pad}>
      <table className={styles.root}>
        <thead>
          <tr>
            {headers.map(({ align, content, key }) => (
              <th className={[styles.headCell, styles[align]].join(` `)} key={key} scope="col">
                <div className={styles.cellInner}>
                  {_.isString(content) ? <Text text={content} typography="captionBold" /> : content}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ cells, id }) => (
            <tr key={id}>
              {cells.map(({ align, content, key }) => (
                <td className={[styles.cell, styles[align]].join(` `)} key={key}>
                  <div className={styles.cellInner}>{_.isString(content) ? <Text text={content} /> : content}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
