import { _ } from "@snappy/core";

import type { useAiStreamerState } from "./AiStreamer.state";

import styles from "./AiStreamer.module.scss";
import { StreamDoc } from "./StreamDoc";

export type AiStreamerViewProps = ReturnType<typeof useAiStreamerState>;

export const AiStreamerView = ({
  liveDoc,
  playIndex,
  pushTailHtml,
  sealedDoc,
  streaming,
  tailHost,
  theme,
  typeWriterSpeed,
  waitingHost,
}: AiStreamerViewProps) => (
  <div className={_.cn(theme.cn, styles.root)}>
    <StreamDoc doc={sealedDoc} playIndex={0} streaming={false} theme={theme} />
    <StreamDoc
      doc={liveDoc}
      playIndex={playIndex}
      pushTailHtml={pushTailHtml}
      streaming={streaming}
      tailHost={tailHost}
      theme={theme}
      typeWriterSpeed={typeWriterSpeed}
    />
    {waitingHost ? <div className={styles.chunk} ref={tailHost} /> : undefined}
  </div>
);
