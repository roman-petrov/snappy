import type { useTextInputState } from "./TextInput.state";

import { t } from "../locales";
import { IconButton } from "./IconButton";
import { TextArea } from "./TextArea";
import styles from "./TextInput.module.scss";

export type TextInputViewProps = ReturnType<typeof useTextInputState>;

export const TextInputView = ({
  afterMic,
  listening,
  micButton,
  speechSupported,
  textArea,
  wrapFocused,
}: TextInputViewProps) => (
  <div className={`${styles.wrap} ${wrapFocused ? styles.wrapFocused : ``}`}>
    <div className={`${styles.inputWrap} ${listening ? styles.inputWrapRecording : ``}`}>
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
