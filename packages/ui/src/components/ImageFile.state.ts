import type { ImageFileProps } from "./ImageFile";

import { useObjectUrl } from "../hooks/useObjectUrl";

export const useImageFileState = ({ cn, file }: ImageFileProps) => ({ cn, file, src: useObjectUrl(file) });
