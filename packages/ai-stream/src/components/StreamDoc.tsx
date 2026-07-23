import type { TypeWriterSpeed } from "@snappy/domain";

import { memo } from "react";

import { type AnnotatedDocument, Stream, type Theme } from "../core";
import { StreamTop } from "./StreamTop";

export type StreamDocProps = {
  doc: AnnotatedDocument;
  playIndex: number;
  pushTailHtml?: (html: string) => void;
  streaming: boolean;
  tailHost?: (host: HTMLDivElement | null) => void;
  theme: Theme;
  typeWriterSpeed?: TypeWriterSpeed;
};

const StreamDocView = ({ doc, playIndex, pushTailHtml, streaming, tailHost, theme, typeWriterSpeed }: StreamDocProps) =>
  doc.map(piece => (
    <StreamTop
      key={Stream.topFirstIndex(piece)}
      piece={piece}
      playIndex={playIndex}
      pushTailHtml={pushTailHtml}
      streaming={streaming}
      tailHost={tailHost}
      theme={theme}
      typeWriterSpeed={typeWriterSpeed}
    />
  ));

export const StreamDoc = memo(StreamDocView);
