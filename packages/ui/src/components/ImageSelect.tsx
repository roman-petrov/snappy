import { FileSelect, type FileSelectProps } from "./FileSelect";
import { ImageFile } from "./ImageFile";

export type ImageSelectProps = Omit<FileSelectProps, `accept` | `fileName` | `multiple`> & { value?: File };

export const ImageSelect = ({ value, ...rest }: ImageSelectProps) => (
  <FileSelect {...rest} accept={[`image/*,.png,.jpg,.jpeg,.webp,.gif`]} multiple={false}>
    {value === undefined ? undefined : <ImageFile file={value} />}
  </FileSelect>
);
