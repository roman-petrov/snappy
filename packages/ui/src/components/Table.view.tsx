import { _ } from "@snappy/core";

import type { useTableState } from "./Table.state";

import styles from "./Table.module.scss";
import { Text } from "./Text";

export type TableViewProps = ReturnType<typeof useTableState>;

export const TableView = ({ headers, kind, rows, slots }: TableViewProps) => (
  <div className={styles.scroll}>
    <table className={styles.root}>
      {kind === `data` ? (
        <>
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
        </>
      ) : (
        <tbody children={slots} />
      )}
    </table>
  </div>
);
