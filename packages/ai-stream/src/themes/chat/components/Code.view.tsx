import { IconButton } from "@snappy/ui";
import { Copy } from "lucide-react";

import type { useCodeState } from "./Code.state";

import { StreamHtml } from "../../../components";
import { Block } from "./Block";
import styles from "./Code.module.scss";

export type CodeViewState = ReturnType<typeof useCodeState>;

export const CodeView = ({ copy, copyable, html, tailHostRef }: CodeViewState) => (
  <Block>
    <div className={styles.root}>
      <div className={styles.scroll}>
        <StreamHtml html={html} tailHostRef={tailHostRef} />
      </div>
      {copyable ? (
        <div className={styles.copy}>
          <IconButton icon={Copy} onClick={copy} tip="Copy" />
        </div>
      ) : undefined}
    </div>
  </Block>
);
