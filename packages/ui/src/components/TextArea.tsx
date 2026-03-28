import type { Ref } from "react";

import { useTextAreaState } from "./TextArea.state";
import { TextAreaView } from "./TextArea.view";

export type TextAreaProps = {
  ariaBusy?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
  maxLines: number;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder: string;
  readOnly?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
  value: string;
};

export const TextArea = (props: TextAreaProps) => <TextAreaView {...useTextAreaState(props)} />;
