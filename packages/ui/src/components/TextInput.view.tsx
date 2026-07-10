import { _ } from "@snappy/core";

import type { useTextInputState } from "./TextInput.state";

import { $ } from "../$";
import { t } from "../locales";
import { Glass } from "./Glass";
import { IconButton } from "./IconButton";
import { TextArea } from "./TextArea";
import styles from "./TextInput.module.scss";

export type TextInputViewProps = ReturnType<typeof useTextInputState>;

export const TextInputView = ({
  afterMic,
  glass = false,
  listening,
  micButton,
  speechSupported,
  textArea,
}: TextInputViewProps) => (
  <div className={styles.wrap}>
    <div className={_.cn(styles.inputWrap, glass ? styles.glass : $.tap(`soft`), listening && styles.inputWrapRecording)}>
      {glass ? <Glass blur={20} cn={styles.glassFill} flat roughness={0.12} tint={0.28} /> : undefined}
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
