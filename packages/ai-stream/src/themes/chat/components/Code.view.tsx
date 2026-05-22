import { IconButton } from "@snappy/ui";

import type { useCodeState } from "./Code.state";

import { StreamHtml } from "../../../components";
import { Block } from "./Block";
import styles from "./Code.module.scss";

export type CodeViewState = ReturnType<typeof useCodeState>;

export const CodeView = ({ closed, copy, html, tailHostRef }: CodeViewState) => (
  <Block>
    <div className={styles.root}>
      <div className={styles.scroll}>
        <div className={styles.body}>
          <StreamHtml html={html} tailHostRef={tailHostRef} />
        </div>
      </div>
      {closed ? (
        <div className={styles.copy}>
          <IconButton icon="content_copy" onClick={copy} tip="Copy" />
        </div>
      ) : undefined}
    </div>
  </Block>
);
