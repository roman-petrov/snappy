import { TextInput, type TextInputProps } from "@snappy/ui";
import { Send } from "lucide-react";

import { AppTags } from "../../../AppTags";
import { t } from "../../../core";

export type ComposerProps = Omit<TextInputProps, `afterMic` | `glass` | `placeholder`> & { onSend: () => void };

export const Composer = ({ onSend, value, ...rest }: ComposerProps) => (
  <TextInput
    {...rest}
    afterMic={{ disabled: value.trim() === ``, icon: Send, onClick: onSend, tip: t(`snappy.composer.send`) }}
    glass
    micTag={AppTags.snappy.voice.toggle}
    placeholder={t(`snappy.composer.placeholder`)}
    value={value}
  />
);
