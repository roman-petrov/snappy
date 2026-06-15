import { useAudioFileState } from "./AudioFile.state";
import { AudioFileView } from "./AudioFile.view";

export type AudioFileProps = { cn?: string; file: File };

export const AudioFile = (props: AudioFileProps) => <AudioFileView {...useAudioFileState(props)} />;
