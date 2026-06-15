import { useRef, useState } from "react";

import type { AudioFileProps } from "./AudioFile";

import { useObjectUrl } from "../hooks/useObjectUrl";

export const useAudioFileState = ({ cn, file }: AudioFileProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const src = useObjectUrl(file);

  const toggle = () => {
    const audio = audioRef.current;
    if (audio === null) {
      return;
    }
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);

      return;
    }
    void audio.play();
    setPlaying(true);
  };

  const onEnded = () => setPlaying(false);

  return { audioRef, cn, file, onEnded, playing, src, toggle };
};
