import { _ } from "@snappy/core";

import type { useTextInputState } from "./TextInput.state";

import { $ } from "../$";
import { t } from "../locales";
import { IconButton } from "./IconButton";
import { TextArea } from "./TextArea";
import styles from "./TextInput.module.scss";

export type TextInputViewProps = ReturnType<typeof useTextInputState>;

export const TextInputView = ({
  afterMic,
  glass,
  listening,
  micButton,
  speechSupported,
  textArea,
  wrapFocused,
}: TextInputViewProps) => (
  <div className={`${styles.wrap} ${wrapFocused ? styles.wrapFocused : ``}`}>
    <div
      className={_.cn(
        styles.inputWrap,
        glass && styles.inputWrapGlass,
        glass && $.glass(`simple`),
        listening && styles.inputWrapRecording,
      )}
    >
      <div className={styles.textAreaWrap}>
        <TextArea {...textArea} />
      </div>
      <div className={styles.actionWrap}>
        <IconButton
          {...micButton}
          tip={
            speechSupported
              ? listening
                ? t(`textInput.voiceStop`)
                : t(`textInput.voiceStart`)
              : t(`textInput.voiceUnavailable`)
          }
        />
        {afterMic === undefined ? undefined : <IconButton {...afterMic} />}
      </div>
    </div>
  </div>
);
