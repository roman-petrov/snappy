/* eslint-disable functional/no-expression-statements */
import { Alert, Tabs } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { ProcessButton, Protect, SmallButton, TextCard } from "./components";
import styles from "./Dashboard.module.scss";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

export const DashboardView = ({
  actionEditLabel,
  actionNewLabel,
  addEmojiBtnClassKeys,
  addEmojiLabel,
  addFormattingBtnClassKeys,
  addFormattingLabel,
  errorText,
  lengthLabel,
  lengthOptions,
  loading,
  mobile,
  onClear,
  onCopyResult,
  onLengthChange,
  onOptionChange,
  onStyleChange,
  onSubmit,
  onSwitchToEdit,
  onTextChange,
  options,
  processButtonDisabled,
  processButtonDisabledEmpty,
  result,
  sectionClassKey,
  showError,
  showResult,
  styleLabel,
  styleOptions,
  submitButtonText,
  text,
  toolbarButtonCopyTitle,
  toolbarButtonFull,
  toolbarButtonIcon,
  toolbarButtonLabel,
}: DashboardViewProps) => (
  <Protect>
    <section className={`${styles.section} ${styles[sectionClassKey]}`} data-mobile={mobile}>
      <TextCard
        compact={mobile}
        loading={loading}
        onTextChange={onTextChange}
        result={result}
        showResult={showResult}
        text={text}
      />
      <div className={styles.controls}>
        <div className={styles.toggleRow} role="group">
          <button
            aria-pressed={options.addEmoji}
            className={[styles.toggleBtn, ...addEmojiBtnClassKeys.map(key => styles[key])].join(` `)}
            disabled={loading}
            onClick={() => onOptionChange(`addEmoji`, options.addEmoji !== true)}
            type="button"
          >
            {addEmojiLabel}
          </button>
          <button
            aria-pressed={options.addFormatting}
            className={[styles.toggleBtn, ...addFormattingBtnClassKeys.map(key => styles[key])].join(` `)}
            disabled={loading}
            onClick={() => onOptionChange(`addFormatting`, options.addFormatting !== true)}
            type="button"
          >
            {addFormattingLabel}
          </button>
        </div>
        <Tabs
          ariaLabel={lengthLabel}
          cn={styles.tabsLength}
          disabled={loading}
          onChange={onLengthChange}
          options={lengthOptions}
          value={options.length ?? `keep`}
        />
        <Tabs
          ariaLabel={styleLabel}
          cn={styles.tabsStyle}
          disabled={loading}
          onChange={onStyleChange}
          options={styleOptions}
          value={options.style ?? `neutral`}
        />
        <div className={styles.submitRow}>
          <form
            className={styles.submitForm}
            onSubmit={event => {
              void onSubmit(event);
            }}
          >
            <ProcessButton
              compact={mobile}
              disabled={processButtonDisabled}
              disabledEmpty={processButtonDisabledEmpty}
              loading={loading}
              text={submitButtonText}
            />
          </form>
          {showResult ? (
            <>
              <SmallButton
                compact={mobile}
                icon="✨"
                label={mobile ? undefined : actionNewLabel}
                onClick={onClear}
                title={actionNewLabel}
                variant="neutral"
              />
              <SmallButton
                compact={mobile}
                icon="✎"
                label={mobile ? undefined : actionEditLabel}
                onClick={onSwitchToEdit}
                title={actionEditLabel}
                variant="neutral"
              />
              <SmallButton
                compact={mobile}
                full={toolbarButtonFull}
                icon={toolbarButtonIcon}
                label={toolbarButtonLabel}
                onClick={onCopyResult}
                title={toolbarButtonCopyTitle}
                variant="copy"
              />
            </>
          ) : undefined}
        </div>
        {showError ? <Alert text={errorText} variant="error" /> : undefined}
      </div>
    </section>
  </Protect>
);
