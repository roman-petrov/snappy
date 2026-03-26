import { Alert } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { t } from "../../core";
import { Limit, TextCard, TextComposer } from "./components";
import styles from "./Dashboard.module.scss";

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
            <TextComposer
              loading={loading}
              onSubmit={processText}
              onTextChange={setText}
              options={options}
              setOptions={setOptions}
              showResult={showResult}
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
