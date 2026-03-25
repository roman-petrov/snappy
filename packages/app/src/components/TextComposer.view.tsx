import { _ } from "@snappy/core";
import { Tap } from "@snappy/ui";

import type { useTextComposerState } from "./TextComposer.state";

import { ProcessButton } from "./ProcessButton";
import styles from "./TextComposer.module.scss";

export type TextComposerViewProps = ReturnType<typeof useTextComposerState>;

export const TextComposerView = ({
  expand,
  hasDraft,
  loading,
  onSubmit,
  onTextChange,
  placeholder,
  showBlur,
  submitAriaLabel,
  submitBusyAriaLabel,
  text,
  textareaRef,
}: TextComposerViewProps) => (
  <div className={styles.wrap}>
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
    {showBlur ? (
      <Tap ariaLabel={submitAriaLabel} cn={_.cn(styles.blurTap)} disabled={loading} onClick={expand}>
        <span aria-hidden />
      </Tap>
    ) : undefined}
    <div className={styles.process}>
      <ProcessButton
        ariaLabel={loading ? submitBusyAriaLabel : submitAriaLabel}
        disabled={loading || !hasDraft}
        loading={loading}
        onClick={onSubmit}
      />
    </div>
  </div>
);
