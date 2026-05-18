import type { useTextInputState } from "./TextInput.state";

import { t } from "../locales";
import { IconButton } from "./IconButton";
import { TextArea } from "./TextArea";
import styles from "./TextInput.module.scss";

export type TextInputViewProps = ReturnType<typeof useTextInputState>;

export const TextInputView = ({
  afterMic,
  focused,
  listening,
  maxLines,
  micDisabled,
  onChange,
  setInputBlurred,
  setInputFocused,
  speechSupported,
  textAreaRef,
  toggleRecording,
  ...textAreaProps
}: TextInputViewProps) => (
  <div className={`${styles.wrap} ${focused ? styles.wrapFocused : ``}`}>
    <div className={`${styles.inputWrap} ${listening ? styles.inputWrapRecording : ``}`}>
      <div className={styles.textAreaWrap}>
        <TextArea
          {...textAreaProps}
          collapsed={!focused}
          maxLines={maxLines}
          onBlur={setInputBlurred}
          onChange={onChange}
          onFocus={setInputFocused}
          readOnly={listening}
          ref={textAreaRef}
        />
      </div>
      <div className={styles.actionWrap}>
        <IconButton
          color={listening ? `error` : undefined}
          disabled={micDisabled}
          icon="mic"
          keepFocus
          onClick={toggleRecording}
          tip={
            speechSupported
              ? listening
                ? t(`textInput.voiceStop`)
                : t(`textInput.voiceStart`)
              : t(`textInput.voiceUnavailable`)
          }
        />
        {afterMic === undefined ? undefined : (
          <IconButton
            color={afterMic.color}
            disabled={afterMic.disabled === true}
            icon={afterMic.icon}
            keepFocus
            onClick={afterMic.onClick}
            tip={afterMic.tip}
          />
        )}
      </div>
    </div>
  </div>
);
