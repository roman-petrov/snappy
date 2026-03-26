import { useTextAreaState } from "./TextArea.state";
import { TextAreaView } from "./TextArea.view";

export type TextAreaProps = {
  disabled?: boolean;
  maxLines: number;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export const TextArea = (props: TextAreaProps) => <TextAreaView {...useTextAreaState(props)} />;
