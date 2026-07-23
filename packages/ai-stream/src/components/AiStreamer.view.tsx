import { _ } from "@snappy/core";

import type { useAiStreamerState } from "./AiStreamer.state";

import styles from "./AiStreamer.module.scss";
import { StreamDoc } from "./StreamDoc";

export type AiStreamerViewProps = ReturnType<typeof useAiStreamerState>;

export const AiStreamerView = ({
  codeHtmlByIndex,
  doc,
  playIndex,
  pushTailHtml,
  streaming,
  tailHost,
  theme,
  waitingHost,
}: AiStreamerViewProps) => (
  <div className={_.cn(theme.cn, styles.root)}>
    <StreamDoc
      codeHtmlByIndex={codeHtmlByIndex}
      doc={doc}
      playIndex={playIndex}
      pushTailHtml={pushTailHtml}
      streaming={streaming}
      tailHost={tailHost}
      theme={theme}
    />
    {waitingHost ? <div className={styles.chunk} ref={tailHost} /> : undefined}
  </div>
);
