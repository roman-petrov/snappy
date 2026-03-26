import type { SnappyOptions } from "@snappy/domain";

import { useTextComposerState } from "./TextComposer.state";
import { TextComposerView } from "./TextComposer.view";

export type TextComposerProps = {
  loading: boolean;
  onSubmit: () => void;
  onTextChange: (value: string) => void;
  options: SnappyOptions;
  placeholder: string;
  setOptions: (value: SnappyOptions) => void;
  showResult: boolean;
  submitAriaLabel: string;
  submitBusyAriaLabel: string;
  text: string;
};

export const TextComposer = (props: TextComposerProps) => <TextComposerView {...useTextComposerState(props)} />;
