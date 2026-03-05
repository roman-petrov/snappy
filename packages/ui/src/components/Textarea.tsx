import { useTextareaState } from "./Textarea.state";
import { TextareaView } from "./Textarea.view";

export type TextareaProps = {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export const Textarea = (props: TextareaProps) => <TextareaView {...useTextareaState(props)} />;
