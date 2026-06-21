import { useObjectUrl } from "@snappy/hooks";

import type { ImageFileProps } from "./ImageFile";

export const useImageFileState = ({ cn, file }: ImageFileProps) => ({ cn, file, src: useObjectUrl(file) });
