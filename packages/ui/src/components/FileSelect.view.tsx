import type { useFileSelectState } from "./FileSelect.state";

import { Button } from "./Button";
import styles from "./FileSelect.module.scss";

export type FileSelectViewProps = ReturnType<typeof useFileSelectState>;

export const FileSelectView = ({ disabled, fileName, hint, pick, pickLabel }: FileSelectViewProps) => (
  <div className={styles.root}>
    <Button disabled={disabled} onClick={pick} text={pickLabel} />
    {hint === undefined || hint === `` ? undefined : <span className={styles.hint}>{hint}</span>}
    {fileName === undefined || fileName === `` ? undefined : <span className={styles.fileName}>{fileName}</span>}
  </div>
);
