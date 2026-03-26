import { _ } from "@snappy/core";
import { IconButton, Tap } from "@snappy/ui";

import type { useTextComposerState } from "./TextComposer.state";

import { ProcessButton } from "./ProcessButton";
import { SettingsPanel } from "./settings-panel";
import styles from "./TextComposer.module.scss";

export type TextComposerViewProps = ReturnType<typeof useTextComposerState>;

export const TextComposerView = ({
  expand,
  hasDraft,
  loading,
  onSubmit,
  onTextChange,
  options,
  placeholder,
  setOptions,
  showBlur,
  showSettings,
  submitAriaLabel,
  submitBusyAriaLabel,
  text,
  textareaRef,
  toggleSettings,
}: TextComposerViewProps) => (
  <div className={styles.wrap}>
    <div className={styles.inputWrap}>
      <textarea
        className={styles.textarea}
        disabled={loading}
        onChange={event => onTextChange(event.currentTarget.value)}
        placeholder={placeholder}
        readOnly={showBlur}
        ref={textareaRef}
        rows={1}
        value={text}
      />
      {showBlur && (
        <Tap ariaLabel={submitAriaLabel} cn={_.cn(styles.blurTap)} disabled={loading} onClick={expand}>
          <span aria-hidden />
        </Tap>
      )}
      <div className={styles.process}>
        <IconButton
          ariaLabel={showSettings ? `Hide settings` : `Show settings`}
          disabled={loading}
          icon={showSettings ? `⬆️` : `⬇️`}
          onClick={toggleSettings}
        />
        <ProcessButton
          ariaLabel={loading ? submitBusyAriaLabel : submitAriaLabel}
          disabled={loading || !hasDraft}
          loading={loading}
          onClick={onSubmit}
        />
      </div>
    </div>
    {showSettings && (
      <div className={styles.settings}>
        <SettingsPanel disabled={loading} onChange={setOptions} value={options} />
      </div>
    )}
  </div>
);
