import { IconButton, TextArea } from "@snappy/ui";

import type { useTextComposerState } from "./TextComposer.state";

import { t } from "../../../core";
import { SettingsPanel } from "./settings-panel";
import styles from "./TextComposer.module.scss";

export type TextComposerViewProps = ReturnType<typeof useTextComposerState>;

export const TextComposerView = ({
  focused,
  hasDraft,
  listening,
  loading,
  maxLines,
  micDisabled,
  onTextChange,
  options,
  process,
  processLoading,
  setInputBlurred,
  setInputFocused,
  setOptions,
  settingsVisible,
  speechSupported,
  text,
  textAreaRef,
  toggleRecording,
  toggleSettings,
}: TextComposerViewProps) => (
  <div className={`${styles.wrap} ${focused ? styles.wrapFocused : ``}`}>
    <div className={`${styles.inputWrap} ${listening ? styles.inputWrapRecording : ``}`}>
      <IconButton
        disabled={loading}
        icon={settingsVisible ? `settings-hide` : `settings-show`}
        keepFocus
        onClick={toggleSettings}
        tip={settingsVisible ? t(`dashboard.settingsHide`) : t(`dashboard.settingsShow`)}
      />
      <div className={styles.textAreaWrap}>
        <TextArea
          ariaBusy={listening}
          collapsed={!focused}
          disabled={loading}
          maxLines={maxLines}
          onBlur={setInputBlurred}
          onChange={onTextChange}
          onFocus={setInputFocused}
          placeholder={t(`textComposer.textPlaceholder`)}
          readOnly={listening}
          ref={textAreaRef}
          value={text}
        />
      </div>
      <div className={styles.actionWrap}>
        <div
          className={`${styles.actionButton} ${hasDraft && !listening ? styles.actionVisible : styles.actionHidden}`}
        >
          <IconButton
            ariaBusy={processLoading}
            filled
            icon="process"
            keepFocus
            onClick={process}
            tip={loading ? t(`textComposer.submitting`) : t(`textComposer.submit`)}
          />
        </div>
        <div
          className={`${styles.actionButton} ${listening || (!hasDraft && focused) ? styles.actionVisible : styles.actionHidden}`}
        >
          <IconButton
            ariaPressed={listening}
            color={listening ? `error` : undefined}
            disabled={micDisabled}
            icon="microphone"
            keepFocus
            onClick={toggleRecording}
            tip={
              speechSupported
                ? listening
                  ? t(`textComposer.voiceStop`)
                  : t(`textComposer.voiceStart`)
                : t(`textComposer.voiceUnavailable`)
            }
          />
        </div>
      </div>
    </div>
    {settingsVisible ? (
      <div className={styles.settings}>
        <SettingsPanel disabled={loading} onChange={setOptions} value={options} />
      </div>
    ) : undefined}
  </div>
);
