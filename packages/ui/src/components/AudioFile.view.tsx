import { _ } from "@snappy/core";
import { Play, Square } from "lucide-react";

import type { useAudioFileState } from "./AudioFile.state";

import { $ } from "../$";
import { t } from "../locales";
import styles from "./AudioFile.module.scss";
import { IconButton } from "./IconButton";
import { MediaFile } from "./MediaFile";

export type AudioFileViewProps = ReturnType<typeof useAudioFileState>;

export const AudioFileView = ({ audioRef, cn, file, onEnded, playing, src, toggle }: AudioFileViewProps) => (
  <>
    <MediaFile
      align="grid"
      cn={cn}
      file={file}
      media={
        <div className={_.cn(styles.play, $.surface(`primary`))}>
          <IconButton
            icon={playing ? Square : Play}
            onClick={toggle}
            tip={playing ? t(`audio.stop`) : t(`audio.play`)}
          />
        </div>
      }
    />
    {src === `` ? undefined : <audio className={styles.hidden} onEnded={onEnded} ref={audioRef} src={src} />}
  </>
);
