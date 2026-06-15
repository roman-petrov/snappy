import type { useImageFileState } from "./ImageFile.state";

import styles from "./ImageFile.module.scss";
import { MediaFile } from "./MediaFile";

export type ImageFileViewProps = ReturnType<typeof useImageFileState>;

export const ImageFileView = ({ cn, file, src }: ImageFileViewProps) =>
  src === `` ? undefined : (
    <MediaFile align="row" cn={cn} file={file} media={<img alt={file.name} className={styles.preview} src={src} />} />
  );
