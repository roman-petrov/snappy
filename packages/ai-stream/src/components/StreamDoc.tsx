import { memo } from "react";

import { type AnnotatedDocument, Stream, type Theme } from "../core";
import { StreamTop } from "./StreamTop";

export type StreamDocProps = {
  codeHtmlByIndex: ReadonlyMap<number, string>;
  doc: AnnotatedDocument;
  playIndex: number;
  pushTailHtml?: (html: string) => void;
  streaming: boolean;
  tailHost?: (host: HTMLDivElement | null) => void;
  theme: Theme;
};

const StreamDocView = ({ codeHtmlByIndex, doc, playIndex, pushTailHtml, streaming, tailHost, theme }: StreamDocProps) =>
  doc.map((piece, index) => (
    <StreamTop
      codeHtmlByIndex={codeHtmlByIndex}
      key={streaming ? index : Stream.topFirstIndex(piece)}
      piece={piece}
      playIndex={playIndex}
      pushTailHtml={pushTailHtml}
      streaming={streaming}
      tailHost={tailHost}
      theme={theme}
    />
  ));

export const StreamDoc = memo(StreamDocView);
