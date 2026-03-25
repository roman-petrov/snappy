import { useTextComposerState } from "./TextComposer.state";
import { TextComposerView } from "./TextComposer.view";

export type TextComposerProps = {
  loading: boolean;
  onSubmit: () => void;
  onTextChange: (value: string) => void;
  placeholder: string;
  showResult: boolean;
  submitAriaLabel: string;
  submitBusyAriaLabel: string;
  text: string;
};

export const TextComposer = (props: TextComposerProps) => <TextComposerView {...useTextComposerState(props)} />;
