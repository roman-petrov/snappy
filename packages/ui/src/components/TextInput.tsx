import type { TextAreaProps } from "./TextArea";

import { useTextInputState } from "./TextInput.state";
import { TextInputView } from "./TextInput.view";

export type TextInputProps = Omit<TextAreaProps, `maxLines`> & { maxLines?: number };

export const TextInput = (props: TextInputProps) => <TextInputView {...useTextInputState(props)} />;
