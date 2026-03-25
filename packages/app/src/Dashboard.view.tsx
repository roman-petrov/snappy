import { Alert } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { SettingsPanel, TextCard, TextComposer } from "./components";
import { t } from "./core";
import styles from "./Dashboard.module.scss";
import { Limit } from "./Limit";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

export const DashboardView = ({
  error,
  initLoading,
  limitReached,
  loading,
  options,
  processText,
  result,
  setOptions,
  setText,
  showResult,
  text,
}: DashboardViewProps) =>
  initLoading ? undefined : limitReached ? (
    <Limit />
  ) : (
    <section className={styles.section}>
      <div className={styles.main}>
        <div className={styles.controlsSlot}>
          <div className={styles.controls}>
            <div className={styles.inputOptions}>
              <SettingsPanel disabled={loading} onChange={setOptions} value={options} />
            </div>
            <TextComposer
              loading={loading}
              onSubmit={processText}
              onTextChange={setText}
              placeholder={t(`dashboard.textPlaceholder`)}
              showResult={showResult}
              submitAriaLabel={t(`dashboard.submit`)}
              submitBusyAriaLabel={t(`dashboard.submitting`)}
              text={text}
            />
            {error === `` ? undefined : <Alert text={t(`dashboard.errors.${error}`)} variant="error" />}
          </div>
        </div>
        <div className={`${styles.resultSlot} ${styles.scroll}`}>
          {showResult ? <TextCard loading={loading} result={result} /> : undefined}
        </div>
      </div>
    </section>
  );
