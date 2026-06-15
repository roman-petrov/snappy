import { AudioFile } from "./AudioFile";
import { FileSelect, type FileSelectProps } from "./FileSelect";

export type AudioSelectProps = Omit<FileSelectProps, `accept` | `fileName` | `multiple`> & { value?: File };

export const AudioSelect = ({ value, ...rest }: AudioSelectProps) => (
  <FileSelect {...rest} accept={[`audio/*,.mp3,.m4a,.wav,.webm,.ogg,.flac`]} multiple={false}>
    {value === undefined ? undefined : <AudioFile file={value} />}
  </FileSelect>
);
