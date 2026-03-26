import { IconButton, TextArea } from "@snappy/ui";

import type { useTextComposerState } from "./TextComposer.state";

import { t } from "../../../core";
import { ProcessButton } from "./ProcessButton";
import { SettingsPanel } from "./settings-panel";
import styles from "./TextComposer.module.scss";

export type TextComposerViewProps = ReturnType<typeof useTextComposerState>;

export const TextComposerView = ({
  hasDraft,
  loading,
  maxLines,
  onSubmit,
  onTextChange,
  options,
  setOptions,
  showSettings,
  text,
  toggleSettings,
}: TextComposerViewProps) => (
  <div className={styles.wrap}>
    <div className={styles.inputWrap}>
      <IconButton
        disabled={loading}
        icon={showSettings ? `⬆️` : `⬇️`}
        onClick={toggleSettings}
        onMouseDown={event => event.preventDefault()}
        tip={showSettings ? t(`textComposer.settingsHide`) : t(`textComposer.settingsShow`)}
      />
      <div className={styles.textAreaWrap}>
        <TextArea
          disabled={loading}
          maxLines={maxLines}
          onChange={onTextChange}
          placeholder={t(`textComposer.textPlaceholder`)}
          value={text}
        />
      </div>
      <ProcessButton
        disabled={loading || !hasDraft}
        loading={loading}
        onClick={onSubmit}
        tip={loading ? t(`textComposer.submitting`) : t(`textComposer.submit`)}
      />
    </div>
    {showSettings && (
      <div className={styles.settings}>
        <SettingsPanel disabled={loading} onChange={setOptions} value={options} />
      </div>
    )}
  </div>
);
