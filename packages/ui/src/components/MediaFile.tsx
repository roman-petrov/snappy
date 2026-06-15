import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./MediaFile.module.scss";
import { Text } from "./Text";

export type MediaFileProps = { align: `grid` | `row`; cn?: string; file: File; media: ReactNode };

export const MediaFile = ({ align, cn, file, media }: MediaFileProps) => (
  <div className={_.cn(styles.root, cn)}>
    <div className={_.cn(styles.frame, styles[align])}>{media}</div>
    <div className={styles.meta}>
      <Text cn={styles.name} text={file.name} typography="captionSm" />
      <Text cn={styles.size} color="outline" text={_.byteSize(file.size)} typography="captionSm" />
    </div>
  </div>
);
