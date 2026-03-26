import { IconButton } from "@snappy/ui";

import type { useTextComposerState } from "./TextComposer.state";

import { t } from "../core";
import { ProcessButton } from "./ProcessButton";
import { SettingsPanel } from "./settings-panel";
import styles from "./TextComposer.module.scss";

export type TextComposerViewProps = ReturnType<typeof useTextComposerState>;

export const TextComposerView = ({
  hasDraft,
  loading,
  onSubmit,
  onTextChange,
  options,
  placeholder,
  setOptions,
  showSettings,
  submitAriaLabel,
  submitBusyAriaLabel,
  text,
  toggleSettings,
}: TextComposerViewProps) => (
  <div className={styles.wrap}>
    <div className={styles.inputWrap}>
      <IconButton
        disabled={loading}
        icon={showSettings ? `⬆️` : `⬇️`}
        onClick={toggleSettings}
        tip={showSettings ? t(`dashboard.settingsHide`) : t(`dashboard.settingsShow`)}
      />
      <textarea
        className={styles.textarea}
        disabled={loading}
        onChange={event => onTextChange(event.currentTarget.value)}
        placeholder={placeholder}
        rows={1}
        value={text}
      />
      <ProcessButton
        disabled={loading || !hasDraft}
        loading={loading}
        onClick={onSubmit}
        tip={loading ? submitBusyAriaLabel : submitAriaLabel}
      />
    </div>
    {showSettings && (
      <div className={styles.settings}>
        <SettingsPanel disabled={loading} onChange={setOptions} value={options} />
      </div>
    )}
  </div>
);
