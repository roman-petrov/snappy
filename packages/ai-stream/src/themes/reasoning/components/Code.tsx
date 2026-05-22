import type { CodeViewProps } from "../../../core";

import { StreamHtml } from "../../../components";

export const Code = ({ piece, tailHostRef }: CodeViewProps) => (
  <StreamHtml html={piece.html} tailHostRef={tailHostRef} />
);
