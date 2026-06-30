import { TextInput, type TextInputProps } from "@snappy/ui";
import { Send } from "lucide-react";

import { t } from "../../../../core";

export type ComposerProps = Omit<TextInputProps, `afterMic` | `placeholder`> & { onSend: () => void };

export const Composer = ({ onSend, value, ...rest }: ComposerProps) => (
  <TextInput
    {...rest}
    afterMic={{ disabled: value.trim() === ``, icon: Send, onClick: onSend, tip: t(`snappy.composer.send`) }}
    placeholder={t(`snappy.composer.placeholder`)}
    surface="surfaceGlass"
    value={value}
  />
);
