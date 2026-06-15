import { useImageFileState } from "./ImageFile.state";
import { ImageFileView } from "./ImageFile.view";

export type ImageFileProps = { cn?: string; file: File };

export const ImageFile = (props: ImageFileProps) => <ImageFileView {...useImageFileState(props)} />;
