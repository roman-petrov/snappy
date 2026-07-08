import type { Vibrate } from "@snappy/platform";

import type { Color, Surface } from "../$";
import type { Icon } from "./Icon";
import type { TextAreaProps } from "./TextArea";

import { useTextInputState } from "./TextInput.state";
import { TextInputView } from "./TextInput.view";

export type TextInputAfterMic = {
  color?: Color;
  disabled?: boolean;
  icon: Icon;
  onClick: () => void;
  tip: string;
  vibrate?: Vibrate;
};

export type TextInputProps = Omit<TextAreaProps, `maxLines`> & {
  afterMic?: TextInputAfterMic;
  maxLines?: number;
  micTag?: string;
  surface?: TextInputSurface;
};

export type TextInputSurface = Extract<Surface, `surface` | `surfaceGlass`>;

export const TextInput = (props: TextInputProps) => <TextInputView {...useTextInputState(props)} />;
